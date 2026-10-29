<script setup>
import { siteState as site } from '../stores/site'
import SectionHead from './SectionHead.vue'
import PortraitCard from './PortraitCard.vue'
import { ArrowRight, Location, Message } from '@element-plus/icons-vue'

const profile = site.profile
</script>

<template>
  <section id="about" class="section about">
    <div class="container">
      <SectionHead
        index="02"
        en="ABOUT"
        title="关于我"
        note="DALIAN / CN"
        desc="一个还在学习的人，和一些已经做出来的东西。"
      />

      <div class="about__grid">
        <div class="about__portrait" data-reveal>
          <PortraitCard />
        </div>

        <div class="about__body">
          <h3 class="about__lead" data-reveal>
            在硬件与界面之间，<br />
            找一个舒服的位置。
          </h3>

          <div class="about__text">
            <p v-for="(paragraph, i) in profile.intro" :key="i" data-reveal :style="{ '--reveal-delay': `${120 + i * 80}ms` }">
              {{ paragraph }}
            </p>
          </div>

          <div class="about__contact" data-reveal>
            <a class="contact-row" :href="`mailto:${profile.email}`">
              <span class="contact-row__k"><el-icon><Message /></el-icon>EMAIL</span>
              <span class="contact-row__v">{{ profile.email }}</span>
              <el-icon class="contact-row__arrow"><ArrowRight /></el-icon>
            </a>
            <div class="contact-row">
              <span class="contact-row__k"><el-icon><Location /></el-icon>LOCATION</span>
              <span class="contact-row__v">{{ profile.location }} · {{ profile.school }}</span>
            </div>
            <div class="contact-row">
              <span class="contact-row__k"><span class="contact-row__dot" />FOCUS</span>
              <span class="contact-row__v">{{ profile.focus.join(' / ') }}</span>
            </div>
          </div>

          <div class="about__now" data-reveal>
            <span class="mono">CURRENTLY</span>
            <p>{{ profile.current }}</p>
          </div>
        </div>
      </div>

      <div class="about__stats" data-reveal>
        <div v-for="stat in profile.stats" :key="stat.label" class="stat">
          <span class="stat__value">{{ stat.value }}</span>
          <span class="stat__label">{{ stat.label }}</span>
          <span class="stat__note">{{ stat.note }}</span>
        </div>
      </div>

      <div class="trace" data-reveal>
        <div class="trace__head">
          <span class="mono">TRAJECTORY</span>
          <span class="mono">实践线索 / 2026</span>
        </div>
        <ol class="trace__list">
          <li v-for="item in profile.timeline" :key="item.title" class="trace__item">
            <span class="trace__year">{{ item.year }}</span>
            <strong class="trace__title">{{ item.title }}</strong>
            <span class="trace__note">{{ item.note }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background:
    radial-gradient(60% 45% at 8% 24%, rgba(168, 91, 46, 0.05), transparent 70%),
    var(--bg);
  border-top: 1px solid var(--line);
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.55fr);
  gap: clamp(48px, 7vw, 120px);
  align-items: start;
}

.about__portrait {
  position: relative;
}

.about__now {
  display: flex;
  align-items: baseline;
  gap: 24px;
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.about__now .mono {
  font-size: 12px;
  color: var(--muted);
}

.about__now p {
  font-size: 14px;
  color: var(--paper-2);
  letter-spacing: 0.02em;
}

.about__lead {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(34px, 3.4vw, 52px);
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: var(--paper);
  margin-bottom: 32px;
}

.about__text {
  display: grid;
  gap: 24px;
  max-width: 680px;
}

.about__text p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--paper-2);
}

.about__contact {
  margin-top: 48px;
  border-top: 1px solid var(--line);
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
  transition: border-color 0.35s var(--ease);
}

a.contact-row:hover {
  border-bottom-color: var(--accent-line);
}

.contact-row__k {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 80px;
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.contact-row__k .el-icon {
  font-size: 12px;
  color: var(--accent);
}

.contact-row__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}

.contact-row__v {
  flex: 1;
  font-size: 13px;
  letter-spacing: 0.05em;
  color: var(--paper);
}

.contact-row__arrow {
  color: var(--dim);
  transition:
    color 0.35s var(--ease),
    transform 0.35s var(--ease);
}

a.contact-row:hover .contact-row__arrow {
  color: var(--accent);
  transform: translateX(4px);
}

.about__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: clamp(56px, 6vw, 96px);
  border-top: 1px solid var(--line-2);
  border-bottom: 1px solid var(--line);
}

.stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 34px 32px 32px 0;
}

.stat + .stat {
  padding-left: 32px;
  border-left: 1px solid var(--line);
}

.stat__value {
  font-family: var(--serif);
  font-size: clamp(46px, 4.5vw, 68px);
  line-height: 1;
  color: var(--paper);
  font-variant-numeric: tabular-nums;
}

.stat__label {
  margin-top: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.stat__note {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.trace {
  margin-top: clamp(64px, 7vw, 104px);
}

.trace__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.trace__head .mono:last-child {
  color: var(--dim);
}

.trace__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.trace__item {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 22px 26px 22px 0;
  border-right: 1px solid var(--line);
}

.trace__item:last-child {
  border-right: 0;
}

.trace__item + .trace__item {
  padding-left: 26px;
}

.trace__year {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--accent);
}

.trace__title {
  font-size: 15px;
  font-weight: 500;
  color: var(--paper);
  line-height: 1.5;
}

.trace__note {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.02em;
}

@media (max-width: 1100px) {
  .about__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .about__portrait {
    position: static;
    max-width: 420px;
  }
  .about__stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat:nth-child(3) {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid var(--line);
  }
  .stat:nth-child(4) {
    border-top: 1px solid var(--line);
  }
  .trace__list {
    grid-template-columns: repeat(2, 1fr);
  }
  .trace__item:nth-child(2) {
    border-right: 0;
  }
  .trace__item:nth-child(n + 3) {
    border-top: 1px solid var(--line);
  }
  .trace__item:nth-child(3) {
    padding-left: 0;
  }
}

@media (max-width: 640px) {
  .contact-row {
    flex-wrap: wrap;
    gap: 6px 16px;
  }
  .contact-row__k {
    width: 100%;
  }
  .about__stats {
    grid-template-columns: 1fr;
  }
  .stat + .stat {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid var(--line);
  }
  .trace__list {
    grid-template-columns: 1fr;
  }
  .trace__item,
  .trace__item + .trace__item {
    padding-left: 0;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
}
</style>


