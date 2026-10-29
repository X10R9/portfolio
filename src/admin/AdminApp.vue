<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  Connection,
  Refresh,
  SwitchButton,
  View
} from '@element-plus/icons-vue'
import { ElButton, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/popper/style/css'
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/message-box/style/css'

import { loadSite, saveSite, siteState } from '../stores/site'
import defaults from '../data/site-defaults.json'
import ProfileEditor from './ProfileEditor.vue'
import ProjectsEditor from './ProjectsEditor.vue'
import MoreEditor from './MoreEditor.vue'
import AdminPreview from './AdminPreview.vue'
import './admin.css'

const clone = (value) => JSON.parse(JSON.stringify(value))
const tokenKey = 'xr_admin_token'

const draft = reactive(clone(defaults))
const baseline = ref('')
const token = ref(sessionStorage.getItem(tokenKey) || '')
const authenticated = ref(Boolean(token.value))
const loginPassword = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const saving = ref(false)
const loading = ref(true)
const apiOnline = ref(false)
const tab = ref('profile')

const tabs = [
  {
    id: 'profile',
    index: '01',
    label: '基本信息',
    en: 'PROFILE',
    title: '基本信息',
    desc: '首页、关于与联系页上的文字、数据和联系方式。保存后会同步到网站。'
  },
  {
    id: 'projects',
    index: '02',
    label: '精选项目',
    en: 'PROJECTS',
    title: '精选项目',
    desc: '编辑项目卡片与详情弹窗的内容，支持新增、排序和删除。'
  },
  {
    id: 'more',
    index: '03',
    label: '其他实验',
    en: 'MORE WORK',
    title: '其他实验',
    desc: '精选项目下方的那组小作品，用来放练习、课程实验和零散尝试。'
  }
]

const currentTab = computed(() => tabs.find((item) => item.id === tab.value) || tabs[0])
const dirty = computed(() => JSON.stringify(draft) !== baseline.value)

const updatedLabel = computed(() => {
  const raw = siteState.updatedAt
  if (!raw) return '—'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

function resetDraft() {
  const source = {
    profile: siteState.profile,
    projects: siteState.projects,
    moreWork: siteState.moreWork
  }
  Object.assign(draft, clone(source))
  baseline.value = JSON.stringify(draft)
}

async function refreshFromServer() {
  await loadSite({ force: true })
  apiOnline.value = siteState.source === 'api'
  resetDraft()
}

async function login() {
  loginError.value = ''
  if (!loginPassword.value) {
    loginError.value = '请输入管理密码'
    return
  }
  loggingIn.value = true
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: loginPassword.value })
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      loginError.value = body.error || '登录失败'
      return
    }
    token.value = body.token
    sessionStorage.setItem(tokenKey, body.token)
    authenticated.value = true
    loginPassword.value = ''
    apiOnline.value = true
    await refreshFromServer()
    ElMessage.success('已进入后台')
  } catch {
    loginError.value = '无法连接管理 API，请先启动 npm run api'
  } finally {
    loggingIn.value = false
  }
}

function logout() {
  token.value = ''
  sessionStorage.removeItem(tokenKey)
  authenticated.value = false
}

async function save() {
  if (saving.value || !dirty.value) return
  saving.value = true
  try {
    await saveSite(clone(draft), token.value)
    baseline.value = JSON.stringify(draft)
    ElMessage.success('已保存并发布，网站已同步更新')
  } catch (error) {
    if (error.code === 401) {
      token.value = ''
      sessionStorage.removeItem(tokenKey)
      authenticated.value = false
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.message || '保存失败')
    }
  } finally {
    saving.value = false
  }
}

async function discard() {
  if (!dirty.value) return
  try {
    await ElMessageBox.confirm('放弃当前所有未保存的修改？', '放弃修改', {
      confirmButtonText: '放弃',
      cancelButtonText: '继续编辑',
      type: 'warning'
    })
    resetDraft()
  } catch {
    /* cancelled */
  }
}

