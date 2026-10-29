<script setup>
import { computed } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  project: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const visible = computed({
  get: () => Boolean(props.project),
  set: (value) => {
    if (!value) emit('close')
  }
})

const gallerySrcs = computed(() =>
  (props.project?.gallery || []).map((item) => item.src).concat(props.project?.cover ? [props.project.cover] : [])
)
</script>

<template>
  <el-dialog
    v-model="visible"
    class="project-dialog"
    width="min(1180px, 94vw)"
    :show-close="false"
    append-to-body
    destroy-on-close
    align-center
  >
    <div v-if="project" class="dialog">
      <header class="dialog__bar">
        <span class="mono">PROJECT / {{ project.index }}</span>
        <button class="dialog__close" type="button" aria-label="关闭项目详情" @click="visible = false">
          <el-icon><Close /></el-icon>
          <span>CLOSE</span>
        </button>
      </header>

      <div class="dialog__scroll">
        <div class="dialog__head">
          <div class="dialog__eyebrow">
            <span>{{ project.year }}</span>
            <span>{{ project.type }}</span>
          </div>
          <h2 class="dialog__title">{{ project.title }}</h2>
          <p class="dialog__subtitle">{{ project.subtitle }}</p>
          <p class="dialog__summary">{{ project.summary }}</p>
        </div>

        <div class="dialog__cover">
          <img v-if="project.cover" :src="project.cover" :alt="project.coverAlt" />
          <div v-else class="dialog__cover-empty">
            <span>{{ project.title }}</span>
            <em>COVER / PENDING</em>
          </div>
          <span v-if="project.coverAlt" class="dialog__cover-tag mono">{{ project.coverAlt }}</span>
        </div>

        <div class="dialog__meta">
          <div class="meta-item">
            <span class="mono">ROLE</span>
            <strong>{{ project.role }}</strong>
          </div>
          <div class="meta-item meta-item--wide">
            <span class="mono">STACK</span>
            <strong>{{ project.stack.join(' · ') }}</strong>
          </div>
          <div class="meta-item">
            <span class="mono">YEAR</span>
            <strong>{{ project.year }}</strong>
          </div>
        </div>

        <div class="dialog__body">
          <div class="dialog__text">
            <section v-for="section in project.sections" :key="section.title" class="block">
              <h3>{{ section.title }}</h3>
              <p>{{ section.body }}</p>
            </section>

            <div class="notes">
              <span class="mono notes__label">KEY NOTES</span>
              <ul>
                <li v-for="(item, i) in project.highlights" :key="item">
                  <span>0{{ i + 1 }}</span>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <aside class="dialog__aside">
            <div class="facts">
              <div v-for="fact in project.facts" :key="fact.label" class="fact">
                <strong>{{ fact.value }}</strong>
                <span>{{ fact.label }}</span>
              </div>
            </div>

            <div v-if="project.gallery.length" class="gallery">
              <span class="mono gallery__label">MORE FRAMES</span>
              <el-image
                v-for="(image, i) in project.gallery"
                :key="image.src"
                class="gallery__item"
                :src="image.src"
                :alt="image.alt"
                fit="cover"
                :preview-src-list="gallerySrcs"
                :initial-index="i + 1"
                preview-teleported
                loading="lazy"
              />
            </div>

            <p class="dialog__note">
              这是课程 / 个人项目，暂未提供在线演示。需要看完整实现或演示，可以发邮件聊。
            </p>
          </aside>
        </div>

        <footer class="dialog__foot">
          <span class="mono">XU RU / PORTFOLIO 2026</span>
          <button class="dialog__foot-close" type="button" @click="visible = false">
            关闭
            <span aria-hidden="true">×</span>
          </button>
        </footer>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.dialog {
  background: var(--bg-soft);
}

.dialog__bar {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 28px;
  border-bottom: 1px solid var(--line);
  background: rgba(248, 246, 241, 0.94);
  backdrop-filter: blur(14px);
}

