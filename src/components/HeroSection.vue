<script setup>
import { onMounted, ref } from 'vue'
import { ArrowDown, CopyDocument } from '@element-plus/icons-vue'
import { siteState as site } from '../stores/site'
import { useCopyEmail } from '../composables/useCopyEmail'

const videoRef = ref(null)
const heroRef = ref(null)
const profile = site.profile
const { copied, copy: copyEmail } = useCopyEmail(() => profile.email)

function scrollToWork() {
  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onMove(event) {
  const el = heroRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

onMounted(() => {
  const video = videoRef.value
  if (!video) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause()
    video.removeAttribute('autoplay')
  }
})
</script>

<template>
  <section id="home" ref="heroRef" class="hero" @mousemove="onMove">
    <div class="hero__media" aria-hidden="true">
      <video
        ref="videoRef"
        class="hero__video"
        autoplay
        muted
        loop
        playsinline
        poster="/media/hero-poster.jpg"
        preload="metadata"
      >
        <source src="/media/hero-field.webm" type="video/webm" />
      </video>
      <div class="hero__veil" />
      <div class="hero__light" />
    </div>

    <div class="hero__inner container">
      <div class="hero__top">
        <p class="hero__eyebrow">
          <span class="hero__dot" aria-hidden="true" />
          PORTFOLIO 2026
          <span class="hero__slash">/</span>
          物联网工程
        </p>
        <span class="hero__coord mono">{{ profile.coords }}</span>
      </div>

      <div class="hero__center">
        <h1 class="hero__title">
          <span class="hero__line"><span>让设备</span></span>
          <span class="hero__line hero__line--indent"
            ><span>开口说话<i class="hero__mark" aria-hidden="true" /></span
          ></span>
        </h1>

        <div class="hero__lede-row">
          <p class="hero__lede">
            {{ profile.lede }}
          </p>
          <div class="hero__actions">
            <el-button class="btn btn--solid" @click="scrollToWork">
              查看精选作品
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            <el-button class="btn btn--ghost" @click="copyEmail">
              <el-icon class="btn__pre"><CopyDocument /></el-icon>
              {{ copied ? '已复制' : '复制邮箱' }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="hero__bottom">
        <div class="hero__meta">
          <span>DALIAN · CHINA</span>
          <span class="hero__meta-sep" aria-hidden="true">/</span>
          <span>{{ profile.school }} · {{ profile.major }}</span>
          <span class="hero__meta-sep" aria-hidden="true">/</span>
          <span>{{ profile.grade }}</span>
        </div>
        <a class="hero__scroll" href="#about">
          <span>SCROLL TO EXPLORE</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --mx: 60%;
  --my: 45%;
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: var(--bg);
}

.hero__media,
.hero__video,
.hero__veil,
.hero__light {
  position: absolute;
  inset: 0;
}

.hero__media {
  background: url('/media/hero-poster.jpg') center / cover no-repeat;
}

.hero__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.96;
  filter: saturate(0.9) contrast(1);
}

.hero__veil {
  background:
    linear-gradient(90deg, rgba(242, 240, 234, 0.97) 0%, rgba(242, 240, 234, 0.82) 38%, rgba(242, 240, 234, 0.18) 74%, rgba(242, 240, 234, 0.5) 100%),
    linear-gradient(0deg, var(--bg) 0%, rgba(242, 240, 234, 0) 36%),
    radial-gradient(120% 90% at 58% 42%, rgba(242, 240, 234, 0) 30%, rgba(242, 240, 234, 0.35) 100%);
}

.hero__light {
  z-index: 1;
  background: radial-gradient(
    460px circle at var(--mx) var(--my),
    rgba(168, 91, 46, 0.1),
    transparent 70%
  );
  pointer-events: none;
}

.hero__inner {
  position: relative;
  z-index: 2;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: calc(var(--nav-h) + clamp(28px, 5vh, 64px));
  padding-bottom: clamp(22px, 3.2vh, 38px);
}

.hero__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  animation: fade 1s var(--ease) 0.25s both;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--paper-2);
}

.hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.hero__slash {
  color: var(--dim);
}

.hero__coord {
  font-size: 12.5px;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.hero__center {
  padding-block: clamp(32px, 6vh, 80px);
}

.hero__title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(68px, 9.6vw, 160px);
  line-height: 1.12;
  letter-spacing: 0.01em;
  color: var(--paper);
}

.hero__line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
}

.hero__line > span {
  display: inline-block;
  animation: rise 1.15s var(--ease) both;
}

.hero__line:nth-child(1) > span {
  animation-delay: 0.1s;
}

.hero__line:nth-child(2) > span {
  animation-delay: 0.22s;
}

.hero__line--indent {
  padding-left: 0;
}

.hero__mark {
  display: inline-block;
  width: 0.085em;
  height: 0.085em;
  margin-left: 0.1em;
  background: var(--accent);
  vertical-align: 0.04em;
}

.hero__lede-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(32px, 5vw, 88px);
  margin-top: 48px;
  padding-left: 0;
  animation: fade 1.1s var(--ease) 0.6s both;
}

.hero__lede {
  max-width: 560px;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.7;
  letter-spacing: 0.01em;
  color: var(--paper-2);
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.hero__actions .btn.el-button + .btn.el-button {
  margin-left: 0;
}

.hero__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  animation: fade 1.1s var(--ease) 0.85s both;
}

.hero__meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.05em;
  color: var(--muted);
  text-transform: uppercase;
}

.hero__meta-sep {
  color: rgba(28, 31, 31, 0.22);
}

.hero__scroll {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.hero__scroll:hover {
  color: var(--accent);
}

.hero__scroll i {
  position: relative;
  display: block;
  width: 1px;
  height: 36px;
  background: var(--line-2);
  overflow: hidden;
}

.hero__scroll i::after {
  content: '';
  position: absolute;
  left: 0;
  top: -100%;
  width: 100%;
  height: 60%;
  background: var(--accent);
  animation: scrollLine 2.8s var(--ease) infinite;
}

@keyframes rise {
  from {
    transform: translateY(112%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes scrollLine {
  0% {
    top: -60%;
  }
  60%,
  100% {
    top: 100%;
  }
}

@media (max-width: 1100px) {
  .hero__lede-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero__title {
    font-size: clamp(60px, 10.4vw, 112px);
  }
  .hero__line--indent {
    padding-left: 0;
  }
}

@media (max-width: 900px) {
  .hero__video {
    display: none;
  }
  .hero__coord,
  .hero__meta span:nth-child(n + 2) {
    display: none;
  }
  .hero__title {
    font-size: clamp(54px, 13vw, 86px);
  }
  .hero__actions {
    flex-wrap: wrap;
    gap: 10px;
  }
  .hero__bottom {
    align-items: flex-end;
  }
  .hero__scroll {
    display: none;
  }
}
</style>