function onBeforeUnload(event) {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(async () => {
  await refreshFromServer()
  loading.value = false
  window.addEventListener('beforeunload', onBeforeUnload)
  if (authenticated.value) {
    // An existing session may have expired; the save request will ask for a new login.
    loginError.value = ''
  }
})

onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>

<template>
  <div class="admin">
    <header class="admin-bar">
      <a class="admin-brand" href="/">
        <span class="admin-brand__mark">XR</span>
        <span class="admin-brand__text">
          <strong>内容管理</strong>
          <em>PORTFOLIO / ADMIN</em>
        </span>
      </a>

      <div class="admin-bar__right">
        <span class="admin-status" :class="{ 'is-online': apiOnline }">
          <i aria-hidden="true" />
          {{ apiOnline ? 'API 已连接' : '静态数据' }}
        </span>
        <template v-if="authenticated">
          <span v-if="dirty" class="admin-dirty"><i />未保存的修改</span>
          <el-button
            class="admin-save"
            :loading="saving"
            :disabled="!dirty || !apiOnline"
            @click="save"
          >
            保存并发布
          </el-button>
          <a class="admin-link" href="/" target="_blank" rel="noopener noreferrer">
            <el-icon><View /></el-icon>
            查看网站
          </a>
          <button class="admin-logout" type="button" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            退出
          </button>
        </template>
        <a v-else class="admin-link" href="/">返回网站</a>
      </div>
    </header>

    <main v-if="authenticated" class="admin-main">
      <aside class="admin-nav">
        <span class="admin-nav__label mono">CONTENT</span>
        <button
          v-for="item in tabs"
          :key="item.id"
          class="admin-nav__item"
          :class="{ 'is-active': tab === item.id }"
          type="button"
          @click="tab = item.id"
        >
          <span>{{ item.index }}</span>
          {{ item.label }}
        </button>

        <div class="admin-nav__foot">
          <span class="mono">LAST SAVED</span>
          <strong>{{ updatedLabel }}</strong>
          <button class="admin-discard" type="button" :disabled="!dirty" @click="discard">
            <el-icon><Refresh /></el-icon>
            放弃修改
          </button>
        </div>
      </aside>

      <section class="admin-editor">
        <div class="admin-editor__head">
          <span class="mono">{{ currentTab.index }} / {{ currentTab.en }}</span>
          <h1>{{ currentTab.title }}</h1>
          <p>{{ currentTab.desc }}</p>
        </div>

        <ProfileEditor v-if="tab === 'profile'" :profile="draft.profile" />
        <ProjectsEditor v-else-if="tab === 'projects'" :projects="draft.projects" />
        <MoreEditor v-else :items="draft.moreWork" />
      </section>

      <aside class="admin-preview">
        <AdminPreview :draft="draft" />
      </aside>
    </main>

    <section v-else class="login">
      <div class="login-aside">
        <span class="login-aside__mark">XR</span>
        <div class="login-aside__bottom">
          <span class="mono">PORTFOLIO / 2026</span>
          <p>
            让设备开口说话。<br />
            也让内容随时可改。
          </p>
          <span class="login-aside__meta">徐茹 · 物联网工程</span>
        </div>
      </div>

      <div class="login-panel">
        <span class="mono">ADMIN ACCESS</span>
        <h1>进入后台</h1>
        <p class="login-panel__desc">
          登录后可以修改个人信息、项目与首页文案。保存会写入站点数据，并同步刷新已打开的网站页面。
        </p>

        <div v-if="!loading && !apiOnline" class="login-warning">
          <el-icon><Connection /></el-icon>
          管理 API 未连接。请先运行 <code>npm run api</code>。
        </div>

        <el-input
          v-model="loginPassword"
          class="login-input"
          type="password"
          show-password
          size="large"
          placeholder="管理密码"
          @keyup.enter="login"
        />
        <el-button class="btn btn--solid login-submit" :loading="loggingIn" @click="login">
          登录
        </el-button>
        <p class="login-error" role="alert">{{ loginError }}</p>

        <div class="login-panel__foot">
          <span>默认密码见 README，可用环境变量 <code>ADMIN_PASSWORD</code> 修改。</span>
          <a href="/">← 返回网站</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  background: #eceae3;
}

.admin-bar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 72px;
  padding: 0 clamp(20px, 3vw, 40px);
  background: rgba(242, 240, 234, 0.92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(18px);
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.admin-brand__mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  background: var(--paper);
  color: var(--bg);
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.06em;
}

.admin-brand__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1.2;
}

.admin-brand__text strong {
  font-family: var(--serif);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.admin-brand__text em {
  font-family: var(--mono);
  font-style: normal;
  font-size: 8px;
  letter-spacing: 0.18em;
  color: var(--dim);
}

.admin-bar__right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.admin-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--dim);
}

.admin-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--dim);
}

.admin-status.is-online i {
  background: #4f7c5a;
}

.admin-dirty {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: var(--accent);
}

.admin-dirty i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}

.admin-save.el-button {
  height: 38px;
  padding: 0 20px;
  border-radius: 2px;
  border-color: var(--paper);
  background: var(--paper);
  color: var(--bg);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.admin-save.el-button:hover,
.admin-save.el-button:focus {
  background: var(--accent);
  border-color: var(--accent);
  color: #fffaf3;
}

.admin-save.el-button.is-disabled {
  background: #d9d5cc;
  border-color: #d9d5cc;
  color: #8c8b84;
}

.admin-link,
.admin-logout {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.admin-link:hover,
.admin-logout:hover {
  color: var(--accent);
}

.admin-logout {
  padding-left: 16px;
  border-left: 1px solid var(--line);
}

.admin-main {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 380px;
  max-width: 1760px;
  margin: 0 auto;
  min-height: calc(100vh - 72px);
}

.admin-nav {
  position: sticky;
  top: 72px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
  padding: 36px 26px 28px;
  border-right: 1px solid var(--line);
}

.admin-nav__label {
  font-size: 9px;
  color: var(--dim);
  margin-bottom: 18px;
}

.admin-nav__item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
  font-family: var(--serif);
  font-size: 20px;
  letter-spacing: 0.04em;
  color: var(--muted);
  text-align: left;
  transition: color 0.3s var(--ease);
}

.admin-nav__item span {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--dim);
}

