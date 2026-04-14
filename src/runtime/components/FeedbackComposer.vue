<template>
  <div class="__fp-composer" :style="positionStyle" @click.stop>
    <div class="__fp-composer-arrow" />
    <textarea
      ref="textareaRef"
      v-model="text"
      class="__fp-composer-input"
      placeholder="Kommentar schreiben…"
      rows="3"
      @keydown.meta.enter="submit"
      @keydown.ctrl.enter="submit"
    />
    <div class="__fp-composer-footer">
      <span class="__fp-composer-hint">⌘+Enter zum Senden</span>
      <div class="__fp-composer-actions">
        <button class="__fp-btn __fp-btn-ghost __fp-btn-sm" @click="$emit('cancel')">
          Abbrechen
        </button>
        <button
          class="__fp-btn __fp-btn-primary __fp-btn-sm"
          :disabled="!text.trim()"
          @click="submit"
        >
          Senden
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

const props = defineProps<{
  x: number
  y: number
}>()

const emit = defineEmits<{
  submit: [text: string]
  cancel: []
}>()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const positionStyle = computed(() => {
  // Position the composer near the pin, adjusting if too close to edges
  const left = props.x > 70 ? 'auto' : '24px'
  const right = props.x > 70 ? '24px' : 'auto'
  return {
    position: 'absolute' as const,
    left,
    right,
    top: '0',
  }
})

function submit() {
  if (text.value.trim()) {
    emit('submit', text.value.trim())
    text.value = ''
  }
}

onMounted(async () => {
  await nextTick()
  textareaRef.value?.focus()
})
</script>
