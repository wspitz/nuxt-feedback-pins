export interface FeedbackPinsOptions {
  /** Shared password for client access */
  password: string
  /** Directory for JSON storage files (default: ./feedback-data) */
  storagePath?: string
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
