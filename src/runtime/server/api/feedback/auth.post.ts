import { defineEventHandler, readBody, setCookie, createError, getRequestIP } from 'h3'
import { useRuntimeConfig } from '#imports'
import { checkPassword, issueSession } from '../../utils/storage'

const LOCK_THRESHOLD = 10
const LOCK_WINDOW_MS = 60_000
const attempts = new Map<string, { count: number; firstAt: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.firstAt > LOCK_WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now })
    return true
  }
  entry.count += 1
  if (entry.count > LOCK_THRESHOLD) return false
  return true
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const fpConfig = config.feedbackPins as Record<string, unknown>
  const password = fpConfig?.password as string
  const cookieName = (fpConfig?.cookieName as string) || 'fp-session'
  const sessionHours = (fpConfig?.sessionDuration as number) || 24

  if (!password) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Feedback pins password not configured',
    })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!rateLimit(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Please wait a minute.',
    })
  }

  const body = await readBody(event)
  const submitted = typeof body?.password === 'string' ? body.password : ''

  if (!checkPassword(submitted, password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password',
    })
  }

  const token = issueSession(sessionHours)

  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    maxAge: sessionHours * 60 * 60,
    path: '/',
  })

  return { success: true }
})
