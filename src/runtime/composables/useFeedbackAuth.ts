import { ref } from 'vue'
import { useFetch, useRuntimeConfig } from '#imports'

const isAuthenticated = ref(false)
const isChecking = ref(false)
const authorName = ref('')

export function useFeedbackAuth() {
  const config = useRuntimeConfig()
  const publicConfig = config.public.feedbackPins as Record<string, unknown>
  const defaultAuthor = (publicConfig?.defaultAuthor as string) || 'Gast'

  // Initialize author name from localStorage if available
  if (process.client && !authorName.value) {
    authorName.value = localStorage.getItem('fp-author') || defaultAuthor
  }

  async function checkAuth(): Promise<boolean> {
    isChecking.value = true
    try {
      const { data } = await useFetch<{ authenticated: boolean }>('/api/feedback/auth', {
        method: 'GET',
      })
      isAuthenticated.value = data.value?.authenticated ?? false
      return isAuthenticated.value
    } catch {
      isAuthenticated.value = false
      return false
    } finally {
      isChecking.value = false
    }
  }

  async function login(password: string): Promise<boolean> {
    try {
      const response = await $fetch<{ success: boolean }>('/api/feedback/auth', {
        method: 'POST',
        body: { password },
      })
      isAuthenticated.value = response.success
      return response.success
    } catch {
      isAuthenticated.value = false
      return false
    }
  }

  function setAuthorName(name: string) {
    authorName.value = name
    if (process.client) {
      localStorage.setItem('fp-author', name)
    }
  }

  return {
    isAuthenticated,
    isChecking,
    authorName,
    checkAuth,
    login,
    setAuthorName,
  }
}
