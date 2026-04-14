<template>
  <div
    class="__fp-pin-wrapper"
    :class="{
      '__fp-pin-resolved': pin.resolved,
      '__fp-pin-active': isActive,
    }"
    :style="{
      left: pin.x + '%',
      top: pin.y + '%',
    }"
  >
    <!-- Pin Marker -->
    <button
      class="__fp-pin-marker"
      :title="`Pin #${number} von ${pin.author}`"
      @click.stop="$emit('toggle')"
    >
      <span class="__fp-pin-number">{{ number }}</span>
    </button>

    <!-- Comment count badge -->
    <span v-if="pin.comments.length > 1" class="__fp-pin-badge">
      {{ pin.comments.length }}
    </span>

    <!-- Thread (shown when active) -->
    <FeedbackThread
      v-if="isActive"
      :pin="pin"
      :pin-number="number"
      @reply="(text) => $emit('reply', text)"
      @resolve="$emit('resolve')"
      @unresolve="$emit('unresolve')"
      @delete="$emit('delete')"
      @close="$emit('toggle')"
    />
  </div>
</template>

<script setup lang="ts">
import type { FeedbackPin } from '../../types'
import FeedbackThread from './FeedbackThread.vue'

defineProps<{
  pin: FeedbackPin
  number: number
  isActive: boolean
}>()

defineEmits<{
  toggle: []
  reply: [text: string]
  resolve: []
  unresolve: []
  delete: []
}>()
</script>
