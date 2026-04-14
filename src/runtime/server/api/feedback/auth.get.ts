import { defineEventHandler } from 'h3'
import { isAuthenticated } from '../../utils/storage'

export default defineEventHandler((event) => {
  return {
    authenticated: isAuthenticated(event),
  }
})
