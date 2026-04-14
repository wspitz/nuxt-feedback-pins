import { defineEventHandler, readBody, createError } from 'h3'
import { isAuthenticated, readFeedbackFile, writeFeedbackFile, generateId, sanitizeRoute, clampText } from '../../utils/storage'
import type { PatchPinPayload } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const body = await readBody<PatchPinPayload>(event)
  const route = sanitizeRoute(body?.route)
  if (!route || typeof body?.pinId !== 'string' || !body?.action) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: route, pinId, action' })
  }

  const data = readFeedbackFile(route)
  const pinIndex = data.pins.findIndex(p => p.id === body.pinId)

  if (pinIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Pin not found' })
  }

  const pin = data.pins[pinIndex]

  switch (body.action) {
    case 'reply': {
      const text = clampText(body.text, 2000)
      if (!text) {
        throw createError({ statusCode: 400, statusMessage: 'Missing text for reply' })
      }
      pin.comments.push({
        id: generateId('cmt'),
        author: clampText(body.author, 80, 'Gast'),
        text,
        createdAt: new Date().toISOString(),
      })
      break
    }
    case 'resolve': {
      pin.resolved = true
      break
    }
    case 'unresolve': {
      pin.resolved = false
      break
    }
    case 'delete': {
      data.pins.splice(pinIndex, 1)
      break
    }
    default:
      throw createError({ statusCode: 400, statusMessage: `Unknown action: ${body.action}` })
  }

  writeFeedbackFile(data)
  return body.action === 'delete' ? { deleted: true } : pin
})
