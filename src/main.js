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
import 'element-plus/theme-chalk/dark/css-vars.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/element.css'

import App from './App.vue'

const app = createApp(App)

for (const component of [ElButton, ElTag, ElDialog, ElImage, ElIcon, ElBacktop]) {
  app.use(component)
}

app.mount('#app')
