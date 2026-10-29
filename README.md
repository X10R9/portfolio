# 徐茹 · 个人作品集

一个暗色系的个人作品集网站，用 **Vue 3 + Element Plus** 实现。面向桌面端设计，版心 1700px，包含全屏视频首页、关于、精选项目与整屏联系页。

## 运行

```bash
npm install
npm run dev
```

默认地址：`http://127.0.0.1:5175/`（见 `vite.config.js`）。

生产构建与预览：

```bash
npm run build
npm run preview
```

构建产物在 `dist/`，可以直接部署到任意静态托管平台。

## 页面结构

| 模块 | 组件 | 内容 |
| --- | --- | --- |
| 全屏首页 | `HeroSection.vue` | 背景视频、大标题、导航、联系按钮 |
| 关于 | `AboutSection.vue` | 人像 / 个人介绍 / 联系方式 / 项目数据 / 实践线索 |
| 精选项目 | `ProjectsSection.vue` + `ProjectCard.vue` | 4 张大卡片，点击打开详情弹窗 |
| 项目详情 | `ProjectDialog.vue` | 背景、做法、结果、关键要点、图片预览 |
| 收尾联系页 | `ContactSection.vue` | 整屏标题、邮箱、复制邮箱、页脚 |

## 目录

```text
portfolio/
├─ public/
│  ├─ media/hero-field.webm       # 首页背景视频（12s 循环，1600×900）
│  ├─ media/hero-poster.jpg       # 视频封面，移动端作为静态背景
│  ├─ images/projects/*.webp      # 项目图片
│  └─ favicon.svg
├─ src/
│  ├─ components/                 # 页面与可复用组件
│  ├─ composables/useCopyEmail.js # 复制邮箱 + ElMessage
│  ├─ data/profile.js             # 个人信息、统计、时间线
│  ├─ data/projects.js            # 项目数据（卡片与详情共用）
│  ├─ styles/tokens.css           # 颜色、字体、间距、版心
│  ├─ styles/base.css             # reset、排版、按钮、滚动动效
│  ├─ styles/element.css          # Element Plus 主题覆盖
│  ├─ App.vue                     # 页面组装 + 滚动入场观察
│  └─ main.js                     # 按需注册 Element Plus 组件
├─ index.html
├─ vite.config.js
└─ package.json
```

## 改内容

- **个人信息、统计、时间线**：`src/data/profile.js`。
- **项目卡片与弹窗**：`src/data/projects.js`，字段包括 `title`、`summary`、`cover`、`gallery`、`facts`、`sections`、`highlights`、`aspect`。
- **项目图片**：替换 `public/images/projects/` 下的同名 WebP 即可；建议 16:10 或 4:3，宽度 1600px 左右。
- **人像**：默认显示一幅等高线侧影插图。把照片放到 `public/images/portrait.jpg`，再将 `profile.js` 里的 `portrait` 改为 `'/images/portrait.jpg'`，卡片会自动切换成照片。
- **背景视频**：替换 `public/media/hero-field.webm` 与 `hero-poster.jpg`；保持 16:9、无声、可循环。移动端只加载封面图。
- **配色与字体**：`src/styles/tokens.css`。主色是仪器铜 `#d7a36b`，底色是 `#151a1e`，正文使用本机 Noto Serif SC / Noto Sans SC，编码号与标签使用 Bahnschrift / Consolas。

## 技术说明

- **Element Plus** 按组件注册（`ElButton`、`ElTag`、`ElDialog`、`ElImage`、`ElIcon`、`ElBacktop`），样式也按组件引入，构建后 CSS 约 15KB gzip。
- 图标从 `@element-plus/icons-vue` 单独引入，不注册整包。
- 滚动入场使用原生 `IntersectionObserver`，尊重 `prefers-reduced-motion`。
- 深色模式固定开启（`<html class="dark">`），Element Plus 变量在 `element.css` 中统一覆盖。
- 没有后端、没有表单提交；联系动作只有 `mailto:` 和复制邮箱。
- 背景视频为 WebM（VP9），Chrome / Edge 可直接播放；其他浏览器会回退到封面图。

## 已知取舍

- 首页视频约 4.6MB，属于视觉素材的主要体积；后续可以压到 2MB 左右或换成分段加载。
- 关于区默认是线稿人像，不是真实照片；拿到照片后按上面的方式替换。
- 项目内容来自本地 `作品集/` 目录与已有项目 README，没有写在线演示链接，因为目前没有可公开的部署地址。
- 本项目为 PC 优先，同时保证 1280 / 768 / 390 三档无横向滚动。
