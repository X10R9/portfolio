<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Top } from '@element-plus/icons-vue'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import ProjectDialog from './components/ProjectDialog.vue'

const activeProject = ref(null)
let observer

onMounted(async () => {
  await nextTick()
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
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>

  <div class="site-frame" aria-hidden="true">
    <div class="site-frame__inner" />
  </div>

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
