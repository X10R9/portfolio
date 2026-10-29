<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref(null)
const ring = ref(null)
const dot = ref(null)
const label = ref('')
const enabled = ref(false)

let raf = 0
let tx = -100
let ty = -100
let rx = -100
let ry = -100
let visible = false
let pressed = false

function render() {
  rx += (tx - rx) * 0.18
  ry += (ty - ry) * 0.18
  const scale = pressed ? 0.82 : 1
  if (ring.value) {
    ring.value.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`
  }
  if (dot.value) {
    dot.value.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
  }
  raf = requestAnimationFrame(render)
}

function show() {
  if (!root.value) return
  if (!visible) {
    visible = true
    root.value.style.opacity = '1'
  }
}

function onMove(event) {
  if (!enabled.value) return
  tx = event.clientX
  ty = event.clientY
  show()
}

function onOver(event) {
  if (!enabled.value) return
  const target = event.target.closest?.('a, button, [data-cursor]')
  if (!target) {
    root.value?.classList.remove('is-active')
    label.value = ''
    return
  }
  root.value?.classList.add('is-active')
  label.value = target.getAttribute('data-cursor') || ''
}

function onLeave() {
  if (!root.value) return
  visible = false
  root.value.style.opacity = '0'
}

function onDown() {
  pressed = true
  root.value?.classList.add('is-pressed')
}

function onUp() {
  pressed = false
  root.value?.classList.remove('is-pressed')
}

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return

  enabled.value = true
  document.body.classList.add('has-site-cursor')
  root.value.style.opacity = '0'
  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  document.addEventListener('pointerdown', onDown, { passive: true })
  document.addEventListener('pointerup', onUp, { passive: true })
  raf = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  if (!enabled.value) return
  document.body.classList.remove('has-site-cursor')
  document.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerover', onOver)
  document.removeEventListener('pointerleave', onLeave)
  document.removeEventListener('pointerdown', onDown)
  document.removeEventListener('pointerup', onUp)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="cursor" aria-hidden="true">
    <div ref="ring" class="cursor__ring">
      <span class="cursor__label">{{ label }}</span>
    </div>
    <div ref="dot" class="cursor__dot" />
  </div>
</template>

<style>
@media (hover: hover) and (pointer: fine) {
  body.has-site-cursor,
  body.has-site-cursor * {
    cursor: none !important;
  }
  body.has-site-cursor input,
  body.has-site-cursor textarea,
  body.has-site-cursor select {
    cursor: text !important;
  }
}

.cursor {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s var(--ease);
}

.cursor__ring {
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(28, 31, 31, 0.35);
  border-radius: 50%;
  will-change: transform;
  transition:
    width 0.35s var(--ease),
    height 0.35s var(--ease),
    background 0.35s var(--ease),
    border-color 0.35s var(--ease);
}

.cursor__label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.25s var(--ease);
}

.cursor__dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  will-change: transform;
  transition: transform 0.08s linear;
}

.cursor.is-active .cursor__ring {
  width: 68px;
  height: 68px;
  border-color: var(--accent);
  background: rgba(168, 91, 46, 0.08);
}

.cursor.is-active .cursor__label {
  opacity: 1;
}

.cursor.is-active .cursor__dot {
  width: 3px;
  height: 3px;
}

.cursor.is-pressed .cursor__ring {
  transform-origin: center;
  filter: brightness(0.92);
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    display: none;
  }
}
</style>
