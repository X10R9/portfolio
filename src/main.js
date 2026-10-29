import { createApp } from 'vue'
import { ElBacktop, ElButton, ElDialog, ElIcon, ElImage, ElTag } from 'element-plus'
import 'element-plus/es/components/base/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/overlay/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/image/style/css'
import 'element-plus/es/components/image-viewer/style/css'
import 'element-plus/es/components/backtop/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/message/style/css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/element.css'

const isAdmin =
  new URLSearchParams(window.location.search).has('admin') ||
  /^\/admin\/?$/.test(window.location.pathname)

if (isAdmin) {
  document.documentElement.classList.add('admin-mode')
  document.title = '内容管理 · 徐茹'
}

const rootModule = isAdmin ? import('./admin/AdminApp.vue') : import('./App.vue')

rootModule.then(({ default: Root }) => {
  const app = createApp(Root)
  for (const component of [ElButton, ElTag, ElDialog, ElImage, ElIcon, ElBacktop]) {
    app.use(component)
  }
  app.mount('#app')
})
