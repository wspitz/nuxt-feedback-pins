import { defineEventHandler, getQuery, createError } from 'h3'
import { isAuthenticated, readFeedbackFile, sanitizeRoute } from '../../utils/storage'

export default defineEventHandler((event) => {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const route = sanitizeRoute(getQuery(event).route)
  if (!route) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing route parameter' })
  }

  return readFeedbackFile(route)
})
