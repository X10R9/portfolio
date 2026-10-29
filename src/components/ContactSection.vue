<script setup>
import { ref } from 'vue'
import { CopyDocument, Promotion } from '@element-plus/icons-vue'
import { siteState as site } from '../stores/site'
import { useCopyEmail } from '../composables/useCopyEmail'

const profile = site.profile
const { copied, copy } = useCopyEmail(() => profile.email)
const sectionRef = ref(null)

function onMove(event) {
  const el = sectionRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <section id="contact" ref="sectionRef" class="contact" @mousemove="onMove">
    <div class="contact__bg" aria-hidden="true">
      <div class="contact__grid" />
      <div class="contact__cursor" />
    </div>

    <div class="contact__inner container">
      <div class="contact__top">
        <div class="contact__label">
          <span class="contact__idx">04</span>
          <span>CONTACT</span>
          <span class="rule" />
          <span class="contact__zh">联系</span>
        </div>
        <span class="contact__avail">
          <i aria-hidden="true" />
          {{ profile.availability }}
        </span>
      </div>

      <div class="contact__main">
        <h2 class="contact__title" data-reveal>
          有想法，<br />
          就聊聊<i class="contact__mark" aria-hidden="true" />
        </h2>

        <div class="contact__side" data-reveal style="--reveal-delay: 140ms">
          <p class="contact__note">
            不管是课程项目、前端实现，还是小模型实验，都欢迎来信。<br />
            也欢迎聊聊你正在做的事，或者想一起做的事。
          </p>

          <a class="contact__email" :href="`mailto:${profile.email}`" data-cursor="MAIL">
            <span class="contact__email-v">{{ profile.email }}</span>
            <span class="contact__email-line" aria-hidden="true" />
          </a>

          <div class="contact__actions">
            <el-button class="btn btn--solid" @click="copy">
              <el-icon class="contact__pre"><CopyDocument /></el-icon>
              {{ copied ? '已复制' : '复制邮箱' }}
            </el-button>
            <el-button class="btn btn--ghost" tag="a" :href="`mailto:${profile.email}`">
              <el-icon class="contact__pre"><Promotion /></el-icon>
              写封邮件
            </el-button>
          </div>

          <div class="contact__meta">
            <div>
              <span class="mono">BASED IN</span>
              <strong>{{ profile.location }}</strong>
            </div>
            <div>
              <span class="mono">COORDINATES</span>
              <strong>{{ profile.coords }}</strong>
            </div>
            <div>
              <span class="mono">STATUS</span>
              <strong>{{ profile.grade }} · 在读</strong>
            </div>
          </div>
        </div>
      </div>

      <footer class="contact__footer">
        <span>© 2026 {{ profile.name }} / PORTFOLIO</span>
        <span class="contact__build">VUE 3 · ELEMENT PLUS</span>
        <span>DALIAN · {{ profile.coords }}</span>
        <a class="contact__admin" href="/?admin=1" data-cursor="EDIT">ADMIN</a>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.contact {
  --mx: 50%;
  --my: 50%;
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: var(--bg-deep);
  border-top: 1px solid var(--line);
  display: flex;
}

.contact__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.contact__bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(70% 60% at 10% 90%, rgba(168, 91, 46, 0.07), transparent 62%),
    radial-gradient(50% 50% at 90% 0%, rgba(158, 184, 172, 0.045), transparent 70%);
}

.contact__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(28, 31, 31, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(28, 31, 31, 0.045) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: radial-gradient(80% 80% at 50% 50%, #000 30%, transparent 100%);
}

.contact__cursor {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    520px circle at var(--mx) var(--my),
    rgba(168, 91, 46, 0.09),
    transparent 62%
  );
  transition: background 0.2s linear;
}

.contact__inner {
  position: relative;
  z-index: 2;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: calc(var(--nav-h) + clamp(28px, 5vh, 60px));
  padding-bottom: 0;
}

.contact__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.contact__label {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--paper);
}

.contact__idx {
  color: var(--accent);
}

.contact__zh {
  color: var(--muted);
  letter-spacing: 0.12em;
}

.contact__avail {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--muted);
  white-space: nowrap;
}

.contact__avail i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 3.4s infinite;
}

.contact__main {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  align-items: end;
  gap: clamp(40px, 6vw, 110px);
  padding-block: clamp(48px, 8vh, 100px);
  flex: 1;
  align-content: center;
}

.contact__title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(76px, 9.8vw, 164px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--paper);
}

.contact__title span {
  color: var(--accent);
}

.contact__mark {
  display: inline-block;
  width: 0.085em;
  height: 0.085em;
  margin-left: 0.1em;
  background: var(--accent);
  vertical-align: 0.02em;
}

.contact__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 10px;
}

.contact__note {
  max-width: 480px;
  font-size: 15.5px;
  line-height: 2;
  color: var(--muted);
}

.contact__email {
  position: relative;
  display: block;
  margin-top: 34px;
  padding-bottom: 12px;
  width: 100%;
}

.contact__email-v {
  font-family: var(--mono);
  font-size: clamp(20px, 1.8vw, 30px);
  letter-spacing: 0.02em;
  color: var(--paper);
  transition: color 0.35s var(--ease);
}

.contact__email-line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--line-2);
  overflow: hidden;
}

.contact__email-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s var(--ease);
}

.contact__email:hover .contact__email-v {
  color: var(--accent);
}

.contact__email:hover .contact__email-line::after {
  transform: scaleX(1);
}

.contact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.contact__meta {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 0.9fr;
  gap: 20px;
  width: 100%;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.contact__meta div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact__meta .mono {
  font-size: 9px;
  color: var(--dim);
}

.contact__meta strong {
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--paper-2);
}

.contact__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 0 26px;
  border-top: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--dim);
  text-transform: uppercase;
}

.contact__build {
  color: var(--muted);
}

.contact__admin {
  color: var(--dim);
  transition: color 0.3s var(--ease);
}

.contact__admin:hover {
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

@media (max-width: 1100px) {
  .contact__main {
    grid-template-columns: 1fr;
    align-content: center;
    gap: 48px;
  }
  .contact__title {
    font-size: clamp(64px, 12vw, 110px);
  }
  .contact__meta {
    max-width: 520px;
  }
  .contact__footer {
    flex-wrap: wrap;
    gap: 12px 20px;
  }
}

@media (max-width: 700px) {
  .contact__avail,
  .contact__build,
  .contact__footer span:nth-child(3) {
    display: none;
  }
  .contact__title {
    font-size: clamp(54px, 15vw, 84px);
  }
  .contact__meta {
    grid-template-columns: 1fr 1fr;
  }
}
</style>


