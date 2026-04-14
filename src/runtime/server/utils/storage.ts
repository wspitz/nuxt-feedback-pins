import { resolve } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { randomBytes, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'
import { useRuntimeConfig, getCookie } from '#imports'

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

/**
 * Get the storage directory path, ensuring it exists
 */
export function getStorageDir(): string {
  const config = useRuntimeConfig()
  const storagePath = (config.feedbackPins as Record<string, unknown>)?.storagePath as string || './feedback-data'
  const dir = resolve(process.cwd(), storagePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

/**
 * Read feedback data for a specific route
 */
export function readFeedbackFile(route: string): FeedbackPage {
  const dir = getStorageDir()
  const filename = routeToFilename(route)
  const filepath = resolve(dir, `${filename}.json`)

  if (!existsSync(filepath)) {
    return { route, pins: [] }
  }

  try {
    const raw = readFileSync(filepath, 'utf-8')
    return JSON.parse(raw) as FeedbackPage
  } catch {
    return { route, pins: [] }
  }
}

/**
 * Write feedback data for a specific route
 */
export function writeFeedbackFile(data: FeedbackPage): void {
  const dir = getStorageDir()
  const filename = routeToFilename(data.route)
  const filepath = resolve(dir, `${filename}.json`)
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
}

export function isAuthenticated(event: H3Event): boolean {
  const config = useRuntimeConfig()
  const fpConfig = config.feedbackPins as Record<string, unknown>
  const cookieName = (fpConfig?.cookieName as string) || 'fp-session'
  return verifySession(getCookie(event, cookieName))
}
