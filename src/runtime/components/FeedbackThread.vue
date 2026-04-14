<template>
  <div class="__fp-thread" @click.stop>
    <div class="__fp-thread-header">
      <span class="__fp-thread-title">
        Pin #{{ pinNumber }}
        <span v-if="pin.resolved" class="__fp-badge __fp-badge-resolved">Erledigt</span>
      </span>
      <div class="__fp-thread-actions">
        <button
          v-if="!pin.resolved"
          class="__fp-btn __fp-btn-ghost __fp-btn-xs"
          title="Als erledigt markieren"
          @click="$emit('resolve')"
        >
          ✓
        </button>
        <button
          v-else
          class="__fp-btn __fp-btn-ghost __fp-btn-xs"
          title="Wieder öffnen"
          @click="$emit('unresolve')"
        >
          ↺
        </button>
        <button
          class="__fp-btn __fp-btn-ghost __fp-btn-xs __fp-btn-danger"
          title="Löschen"
          @click="confirmDelete"
        >
          ✕
        </button>
        <button
          class="__fp-btn __fp-btn-ghost __fp-btn-xs"
          title="Schließen"
          @click="$emit('close')"
        >
          —
        </button>
      </div>
    </div>

    <div class="__fp-thread-comments">
      <div
        v-for="comment in pin.comments"
        :key="comment.id"
        class="__fp-comment"
      >
        <div class="__fp-comment-header">
          <span class="__fp-comment-author">{{ comment.author }}</span>
          <span class="__fp-comment-time">{{ formatTime(comment.createdAt) }}</span>
        </div>
        <p class="__fp-comment-text">{{ comment.text }}</p>
      </div>
    </div>

    <div class="__fp-thread-reply">
      <textarea
        v-model="replyText"
        class="__fp-composer-input __fp-composer-input-sm"
        placeholder="Antworten…"
        rows="2"
        @keydown.meta.enter="submitReply"
        @keydown.ctrl.enter="submitReply"
      />
      <button
        class="__fp-btn __fp-btn-primary __fp-btn-sm"
        :disabled="!replyText.trim()"
        @click="submitReply"
      >
        Antworten
      </button>
    </div>

    <div class="__fp-thread-meta">
      Erstellt bei {{ pin.viewport.width }}×{{ pin.viewport.height }}px
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FeedbackPin } from '../../types'

const props = defineProps<{
  pin: FeedbackPin
  pinNumber: number
}>()

const emit = defineEmits<{
  reply: [text: string]
  resolve: []
  unresolve: []
  delete: []
  close: []
}>()

const replyText = ref('')

function submitReply() {
  if (replyText.value.trim()) {
    emit('reply', replyText.value.trim())
    replyText.value = ''
  }
}

function confirmDelete() {
  if (window.confirm('Pin wirklich löschen? Das kann nicht rückgängig gemacht werden.')) {
    emit('delete')
  }
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'gerade eben'
  if (mins < 60) return `vor ${mins}m`
  if (hours < 24) return `vor ${hours}h`
  if (days < 7) return `vor ${days}d`

  return date.toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}
</script>
