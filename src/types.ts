export interface FeedbackStorageConfig {
  driver: string
  [key: string]: unknown
}

export interface FeedbackPinsOptions {
  /** Shared password for client access */
  password: string
  /**
   * Directory for local JSON storage files (default: ./feedback-data).
   * Only used when `storage` is not set. Ignored on serverless targets.
   */
  storagePath?: string
  /**
   * Nitro unstorage driver config. Overrides the default local-filesystem
   * storage. Use this to point the module at Vercel KV, Upstash Redis,
   * Cloudflare KV, S3, etc. Example:
   *   storage: { driver: 'vercelKV' }
   */
  storage?: FeedbackStorageConfig
  /** Enable/disable the module (default: true) */
  enabled?: boolean
  /** Accent color for pins and UI (default: #FF6B35) */
  accentColor?: string
  /** Default author name (default: Gast) */
  defaultAuthor?: string
  /** Max pins per page (default: 50) */
  maxPinsPerPage?: number
  /** Cookie name for session (default: fp-session) */
  cookieName?: string
  /** Session duration in hours (default: 24) */
  sessionDuration?: number
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
