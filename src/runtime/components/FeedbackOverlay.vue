<template>
  <div v-if="enabled">
    <!-- Feedback overlay (covers entire page for pin placement) -->
    <div
      v-if="isAuthenticated && feedbackMode"
      class="__fp-overlay"
      :class="{ '__fp-overlay-placing': isPlacing }"
      @click="handleOverlayClick"
    >
      <!-- Placing indicator -->
      <div v-if="isPlacing" class="__fp-placing-hint">
        Klicke auf eine Stelle um einen Pin zu setzen
      </div>
    </div>

    <!-- Pin layer (always visible when authenticated, under the overlay) -->
    <div v-if="isAuthenticated" class="__fp-pin-layer" :style="pinLayerStyle">
      <FeedbackPin
        v-for="(pin, idx) in visiblePins"
        :key="pin.id"
        :pin="pin"
        :number="idx + 1"
        :is-active="activePin === pin.id"
        :doc-width="docWidth"
        :doc-height="docHeight"
        @toggle="togglePin(pin.id)"
        @reply="(text) => handleReply(pin.id, text)"
        @resolve="resolvePin(pin.id)"
        @unresolve="unresolvePin(pin.id)"
        @delete="deletePin(pin.id)"
      />

      <!-- New pin composer -->
      <div
        v-if="newPinPos"
        class="__fp-pin-wrapper __fp-pin-new"
        :style="{
          left: (newPinPos.x * docWidth / 100) + 'px',
          top: (newPinPos.y * docHeight / 100) + 'px',
        }"
      >
        <div class="__fp-pin-marker __fp-pin-marker-new">
          <span class="__fp-pin-number">+</span>
        </div>
        <FeedbackComposer
          :x="newPinPos.x"
          :y="newPinPos.y"
          @submit="handleNewPin"
          @cancel="cancelNewPin"
        />
      </div>
    </div>

    <!-- FAB (Floating Action Button) -->
    <div class="__fp-fab-container">
      <!-- Pill menu (shown when FAB is expanded) -->
      <div v-if="showMenu && isAuthenticated" class="__fp-fab-menu">
        <button
          class="__fp-fab-menu-item"
          :class="{ '__fp-active': feedbackMode }"
          @click="toggleFeedbackMode"
        >
          {{ feedbackMode ? '✏️ Modus beenden' : '📌 Pin setzen' }}
        </button>
        <button
          class="__fp-fab-menu-item"
          @click="toggleResolved"
        >
          {{ showResolved ? '🙈 Erledigte ausblenden' : '👁️ Erledigte anzeigen' }}
        </button>
        <div class="__fp-fab-menu-divider" />
        <div class="__fp-fab-menu-info">
          {{ pins.length }} Pin{{ pins.length !== 1 ? 's' : '' }} auf dieser Seite
        </div>
      </div>

      <button
        class="__fp-fab"
        :class="{
          '__fp-fab-active': feedbackMode,
          '__fp-fab-authenticated': isAuthenticated,
        }"
        @click="handleFabClick"
      >
        <svg v-if="!isAuthenticated" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="__fp-fab-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <svg v-else-if="showMenu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="__fp-fab-icon">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="__fp-fab-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span v-if="isAuthenticated && pins.length > 0 && !showMenu" class="__fp-fab-badge">
          {{ unresolvedCount }}
        </span>
      </button>
    </div>

    <!-- Login Modal -->
    <FeedbackLoginModal
      :visible="showLogin"
      @close="showLogin = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useFeedback } from '../composables/useFeedback'
import { useFeedbackAuth } from '../composables/useFeedbackAuth'
import FeedbackPin from './FeedbackPin.vue'
import FeedbackComposer from './FeedbackComposer.vue'
import FeedbackLoginModal from './FeedbackLoginModal.vue'

const config = useRuntimeConfig()
const publicConfig = config.public.feedbackPins as Record<string, unknown>
const enabled = (publicConfig?.enabled as boolean) ?? true

