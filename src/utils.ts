/**
 * Generate a short unique ID with prefix
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}${random}`
}

/**
 * Convert a route path to a safe filename
 * e.g. "/about/team" → "about--team"
 */
export function routeToFilename(route: string): string {
  if (route === '/') return '_index'
  return route
    .replace(/^\//, '')
    .replace(/\//g, '--')
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
}
