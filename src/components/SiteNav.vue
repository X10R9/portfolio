<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { siteState as site } from '../stores/site'

const links = [
  { id: 'home', href: '#home', label: '首页' },
  { id: 'about', href: '#about', label: '关于' },
  { id: 'work', href: '#work', label: '作品' },
  { id: 'contact', href: '#contact', label: '联系' }
]

const scrolled = ref(false)
const active = ref('home')
const progress = ref(0)
const menuOpen = ref(false)
const clock = ref('')

let clockTimer
let sectionObserver
let scrollHandler

const time = computed(() => clock.value)

function updateClock() {
  clock.value = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date())
}

function onScroll() {
  scrolled.value = window.scrollY > 24
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
}

function closeMenu() {
  menuOpen.value = false
}

onMounted(() => {
  updateClock()
  clockTimer = window.setInterval(updateClock, 1000)
  onScroll()
  scrollHandler = onScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) active.value = visible.target.id
    },
    { rootMargin: '-42% 0px -50% 0px', threshold: [0, 0.2, 0.6] }
  )

  for (const link of links) {
    const el = document.getElementById(link.id)
    if (el) sectionObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  window.clearInterval(clockTimer)
  window.removeEventListener('scroll', scrollHandler)
  sectionObserver?.disconnect()
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled, 'is-open': menuOpen }">
    <div class="nav__inner container">
      <a class="nav__brand" href="#home" @click="closeMenu">
        <span class="nav__mark" aria-hidden="true">{{ site.profile.monogram || 'XR' }}<i /></span>
        <span class="nav__name">
          <strong>{{ site.profile.name }}</strong>
          <em>PORTFOLIO / 2026</em>
        </span>
      </a>

      <nav class="nav__links" aria-label="页面导航">
        <a
          v-for="(link, i) in links"
          :key="link.id"
          :href="link.href"
          class="nav__link"
          :class="{ 'is-active': active === link.id }"
        >
          <span class="nav__idx">0{{ i + 1 }}</span>
          <span class="nav__label">{{ link.label }}</span>
        </a>
      </nav>

      <div class="nav__right">
        <span class="nav__clock">{{ time }} <em>CST</em></span>
        <a class="nav__cta" href="#contact" data-cursor="CONTACT">
          <i aria-hidden="true" />
          联系我
        </a>
        <button
          class="nav__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="打开导航菜单"
          @click="menuOpen = !menuOpen"
        >
          <span /><span />
        </button>
      </div>
    </div>

    <transition name="panel">
      <div v-if="menuOpen" class="nav__panel">
        <a
          v-for="(link, i) in links"
          :key="link.id"
          :href="link.href"
          class="nav__panel-link"
          @click="closeMenu"
        >
          <span>0{{ i + 1 }}</span>{{ link.label }}
        </a>
        <div class="nav__panel-meta">
          <span>{{ time }} CST</span>
          <span>DALIAN · CN</span>
        </div>
      </div>
    </transition>

    <div class="nav__progress" :style="{ transform: `scaleX(${progress})` }" />
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 40;
  height: var(--nav-h);
  transition:
    background 0.45s var(--ease),
    border-color 0.45s var(--ease);
  border-bottom: 1px solid transparent;
}

.nav.is-scrolled {
  background: rgba(242, 240, 234, 0.86);
  border-bottom-color: var(--line);
  backdrop-filter: blur(18px) saturate(120%);
}

.nav__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.nav__mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line-2);
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--paper);
  transition:
    background 0.4s var(--ease),
    color 0.4s var(--ease),
    border-color 0.4s var(--ease);
}

.nav__mark i {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 6px;
  height: 6px;
  background: var(--accent);
}

.nav__brand:hover .nav__mark {
  background: var(--paper);
  border-color: var(--paper);
  color: var(--bg);
}

.nav__name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
}

.nav__name strong {
  font-family: var(--serif);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.nav__name em {
  font-family: var(--mono);
  font-style: normal;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: clamp(20px, 2.6vw, 44px);
}

.nav__link {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.nav__link:hover,
.nav__link.is-active {
  color: var(--paper);
}

.nav__idx {
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.04em;
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.nav__label {
  position: relative;
}

.nav__link.is-active .nav__idx {
  color: var(--accent);
}

.nav__label::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease);
}

.nav__link.is-active .nav__label::after {
  transform: scaleX(1);
}

.nav__right {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
}

.nav__clock {
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.05em;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.nav__clock em {
  font-style: normal;
  color: var(--muted);
  margin-left: 3px;
  font-size: 12.5px;
}

.nav__cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 40px;
  padding: 0 18px;
  border: 1px solid var(--line-2);
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--paper);
  transition:
    border-color 0.35s var(--ease),
    color 0.35s var(--ease),
    background 0.35s var(--ease);
}

.nav__cta i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent-soft);
  animation: pulse 3.4s infinite;
}

.nav__cta:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(168, 91, 46, 0.3);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(168, 91, 46, 0);
  }
}

.nav__burger {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line-2);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.nav__burger span {
  display: block;
  width: 16px;
  height: 1px;
  background: var(--paper);
  transition: transform 0.35s var(--ease);
}

.nav__panel {
  position: fixed;
  inset: var(--nav-h) 0 auto;
  padding: 20px var(--gutter) 32px;
  background: rgba(248, 246, 241, 0.98);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(20px);
}

.nav__panel-link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  font-family: var(--serif);
  font-size: 28px;
  letter-spacing: 0.08em;
}

.nav__panel-link span {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--accent);
  letter-spacing: 0.06em;
}

.nav__panel-meta {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.nav__progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 1px;
  width: 100%;
  background: var(--accent);
  transform-origin: left;
  opacity: 0.9;
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.3s var(--ease),
    transform 0.3s var(--ease);
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1180px) {
  .nav__clock {
    display: none;
  }
  .nav__links {
    gap: 22px;
  }
}

@media (max-width: 900px) {
  .nav__links,
  .nav__cta {
    display: none;
  }
  .nav__burger {
    display: flex;
  }
  .nav__name em {
    display: none;
  }
  .nav__mark {
    width: 36px;
    height: 36px;
  }
}
</style>
