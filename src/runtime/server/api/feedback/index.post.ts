import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { isAuthenticated, readFeedbackFile, writeFeedbackFile, generateId, sanitizeRoute, clampText } from '../../utils/storage'
import type { CreatePinPayload, FeedbackPin } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const config = useRuntimeConfig()
  const fpConfig = config.feedbackPins as Record<string, unknown>
  const maxPins = (fpConfig?.maxPinsPerPage as number) || 50

  const body = await readBody<CreatePinPayload>(event)
  const route = sanitizeRoute(body?.route)
  if (!route) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing route' })
  }
  if (typeof body.x !== 'number' || typeof body.y !== 'number'
    || body.x < 0 || body.x > 100 || body.y < 0 || body.y > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid coordinates' })
  }
  const text = clampText(body.text, 2000)
  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'Missing text' })
  }
  const author = clampText(body.author, 80, 'Gast')

  const data = await readFeedbackFile(route)

  if (data.pins.length >= maxPins) {
    throw createError({ statusCode: 429, statusMessage: `Maximum of ${maxPins} pins per page reached` })
  }

  const vw = body.viewport && typeof body.viewport.width === 'number' ? body.viewport.width : 0
  const vh = body.viewport && typeof body.viewport.height === 'number' ? body.viewport.height : 0

  const now = new Date().toISOString()

  const pin: FeedbackPin = {
    id: generateId('pin'),
    x: body.x,
    y: body.y,
    viewport: { width: vw, height: vh },
    author,
    createdAt: now,
    resolved: false,
    comments: [
      {
        id: generateId('cmt'),
        author,
        text,
        createdAt: now,
      },
    ],
  }

  data.pins.push(pin)
  await writeFeedbackFile(data)

  return pin
})
