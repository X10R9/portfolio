<script setup>
const props = defineProps({
  draft: { type: Object, required: true }
})
</script>

<template>
  <div class="preview">
    <div class="preview__head">
      <span class="mono">LIVE PREVIEW</span>
      <span class="preview__live"><i aria-hidden="true" />实时</span>
    </div>

    <div class="preview__browser">
      <div class="preview__chrome">
        <span /><span /><span />
        <em>xuru.site</em>
      </div>

      <div class="preview__screen">
        <div class="preview__nav">
          <span class="preview__mark">{{ draft.profile.monogram || 'XR' }}</span>
          <span class="preview__name">{{ draft.profile.name }}</span>
          <span class="preview__links">关于 · 作品 · 联系</span>
        </div>

        <div class="preview__hero">
          <span class="preview__eyebrow">PORTFOLIO 2026 / {{ draft.profile.major }}</span>
          <h2>
            让设备<br />
            开口说话<i aria-hidden="true" />
          </h2>
          <p>{{ draft.profile.lede }}</p>
          <div class="preview__meta">
            <span>{{ draft.profile.location }}</span>
            <span>{{ draft.profile.grade }}</span>
          </div>
        </div>

        <div class="preview__stats">
          <div v-for="(stat, i) in draft.profile.stats.slice(0, 4)" :key="i">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="preview__projects">
      <span class="mono">SELECTED WORK</span>
      <div v-for="(project, i) in draft.projects.slice(0, 4)" :key="project.id || i" class="preview__project">
        <span>{{ project.index || String(i + 1).padStart(2, '0') }}</span>
        <strong>{{ project.title || '未命名项目' }}</strong>
        <em>{{ project.year }}</em>
      </div>
    </div>

    <div class="preview__contact">
      <span class="mono">CONTACT</span>
      <strong>{{ draft.profile.email }}</strong>
      <span>{{ draft.profile.availability }}</span>
    </div>

    <p class="preview__note">
      保存并发布后，已打开的网站页面会通过 BroadcastChannel 自动拉取新内容。
    </p>
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
}

.preview__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-2);
}

.preview__head .mono {
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.preview__live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--accent);
}

.preview__live i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  animation: preview-pulse 2.2s infinite;
}

@keyframes preview-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(168, 91, 46, 0.28);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(168, 91, 46, 0);
  }
}

.preview__browser {
  margin-top: 18px;
  border: 1px solid var(--line-2);
  background: var(--bg);
  box-shadow: 0 16px 40px rgba(28, 31, 31, 0.08);
}

.preview__chrome {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 9px;
  border-bottom: 1px solid var(--line);
  background: #f8f6f1;
}

.preview__chrome span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c9c4ba;
}

.preview__chrome em {
  margin-left: auto;
  font-family: var(--mono);
  font-style: normal;
  font-size: 7px;
  letter-spacing: 0.08em;
  color: var(--dim);
}

.preview__screen {
  padding: 14px 14px 16px;
  background:
    radial-gradient(60% 80% at 88% 18%, rgba(168, 91, 46, 0.07), transparent 60%),
    var(--bg);
}

.preview__nav {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}

.preview__mark {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--line-2);
  font-family: var(--mono);
  font-size: 6px;
  color: var(--paper);
}

.preview__name {
  font-family: var(--serif);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.preview__links {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 6px;
  letter-spacing: 0.08em;
  color: var(--dim);
}

.preview__hero {
  padding-top: 17px;
}

.preview__eyebrow {
  display: block;
  font-family: var(--mono);
  font-size: 6px;
  letter-spacing: 0.1em;
  color: var(--dim);
}

.preview__hero h2 {
  margin-top: 10px;
  font-family: var(--serif);
  font-weight: 500;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--paper);
}

.preview__hero h2 i {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-left: 4px;
  background: var(--accent);
  vertical-align: 0.08em;
}

.preview__hero p {
  display: -webkit-box;
  margin-top: 12px;
  overflow: hidden;
  font-size: 8px;
  line-height: 1.8;
  color: var(--paper-2);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.preview__meta {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  font-family: var(--mono);
  font-size: 6px;
  letter-spacing: 0.08em;
  color: var(--dim);
}

.preview__meta span + span::before {
  content: '/';
  margin-right: 10px;
  color: var(--line-3);
}

.preview__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.preview__stats div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-right: 6px;
}

.preview__stats div + div {
  padding-left: 8px;
  border-left: 1px solid var(--line);
}

.preview__stats strong {
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  color: var(--paper);
}

.preview__stats span {
  font-family: var(--mono);
  font-size: 6px;
  letter-spacing: 0.04em;
  color: var(--dim);
}

.preview__projects {
  margin-top: 24px;
}

.preview__projects > .mono {
  display: block;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--line-2);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.preview__project {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) 38px;
  align-items: baseline;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}

.preview__project span {
  font-family: var(--mono);
  font-size: 7px;
  color: var(--accent);
}

.preview__project strong {
  overflow: hidden;
  font-family: var(--serif);
  font-size: 13px;
  font-weight: 500;
  color: var(--paper);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview__project em {
  font-family: var(--mono);
  font-style: normal;
  font-size: 7px;
  color: var(--dim);
  text-align: right;
}

.preview__contact {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1px solid var(--line-2);
}

.preview__contact .mono {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.preview__contact strong {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 400;
  color: var(--paper);
}

.preview__contact > span:last-child {
  font-size: 12px;
  color: var(--muted);
}

.preview__note {
  margin-top: 22px;
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--muted);
}
</style>
