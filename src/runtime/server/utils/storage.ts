import { randomBytes, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'
import { useRuntimeConfig, useStorage, getCookie } from '#imports'

const STORAGE_MOUNT = 'feedback'

function feedbackStorage() {
  return useStorage(STORAGE_MOUNT)
}

function storageKey(route: string): string {
  return `${routeToFilename(route)}.json`
}

const MAX_SESSIONS = 500
const sessions = new Map<string, number>()

export function issueSession(ttlHours: number): string {
  const token = randomBytes(32).toString('hex')
  const expiresAt = Date.now() + ttlHours * 60 * 60 * 1000
  sessions.set(token, expiresAt)
  if (sessions.size > MAX_SESSIONS) {
    const now = Date.now()
    for (const [t, exp] of sessions) {
      if (exp < now) sessions.delete(t)
    }
    if (sessions.size > MAX_SESSIONS) {
      const oldest = sessions.keys().next().value
      if (oldest) sessions.delete(oldest)
    }
  }
  return token
}

export function verifySession(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') return false
  const expiresAt = sessions.get(token)
  if (!expiresAt) return false
  if (expiresAt < Date.now()) {
    sessions.delete(token)
    return false
  }
  return true
}

export function checkPassword(input: string, expected: string): boolean {
  if (typeof input !== 'string' || typeof expected !== 'string') return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) {
    timingSafeEqual(a, a)
    return false
  }
  return timingSafeEqual(a, b)
}

export function sanitizeRoute(route: unknown): string | null {
  if (typeof route !== 'string') return null
  if (!route.startsWith('/')) return null
  if (route.length > 512) return null
  return route
}

export function clampText(value: unknown, max: number, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  if (!trimmed) return fallback
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

export interface FeedbackComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface FeedbackPin {
  id: string
  x: number
  y: number
  viewport: { width: number; height: number }
  author: string
  createdAt: string
  resolved: boolean
  comments: FeedbackComment[]
}

export interface FeedbackPage {
  route: string
  pins: FeedbackPin[]
}

export interface CreatePinPayload {
  route: string
  x: number
  y: number
  viewport: { width: number; height: number }
  author: string
  text: string
}

export interface PatchPinPayload {
  route: string
  pinId: string
  action: 'reply' | 'resolve' | 'unresolve' | 'delete'
  author?: string
  text?: string
}

export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}${random}`
}

export function routeToFilename(route: string): string {
  if (route === '/') return '_index'
  return route
    .replace(/^\//, '')
    .replace(/\//g, '--')
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
}

export async function readFeedbackFile(route: string): Promise<FeedbackPage> {
  try {
    const data = await feedbackStorage().getItem<FeedbackPage>(storageKey(route))
    if (data && typeof data === 'object' && Array.isArray((data as FeedbackPage).pins)) {
      return data as FeedbackPage
    }
  }
  catch (err) {
    console.error('[nuxt-feedback-pins] Failed to read storage:', err)
  }
  return { route, pins: [] }
}

export async function writeFeedbackFile(data: FeedbackPage): Promise<void> {
  await feedbackStorage().setItem(storageKey(data.route), data)
}

export function isAuthenticated(event: H3Event): boolean {
  const config = useRuntimeConfig()
  const fpConfig = config.feedbackPins as Record<string, unknown>
  const cookieName = (fpConfig?.cookieName as string) || 'fp-session'
  return verifySession(getCookie(event, cookieName))
}
