<script setup>
import { siteState as site } from '../stores/site'
import PortraitScan from './PortraitScan.vue'

const profile = site.profile
</script>

<template>
  <figure class="portrait">
    <div class="portrait__canvas">
      <img
        v-if="profile.portrait"
        class="portrait__photo"
        :src="profile.portrait"
        :alt="`${profile.name}的个人照片`"
      />
      <template v-else>
        <PortraitScan />
        <div class="portrait__grid" aria-hidden="true" />
        <div class="portrait__glow" aria-hidden="true" />
        <span class="portrait__en" aria-hidden="true">XU&nbsp;RU</span>
        <span class="portrait__tag">PORTRAIT / 2026</span>
        <span class="portrait__coord">38.91°N<br />121.60°E</span>
        <i class="portrait__corner portrait__corner--tl" aria-hidden="true" />
        <i class="portrait__corner portrait__corner--br" aria-hidden="true" />
      </template>
    </div>
    <figcaption class="portrait__cap">
      <span>{{ profile.latin }} — {{ profile.major }}</span>
      <span>{{ profile.grade }} / {{ profile.school }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.portrait {
  margin: 0;
}

.portrait__canvas {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 78% 12%, rgba(168, 91, 46, 0.14), transparent 55%),
    linear-gradient(165deg, #fbfaf6 0%, #f1eee6 62%, #e7e3da 100%);
  border: 1px solid var(--line);
}

.portrait__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.85) contrast(1.02);
}

.portrait__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(28, 31, 31, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(28, 31, 31, 0.06) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 100%);
}

.portrait__glow {
  position: absolute;
  inset: -20% -20% auto auto;
  width: 70%;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(168, 91, 46, 0.16), transparent 68%);
  filter: blur(10px);
}

.portrait__en {
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.5em;
  color: var(--muted);
  white-space: nowrap;
}

.portrait__tag {
  position: absolute;
  left: 28px;
  top: 26px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  color: var(--dim);
}

.portrait__coord {
  position: absolute;
  left: 28px;
  bottom: 24px;
  font-family: var(--mono);
  font-size: 9px;
  line-height: 1.7;
  letter-spacing: 0.16em;
  color: var(--dim);
}

.portrait__corner {
  position: absolute;
  width: 13px;
  height: 13px;
  border-color: var(--accent);
  border-style: solid;
  opacity: 0.75;
}

.portrait__corner--tl {
  top: 14px;
  right: 14px;
  border-width: 1px 1px 0 0;
}

.portrait__corner--br {
  bottom: 14px;
  right: 14px;
  border-width: 0 1px 1px 0;
}

.portrait__cap {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  margin-top: 14px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dim);
}
</style>


