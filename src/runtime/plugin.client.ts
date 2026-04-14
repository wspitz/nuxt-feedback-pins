import { createApp, h } from 'vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import FeedbackOverlay from './components/FeedbackOverlay.vue'
import './assets/feedback.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    if (document.getElementById('__fp-root')) return

    const publicConfig = useRuntimeConfig().public.feedbackPins as Record<string, unknown> | undefined
    const accent = (publicConfig?.accentColor as string) || '#FF6B35'

    const container = document.createElement('div')
    container.id = '__fp-root'
    container.style.setProperty('--fp-accent', accent)
    document.body.appendChild(container)

    const app = createApp({ render: () => h(FeedbackOverlay) })

    Object.assign(
      app._context.provides,
      nuxtApp.vueApp._context.provides,
    )
    app._context.components = nuxtApp.vueApp._context.components
    app._context.directives = nuxtApp.vueApp._context.directives

    app.mount(container)

    if (import.meta.hot) {
      import.meta.hot.on('vite:beforeFullReload', () => {
        app.unmount()
        container.remove()
      })
    }
  })
})
