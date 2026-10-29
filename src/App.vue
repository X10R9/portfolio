<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { Top } from '@element-plus/icons-vue'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import ProjectDialog from './components/ProjectDialog.vue'
import SiteCursor from './components/SiteCursor.vue'
import { loadSite, siteState, subscribeSiteUpdates } from './stores/site'

const activeProject = ref(null)
let observer
let unsubscribe

watchEffect(() => {
  document.title = `${siteState.profile.name} · 物联网工程 / 作品集 2026`
})

function collectReveals() {
  document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => observer.observe(el))
}

onMounted(async () => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  )

  await loadSite()
  await nextTick()
  collectReveals()

  unsubscribe = subscribeSiteUpdates(async () => {
    await loadSite({ force: true })
    await nextTick()
    collectReveals()
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  unsubscribe?.()
})
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>

  <div class="site-frame" aria-hidden="true">
    <div class="site-frame__inner" />
  </div>

  <SiteCursor />
  <SiteNav />

  <main id="main">
    <HeroSection />
    <AboutSection />
    <ProjectsSection @open="activeProject = $event" />
    <ContactSection />
  </main>

  <ProjectDialog :project="activeProject" @close="activeProject = null" />

  <el-backtop :right="40" :bottom="104" :visibility-height="900">
    <el-icon><Top /></el-icon>
  </el-backtop>
</template>
