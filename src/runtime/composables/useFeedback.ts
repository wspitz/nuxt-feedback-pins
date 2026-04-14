import { ref, watch } from 'vue'
import { useRoute } from '#imports'
import type { FeedbackPin, FeedbackPage } from '../../types'

const pins = ref<FeedbackPin[]>([])
const isLoading = ref(false)
const feedbackMode = ref(false)
const activePin = ref<string | null>(null)
const showResolved = ref(true)

export function useFeedback() {
  const route = useRoute()

  async function loadPins() {
    isLoading.value = true
    try {
      const data = await $fetch<FeedbackPage>('/api/feedback', {
        params: { route: route.path },
      })
      pins.value = data.pins || []
    } catch {
      pins.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createPin(x: number, y: number, author: string, text: string) {
    try {
      const pin = await $fetch<FeedbackPin>('/api/feedback', {
        method: 'POST',
        body: {
          route: route.path,
          x,
          y,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          author,
          text,
        },
      })
      pins.value.push(pin)
      activePin.value = pin.id
      return pin
    } catch (err) {
      console.error('[feedback-pins] Failed to create pin:', err)
      return null
    }
  }

  async function replyToPin(pinId: string, author: string, text: string) {
    try {
      const updated = await $fetch<FeedbackPin>('/api/feedback', {
        method: 'PATCH',
        body: {
          route: route.path,
          pinId,
          action: 'reply',
          author,
          text,
        },
      })
      const idx = pins.value.findIndex(p => p.id === pinId)
      if (idx !== -1) pins.value[idx] = updated
      return updated
    } catch (err) {
      console.error('[feedback-pins] Failed to reply:', err)
      return null
    }
  }

  async function resolvePin(pinId: string) {
    try {
      const updated = await $fetch<FeedbackPin>('/api/feedback', {
        method: 'PATCH',
        body: {
          route: route.path,
          pinId,
          action: 'resolve',
        },
      })
      const idx = pins.value.findIndex(p => p.id === pinId)
      if (idx !== -1) pins.value[idx] = updated
    } catch (err) {
      console.error('[feedback-pins] Failed to resolve:', err)
    }
  }

  async function unresolvePin(pinId: string) {
    try {
      const updated = await $fetch<FeedbackPin>('/api/feedback', {
        method: 'PATCH',
        body: {
          route: route.path,
          pinId,
          action: 'unresolve',
        },
      })
      const idx = pins.value.findIndex(p => p.id === pinId)
      if (idx !== -1) pins.value[idx] = updated
    } catch (err) {
      console.error('[feedback-pins] Failed to unresolve:', err)
    }
  }

  async function deletePin(pinId: string) {
    try {
      await $fetch('/api/feedback', {
        method: 'PATCH',
        body: {
          route: route.path,
          pinId,
          action: 'delete',
        },
      })
      pins.value = pins.value.filter(p => p.id !== pinId)
      if (activePin.value === pinId) activePin.value = null
    } catch (err) {
      console.error('[feedback-pins] Failed to delete:', err)
    }
  }

  // Reload pins on route change
  watch(() => route.path, () => {
    loadPins()
    activePin.value = null
  })

  return {
    pins,
    isLoading,
    feedbackMode,
    activePin,
    showResolved,
    loadPins,
    createPin,
    replyToPin,
    resolvePin,
    unresolvePin,
    deletePin,
  }
}
