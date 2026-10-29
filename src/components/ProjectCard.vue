<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  project: { type: Object, required: true },
  reverse: { type: Boolean, default: false }
})

const emit = defineEmits(['open'])

function open() {
  emit('open', props.project)
}
</script>

<template>
  <article class="project" :class="{ 'project--reverse': reverse }">
    <button
      class="project__media"
      type="button"
      :style="{ aspectRatio: project.aspect || '16 / 10' }"
      :aria-label="`查看项目：${project.title}`"
      @click="open"
    >
      <img
        class="project__img"
        :src="project.cover"
        :alt="project.coverAlt"
        :style="{ objectPosition: project.coverPosition || '50% 50%' }"
        loading="lazy"
        decoding="async"
      />
      <span class="project__shade" aria-hidden="true" />
      <span class="project__index" aria-hidden="true">{{ project.index }}</span>
      <span class="project__view">
        VIEW CASE
        <el-icon><ArrowRight /></el-icon>
      </span>
      <span class="project__line" aria-hidden="true" />
    </button>

    <div class="project__body">
      <div class="project__meta">
        <span class="project__year">{{ project.year }}</span>
        <span class="project__type">{{ project.type }}</span>
      </div>

      <h3 class="project__title">
        {{ project.title }}
        <span>{{ project.subtitle }}</span>
      </h3>

      <p class="project__summary">{{ project.summary }}</p>

      <div class="project__tags">
        <el-tag v-for="tag in project.stack" :key="tag" class="tag" effect="plain" size="small">
          {{ tag }}
        </el-tag>
      </div>

      <div class="project__foot">
        <span class="project__role mono">{{ project.role }}</span>
        <button class="project__cta" type="button" @click="open">
          <span>项目详情</span>
          <span class="project__cta-line" aria-hidden="true" />
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(320px, 1fr);
  gap: clamp(36px, 5.5vw, 96px);
  align-items: center;
  padding-block: clamp(44px, 5vw, 76px);
  border-top: 1px solid var(--line);
}

.project:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.project--reverse .project__media {
  order: 2;
}

.project--reverse .project__body {
  order: 1;
}

.project__media {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--line);
  cursor: pointer;
  isolation: isolate;
}

.project__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9) saturate(0.78);
  transform: scale(1.001);
  transition:
    transform 1.1s var(--ease),
    filter 1.1s var(--ease);
}

.project__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 13, 15, 0.18) 0%, rgba(10, 13, 15, 0) 30%, rgba(10, 13, 15, 0.32) 100%);
  transition: opacity 0.6s var(--ease);
  opacity: 0.75;
}

.project__media:hover .project__img {
  transform: scale(1.035);
  filter: brightness(1) saturate(0.95);
}

.project__media:hover .project__shade {
  opacity: 0.55;
}

.project__index {
  position: absolute;
  left: 20px;
  top: 16px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--paper);
  mix-blend-mode: difference;
}

.project__view {
  position: absolute;
  right: 20px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  background: rgba(16, 20, 23, 0.72);
  border: 1px solid rgba(236, 233, 225, 0.18);
  backdrop-filter: blur(10px);
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--paper);
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.45s var(--ease),
    transform 0.45s var(--ease),
    border-color 0.45s var(--ease);
}

.project__media:hover .project__view,
.project__media:focus-visible .project__view {
  opacity: 1;
  transform: none;
  border-color: var(--accent-line);
}

.project__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.8s var(--ease);
}

.project__media:hover .project__line {
  transform: scaleX(1);
}

.project__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.project__meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.project__year {
  color: var(--accent);
}

.project__type {
  color: var(--dim);
}

.project__type::before {
  content: '/';
  margin-right: 14px;
  color: rgba(236, 233, 225, 0.2);
}

.project__title {
  margin-top: 18px;
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(32px, 3.3vw, 50px);
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--paper);
}

.project__title span {
  display: block;
  margin-top: 10px;
  font-family: var(--sans);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.project__summary {
  margin-top: 22px;
  max-width: 460px;
  font-size: 14px;
  line-height: 1.95;
  color: var(--paper-2);
}

.project__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 24px;
}

.project__foot {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.project__role {
  font-size: 9px;
  color: var(--dim);
}

.project__cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--paper);
  transition: color 0.35s var(--ease);
}

.project__cta:hover {
  color: var(--accent);
}

.project__cta-line {
  position: absolute;
  left: 0;
  bottom: -5px;
  width: calc(100% - 22px);
  height: 1px;
  background: var(--line-2);
  transform-origin: left;
  transition: background 0.35s var(--ease);
}

.project__cta:hover .project__cta-line {
  background: var(--accent);
}

.project__cta .el-icon {
  font-size: 12px;
}

@media (max-width: 1000px) {
  .project {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .project--reverse .project__media,
  .project--reverse .project__body {
    order: initial;
  }
  .project__title {
    font-size: clamp(30px, 5.4vw, 42px);
  }
  .project__body {
    padding-bottom: 8px;
  }
}
</style>
