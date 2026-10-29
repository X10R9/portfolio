<script setup>
import { siteState as site } from '../stores/site'
import SectionHead from './SectionHead.vue'
import ProjectCard from './ProjectCard.vue'

const projects = site.projects
const moreWork = site.moreWork
const emit = defineEmits(['open'])
</script>

<template>
  <section id="work" class="section work">
    <div class="container">
      <SectionHead
        index="03"
        en="SELECTED WORK"
        title="精选项目"
        note="04 PROJECTS"
        desc="挑了四个能完整讲清楚的项目：一个平台、一块电路板、一个浏览器扩展，和一次小模型训练。"
      />

      <div class="work__list">
        <ProjectCard
          v-for="(project, i) in projects"
          :key="project.id"
          :project="project"
          :reverse="i % 2 === 1"
          data-reveal
          @open="emit('open', $event)"
        />
      </div>

      <div class="more" data-reveal>
        <div class="more__head">
          <span class="mono">MORE EXPERIMENTS</span>
          <span class="mono">其他练习 / 2026</span>
        </div>
        <ul class="more__list">
          <li v-for="(item, i) in moreWork" :key="item.title" class="more__item">
            <span class="more__idx">0{{ i + 1 }}</span>
            <span class="more__title">{{ item.title }}</span>
            <span class="more__meta">{{ item.meta }}</span>
            <span class="more__detail">{{ item.detail }}</span>
            <span class="more__year">{{ item.year }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work {
  background:
    radial-gradient(55% 40% at 92% 12%, rgba(168, 91, 46, 0.055), transparent 68%),
    var(--bg-soft);
  border-top: 1px solid var(--line);
}

.work__list {
  display: flex;
  flex-direction: column;
}

.more {
  margin-top: clamp(64px, 7vw, 96px);
}

.more__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-2);
}

.more__head .mono:last-child {
  color: var(--dim);
}

.more__item {
  display: grid;
  grid-template-columns: 54px minmax(180px, 1.1fr) minmax(160px, 0.9fr) minmax(0, 1.2fr) 60px;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  transition: background 0.4s var(--ease);
}

.more__item:hover {
  background: rgba(28, 31, 31, 0.035);
}

.more__idx {
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.more__title {
  font-family: var(--serif);
  font-size: 22px;
  letter-spacing: 0.02em;
  color: var(--paper);
  transition: color 0.35s var(--ease);
}

.more__item:hover .more__title {
  color: var(--accent);
}

.more__meta,
.more__detail {
  font-size: 13.5px;
  color: var(--muted);
}

.more__detail {
  color: var(--muted);
  font-size: 13px;
}

.more__year {
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-align: right;
}

@media (max-width: 900px) {
  .more__item {
    grid-template-columns: 36px 1fr auto;
    gap: 8px 14px;
  }
  .more__meta {
    grid-column: 2;
  }
  .more__detail {
    display: none;
  }
  .more__year {
    grid-column: 3;
    grid-row: 1;
  }
  .more__title {
    font-size: 18px;
  }
}
</style>
