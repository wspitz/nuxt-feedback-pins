import { resolve as resolvePath } from 'path'
import { defineNuxtModule, addPlugin, addServerHandler, createResolver, addImportsDir } from '@nuxt/kit'
import { defu } from 'defu'
import type { FeedbackPinsOptions } from './types'

export default defineNuxtModule<FeedbackPinsOptions>({
  meta: {
    name: 'nuxt-feedback-pins',
    configKey: 'feedbackPins',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    password: '',
    storagePath: './feedback-data',
    enabled: true,
    accentColor: '#FF6B35',
    defaultAuthor: 'Gast',
    maxPinsPerPage: 50,
    cookieName: 'fp-session',
    sessionDuration: 24,
  },
  setup(options, nuxt) {
    // Skip if disabled
    if (!options.enabled) return

    // Warn if no password is set
    if (!options.password) {
      console.warn('[nuxt-feedback-pins] No password configured! Set `feedbackPins.password` in your nuxt.config.ts')
    }

    const { resolve } = createResolver(import.meta.url)

    // Make options available at runtime
    nuxt.options.runtimeConfig.feedbackPins = defu(
      nuxt.options.runtimeConfig.feedbackPins as Record<string, unknown> || {},
      {
        password: options.password,
        maxPinsPerPage: options.maxPinsPerPage,
        cookieName: options.cookieName,
        sessionDuration: options.sessionDuration,
      }
    )

    // Public runtime config (no secrets!)
    nuxt.options.runtimeConfig.public.feedbackPins = defu(
      nuxt.options.runtimeConfig.public.feedbackPins as Record<string, unknown> || {},
      {
        enabled: options.enabled,
        accentColor: options.accentColor,
        defaultAuthor: options.defaultAuthor,
      }
    )

    // Register Nitro unstorage mountpoint `feedback`.
    // Default: local filesystem at `storagePath` (good for dev).
    // Override: user can pass any unstorage driver via `feedbackPins.storage`
    // in nuxt.config (e.g. vercelKV, redis, s3) — defu preserves their value.
    const defaultStorage = options.storage || {
      driver: 'fs',
      base: resolvePath(nuxt.options.rootDir, options.storagePath || './feedback-data'),
    }
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      storage: {
        feedback: defaultStorage,
      },
      devStorage: {
        feedback: defaultStorage,
      },
    })

    // Add client-only plugin
    addPlugin({
      src: resolve('./runtime/plugin.client'),
      mode: 'client',
    })

    // Add composables
    addImportsDir(resolve('./runtime/composables'))

    // Add server API routes
    addServerHandler({
      route: '/api/feedback/auth',
      method: 'post',
      handler: resolve('./runtime/server/api/feedback/auth.post'),
    })

    addServerHandler({
      route: '/api/feedback/auth',
      method: 'get',
      handler: resolve('./runtime/server/api/feedback/auth.get'),
    })

    addServerHandler({
      route: '/api/feedback',
      method: 'get',
      handler: resolve('./runtime/server/api/feedback/index.get'),
    })

    addServerHandler({
      route: '/api/feedback',
      method: 'post',
      handler: resolve('./runtime/server/api/feedback/index.post'),
    })

    addServerHandler({
      route: '/api/feedback',
      method: 'patch',
      handler: resolve('./runtime/server/api/feedback/index.patch'),
    })
  },
})