const {
  pins,
  feedbackMode,
  activePin,
  showResolved,
  loadPins,
  createPin,
  replyToPin,
  resolvePin,
  unresolvePin,
  deletePin,
} = useFeedback()

const { isAuthenticated, checkAuth, authorName } = useFeedbackAuth()

const showLogin = ref(false)
const showMenu = ref(false)
const isPlacing = ref(false)
const newPinPos = ref<{ x: number; y: number } | null>(null)
const docWidth = ref(0)
const docHeight = ref(0)
const scrollX = ref(0)
const scrollY = ref(0)

const pinLayerStyle = computed(() => ({
  transform: `translate(${-scrollX.value}px, ${-scrollY.value}px)`,
}))

let resizeObserver: ResizeObserver | null = null

function measureDoc() {
  const el = document.documentElement
  docWidth.value = Math.max(el.scrollWidth, el.clientWidth)
  docHeight.value = Math.max(el.scrollHeight, el.clientHeight)
}

function measureScroll() {
  scrollX.value = window.scrollX || window.pageXOffset || 0
  scrollY.value = window.scrollY || window.pageYOffset || 0
}

const visiblePins = computed(() => {
  if (showResolved.value) return pins.value
  return pins.value.filter(p => !p.resolved)
})

const unresolvedCount = computed(() => {
  return pins.value.filter(p => !p.resolved).length
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (showLogin.value) return
  if (newPinPos.value) {
    newPinPos.value = null
    isPlacing.value = feedbackMode.value
    return
  }
  if (feedbackMode.value) {
    feedbackMode.value = false
    isPlacing.value = false
    showMenu.value = false
    activePin.value = null
  }
  else if (activePin.value) {
    activePin.value = null
  }
}

onMounted(async () => {
  if (!enabled) return

  measureDoc()
  measureScroll()
  window.addEventListener('resize', measureDoc)
  window.addEventListener('scroll', measureScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(measureDoc)
    resizeObserver.observe(document.documentElement)
    resizeObserver.observe(document.body)
  }

  const authed = await checkAuth()
  if (authed) {
    await loadPins()
  }
  measureDoc()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureDoc)
  window.removeEventListener('scroll', measureScroll)
  window.removeEventListener('keydown', handleKeydown)
  resizeObserver?.disconnect()
  resizeObserver = null
})

function handleFabClick() {
  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }
  showMenu.value = !showMenu.value
}

async function handleLoginSuccess() {
  showLogin.value = false
  await loadPins()
  feedbackMode.value = true
  isPlacing.value = true
  showMenu.value = false
}

function toggleFeedbackMode() {
  feedbackMode.value = !feedbackMode.value
  isPlacing.value = feedbackMode.value
  showMenu.value = false
  newPinPos.value = null
  activePin.value = null
}

function toggleResolved() {
  showResolved.value = !showResolved.value
  showMenu.value = false
}

function handleOverlayClick(event: MouseEvent) {
  if (!isPlacing.value) return

  // Calculate percentage position relative to the full document
  const scrollWidth = document.documentElement.scrollWidth
  const scrollHeight = document.documentElement.scrollHeight
  const x = ((event.pageX) / scrollWidth) * 100
  const y = ((event.pageY) / scrollHeight) * 100

  newPinPos.value = { x, y }
  isPlacing.value = false
}

async function handleNewPin(text: string) {
  if (!newPinPos.value) return
  await createPin(newPinPos.value.x, newPinPos.value.y, authorName.value, text)
  newPinPos.value = null
  isPlacing.value = true // Ready for next pin
}

function cancelNewPin() {
  newPinPos.value = null
  isPlacing.value = true
}

function togglePin(pinId: string) {
  activePin.value = activePin.value === pinId ? null : pinId
}

async function handleReply(pinId: string, text: string) {
  await replyToPin(pinId, authorName.value, text)
}
</script>
