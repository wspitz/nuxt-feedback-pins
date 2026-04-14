<template>
  <Teleport to="body">
    <div v-if="visible" class="__fp-modal-backdrop" @click.self="$emit('close')">
      <div class="__fp-modal">
        <div class="__fp-modal-header">
          <svg class="__fp-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3 class="__fp-modal-title">Feedback</h3>
        </div>

        <p class="__fp-modal-desc">
          Passwort eingeben um Feedback zu hinterlassen.
        </p>

        <div class="__fp-modal-field">
          <label class="__fp-modal-label">Dein Name</label>
          <input
            v-model="name"
            type="text"
            class="__fp-modal-input"
            placeholder="z.B. Max Mustermann"
            @keydown.enter="handleLogin"
          />
        </div>

        <div class="__fp-modal-field">
          <label class="__fp-modal-label">Passwort</label>
          <input
            ref="passwordInput"
            v-model="password"
            type="password"
            class="__fp-modal-input"
            placeholder="Passwort"
            @keydown.enter="handleLogin"
          />
        </div>

        <p v-if="error" class="__fp-modal-error">{{ error }}</p>

        <div class="__fp-modal-actions">
          <button class="__fp-btn __fp-btn-ghost" @click="$emit('close')">
            Abbrechen
          </button>
          <button class="__fp-btn __fp-btn-primary" :disabled="loading" @click="handleLogin">
            {{ loading ? 'Prüfe…' : 'Einloggen' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useFeedbackAuth } from '../composables/useFeedbackAuth'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const { login, setAuthorName, authorName } = useFeedbackAuth()

const name = ref(authorName.value || '')
const password = ref('')
const error = ref('')
const loading = ref(false)
const passwordInput = ref<HTMLInputElement>()

watch(() => props.visible, async (val) => {
  if (val) {
    error.value = ''
    password.value = ''
    name.value = authorName.value || ''
    await nextTick()
    if (name.value) {
      passwordInput.value?.focus()
    }
  }
})

async function handleLogin() {
  if (!name.value.trim()) {
    error.value = 'Bitte einen Namen eingeben.'
    return
  }
  if (!password.value) {
    error.value = 'Bitte ein Passwort eingeben.'
    return
  }

  loading.value = true
  error.value = ''

  const success = await login(password.value)
  loading.value = false

  if (success) {
    setAuthorName(name.value.trim())
    emit('success')
  } else {
    error.value = 'Falsches Passwort.'
  }
}
</script>