.dialog__bar .mono {
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.dialog__close {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.dialog__close:hover {
  color: var(--accent);
}

.dialog__scroll {
  max-height: min(88vh, 980px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.dialog__scroll::-webkit-scrollbar {
  width: 8px;
}

.dialog__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.dialog__scroll::-webkit-scrollbar-thumb {
  background: rgba(108, 113, 111, 0.32);
  border: 2px solid var(--bg-soft);
  border-radius: 99px;
}

.dialog__head {
  padding: clamp(36px, 4.5vw, 64px) 64px 34px;
}

.dialog__eyebrow {
  display: flex;
  gap: 16px;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.dialog__eyebrow span:first-child {
  color: var(--accent);
}

.dialog__title {
  margin-top: 16px;
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(44px, 5vw, 72px);
  line-height: 1.12;
  letter-spacing: 0.01em;
  color: var(--paper);
}

.dialog__subtitle {
  margin-top: 10px;
  font-size: 16px;
  letter-spacing: 0.02em;
  color: var(--muted);
}

.dialog__summary {
  max-width: 720px;
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.75;
  color: var(--paper-2);
}

.dialog__cover {
  position: relative;
  margin: 0 64px;
  border: 1px solid var(--line);
  background: var(--card);
  overflow: hidden;
}

.dialog__cover img {
  width: 100%;
  aspect-ratio: 2.15 / 1;
  object-fit: cover;
}

.dialog__cover-empty {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 2.15 / 1;
  padding: clamp(24px, 4vw, 48px);
  background: linear-gradient(160deg, #fbfaf6, #e9e6de);
}

.dialog__cover-empty span {
  font-family: var(--serif);
  font-size: clamp(32px, 4vw, 56px);
  color: var(--paper);
}

.dialog__cover-empty em {
  font-family: var(--mono);
  font-style: normal;
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.dialog__cover-tag {
  position: absolute;
  left: 16px;
  bottom: 12px;
  max-width: 60%;
  padding: 6px 10px;
  background: rgba(242, 240, 234, 0.92);
  border: 1px solid var(--line);
  font-size: 12.5px;
  color: var(--paper-2);
  text-transform: none;
  letter-spacing: 0.04em;
}

.dialog__meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 0 64px;
  padding: 26px 0;
  border-bottom: 1px solid var(--line);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item .mono {
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.meta-item strong {
  font-weight: 400;
  font-size: 15px;
  color: var(--paper);
  line-height: 1.6;
}

.dialog__body {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(240px, 0.8fr);
  align-items: start;
  gap: clamp(32px, 4vw, 56px);
  padding: clamp(34px, 4vw, 56px) 64px 48px;
}

.dialog__text {
  display: grid;
  align-content: start;
  gap: 34px;
}

.block h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent);
  text-transform: uppercase;
}

.block h3::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

.block p {
  font-size: 15px;
  line-height: 1.7;
  color: var(--paper-2);
}

.notes {
  border-top: 1px solid var(--line);
  padding-top: 18px;
}

.notes__label {
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.notes ul {
  margin-top: 4px;
}

.notes li {
  display: flex;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
  font-size: 15px;
  line-height: 1.7;
  color: var(--paper-2);
}

.notes li span {
  flex-shrink: 0;
  padding-top: 3px;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--accent);
}

.dialog__aside {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--line-2);
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 14px 16px 0;
  border-bottom: 1px solid var(--line);
}

.fact:nth-child(even) {
  padding-left: 14px;
  border-left: 1px solid var(--line);
}

.fact strong {
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 500;
  line-height: 1.05;
  color: var(--paper);
}

.fact span {
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery__label {
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 0;
}

.gallery__item {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--line);
  cursor: zoom-in;
}

.dialog__note {
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.dialog__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 64px;
  border-top: 1px solid var(--line);
}

.dialog__foot .mono {
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.dialog__foot-close {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.dialog__foot-close span {
  font-size: 16px;
  color: var(--accent);
}

.dialog__foot-close:hover {
  color: var(--paper);
}

@media (max-width: 900px) {
  .dialog__head {
    padding: 32px 28px 28px;
  }
  .dialog__cover {
    margin: 0 28px;
  }
  .dialog__meta {
    grid-template-columns: 1fr 1fr;
    margin: 0 28px;
  }
  .meta-item--wide {
    grid-column: 1 / -1;
    order: 3;
  }
  .dialog__body {
    grid-template-columns: 1fr;
    padding: 32px 28px 40px;
  }
  .dialog__cover img {
    aspect-ratio: 16 / 10;
  }
  .dialog__foot {
    padding: 18px 28px;
  }
  .facts {
    grid-template-columns: repeat(4, 1fr);
  }
  .fact:nth-child(even) {
    padding-left: 0;
    border-left: 0;
  }
  .fact + .fact {
    padding-left: 14px;
    border-left: 1px solid var(--line);
  }
  .gallery {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
  .gallery__item {
    width: calc(50% - 8px);
  }
}
</style>