.admin-nav__item:hover {
  color: var(--paper);
}

.admin-nav__item.is-active {
  color: var(--paper);
}

.admin-nav__item.is-active span {
  color: var(--accent);
}

.admin-nav__foot {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.admin-nav__foot .mono {
  font-size: 8px;
  color: var(--dim);
}

.admin-nav__foot strong {
  font-weight: 400;
  font-size: 11px;
  color: var(--paper-2);
}

.admin-discard {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-align: left;
}

.admin-discard:hover {
  color: var(--accent);
}

.admin-discard:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.admin-editor {
  min-width: 0;
  max-width: 940px;
  padding: 44px 52px 96px;
}

.admin-editor__head {
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 8px;
}

.admin-editor__head .mono {
  font-size: 10px;
  color: var(--dim);
}

.admin-editor__head h1 {
  margin-top: 12px;
  font-family: var(--serif);
  font-weight: 500;
  font-size: 42px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--paper);
}

.admin-editor__head p {
  max-width: 620px;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--muted);
}

.admin-preview {
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
  overflow-y: auto;
  padding: 32px 26px;
  border-left: 1px solid var(--line);
  background: #f7f5ef;
}

/* Login */
.login {
  display: grid;
  grid-template-columns: 1.04fr 0.96fr;
  min-height: calc(100vh - 72px);
}

.login-aside {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 72px);
  padding: clamp(36px, 5vw, 64px);
  overflow: hidden;
  background: #1c1f1f;
  color: #f2f0ea;
}

.login-aside::after {
  content: '';
  position: absolute;
  right: -6%;
  bottom: -18%;
  width: 68%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid rgba(242, 240, 234, 0.16);
  box-shadow:
    0 0 0 60px rgba(242, 240, 234, 0.03),
    0 0 0 120px rgba(242, 240, 234, 0.02);
}

.login-aside__mark {
  font-family: var(--mono);
  font-size: 15px;
  letter-spacing: 0.12em;
  color: #d7a36b;
}

.login-aside__bottom {
  position: relative;
  z-index: 1;
}

.login-aside__bottom .mono {
  font-size: 9px;
  color: rgba(242, 240, 234, 0.55);
}

.login-aside__bottom p {
  margin-top: 18px;
  font-family: var(--serif);
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.35;
  color: #f2f0ea;
}

.login-aside__meta {
  display: block;
  margin-top: 26px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: rgba(242, 240, 234, 0.5);
}

.login-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(36px, 7vw, 120px);
  background: var(--bg);
}

.login-panel > .mono {
  font-size: 10px;
  color: var(--accent);
}

.login-panel h1 {
  margin-top: 14px;
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(42px, 4.4vw, 64px);
  line-height: 1.1;
  color: var(--paper);
}

.login-panel__desc {
  max-width: 420px;
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.95;
  color: var(--muted);
}

.login-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 10px 12px;
  border: 1px solid var(--accent-line);
  background: var(--accent-soft);
  font-size: 11px;
  color: var(--accent);
}

.login-warning code,
.login-panel__foot code {
  font-family: var(--mono);
  font-size: 10px;
}

.login-input {
  max-width: 360px;
  margin-top: 28px;
}

.login-input :deep(.el-input__wrapper) {
  background: #fbfaf6;
  box-shadow: 0 0 0 1px var(--line-2) inset;
  border-radius: 2px;
  height: 50px;
}

.login-submit.el-button {
  width: 360px;
  max-width: 100%;
  margin-top: 12px;
  height: 50px;
}

.login-error {
  min-height: 20px;
  margin-top: 10px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: #a33b2c;
}

.login-panel__foot {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  margin-top: 34px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-size: 10px;
  line-height: 1.8;
  color: var(--dim);
}

.login-panel__foot a {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.login-panel__foot a:hover {
  color: var(--accent);
}

@media (max-width: 1460px) {
  .admin-main {
    grid-template-columns: 200px minmax(0, 1fr) 340px;
  }
  .admin-editor {
    padding: 40px 40px 90px;
  }
}

@media (max-width: 1280px) {
  .admin-main {
    grid-template-columns: 190px minmax(0, 1fr);
  }
  .admin-preview {
    display: none;
  }
}

@media (max-width: 860px) {
  .admin-bar {
    height: auto;
    min-height: 64px;
    padding: 12px 20px;
    flex-wrap: wrap;
  }
  .admin-bar__right {
    gap: 12px;
    flex-wrap: wrap;
  }
  .admin-status,
  .admin-dirty {
    display: none;
  }
  .admin-main {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .admin-nav {
    position: static;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
    padding: 16px 20px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .admin-nav__label,
  .admin-nav__foot {
    display: none;
  }
  .admin-nav__item {
    padding: 8px 12px;
    border: 1px solid var(--line);
    font-size: 15px;
  }
  .admin-editor {
    padding: 28px 20px 70px;
  }
  .admin-editor__head h1 {
    font-size: 32px;
  }
  .login {
    grid-template-columns: 1fr;
  }
  .login-aside {
    display: none;
  }
  .login-panel {
    min-height: calc(100vh - 72px);
    padding: 32px 24px;
  }
}
</style>
