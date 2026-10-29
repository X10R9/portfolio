# 徐茹 · 个人作品集

一个暖纸色系的个人作品集网站，用 **Vue 3 + Element Plus** 实现。包含全屏视频首页、关于、精选项目、整屏联系页，以及一个可以直接修改内容并即时同步到网站的后台。

- 版心 1700px，PC 优先，同时适配 1280 / 768 / 390
- 浅色主题：暖纸底 `#f2f0ea` + 墨色正文 + 铜色强调 `#a85b2e`
- 首页背景是 12 秒程序化地形线场视频，移动端回退为静态封面
- 自定义鼠标跟随：铜色圆点 + 延迟圆环，悬停项目显示 `VIEW`
- 后台支持基本信息、项目、其他实验的编辑与实时预览，保存后已打开的网站页面会自动刷新

## 运行

```bash
npm install
```

开发时需要同时启动 **API** 和 **Vite**（两个终端）：

```bash
# 终端 1：管理 API，端口 4177
npm run api

# 终端 2：前端开发服务器，端口 5175
npm run dev
```

- 网站：`http://127.0.0.1:5175/`
- 后台：`http://127.0.0.1:5175/?admin=1`
- 默认管理密码：`xuru2026`

> 只开 `npm run dev` 也能浏览网站（回退到默认数据），但后台登录/保存需要 API。
> 修改密码：启动 API 前设置环境变量 `ADMIN_PASSWORD`，例如 PowerShell：
> `$env:ADMIN_PASSWORD="your-password"; npm run api`。

生产构建与本地服务：

```bash
npm run build     # 输出 dist/
npm run serve     # Node 服务：dist + /api + 后台，端口 4177
```

生产地址：`http://127.0.0.1:4177/`，后台：`http://127.0.0.1:4177/?admin=1`。
如需换端口：`$env:PORT="4200"; npm run serve`。

## 数据是怎么走的

```text
浏览器页面 ──GET /api/site──▶ Node 服务 ──读──▶ server/data/site.json
                    │
                    └── 接口不可用 ──▶ src/data/site-defaults.json
后台保存 ──PUT /api/site──▶ 校验 + 写入 + BroadcastChannel ──▶ 其他标签页重新拉取
```

- **`server/data/site.json`**：网站的真实内容。后台保存后写这里，无需重新构建。
- **`src/data/site-defaults.json`**：初始内容与静态回退。API 不可用时网站仍能显示。
- **`src/stores/site.js`**：前端唯一的站点数据源，负责加载、应用和保存后的同步。
- 首次启动如果 `server/data/site.json` 不存在，会自动从 defaults 复制一份。

> 如果之后改了 `site-defaults.json`，已经在用的 `server/data/site.json` 不会被覆盖；以后台数据为准。

## 后台

地址：`/?admin=1` 或 `/admin`。

- **基本信息**：姓名、拼音、字标、年级、学校、专业、所在地、坐标、邮箱、开放状态、人像路径；首屏介绍、当前关注、关于段落、项目数据、实践线索。
- **精选项目**：新增 / 删除 / 上下排序；编辑名称、副标题、类型、年份、角色、技术标签、简介、封面路径、裁切位置、比例、项目数据、详情正文、关键要点、补充图片。
- **其他实验**：名称、技术类型、年份、补充说明的增删改。
- **实时预览**：右侧是一张缩小的网站预览，输入时即时更新。
- **保存并发布**：写入 `server/data/site.json`，并通过 BroadcastChannel 通知已打开的网站页面自动重新拉取。
- **图片**：目前填写路径，不做上传。把图片放到 `public/images/projects/`，在后台填 `/images/projects/文件名.webp`。人像同理：放到 `public/images/portrait.jpg`，在后台填 `/images/portrait.jpg`，关于区会从等高线插图切换为照片。

### 安全边界

这是单人使用的本地后台，不是多用户 CMS：

- 单一管理密码 + HMAC 签名 token（8 小时有效），服务端校验。
- 连续 8 次密码错误会锁定该 IP 10 分钟。
- 服务默认只监听 `127.0.0.1`，不要直接把端口暴露到公网。
- 若要部署到公网，请修改 `ADMIN_PASSWORD` / `ADMIN_SECRET`、配置 HTTPS，并在反向代理层加访问控制。
- 后台依赖 Node 服务。**纯静态托管只能浏览，不能保存**；要保留后台能力，需要 Node 运行环境（VPS、Render、Railway 等）。

## 目录

```text
portfolio/
├─ public/
│  ├─ media/hero-field.webm        # 浅色地形线场视频（12s，1600×900）
│  ├─ media/hero-poster.jpg        # 视频封面 / 移动端静态背景
│  ├─ images/projects/*.webp       # 项目图片
│  └─ favicon.svg
├─ src/
│  ├─ components/                  # 公开站点组件（含 SiteCursor）
│  ├─ admin/                       # 后台页面与编辑器
│  ├─ composables/useCopyEmail.js
│  ├─ data/site-defaults.json      # 默认内容（静态回退）
│  ├─ stores/site.js               # 站点数据 store / API 客户端
│  ├─ styles/                      # tokens / base / Element Plus 覆盖
│  ├─ App.vue
│  └─ main.js                      # 按页面动态加载站点或后台
├─ server/
│  ├─ index.mjs                    # API + 静态服务
│  └─ data/site.json               # 线上内容（后台写入）
├─ dist/                           # 构建产物
├─ vite.config.js
└─ package.json
```

## 设计说明

- **字体**：Noto Serif SC 做大标题，Noto Sans SC 做正文，Bahnschrift / Consolas 做编号与标签。
- **颜色**：`src/styles/tokens.css`。暖纸底、墨色、铜色强调；Element Plus 变量在 `src/styles/element.css` 统一覆盖。
- **尺寸**：容器 1700px，左右留白 `clamp(24px, 3.6vw, 64px)`。
- **鼠标**：`SiteCursor.vue` 在 `hover:hover` 且非 `prefers-reduced-motion` 时启用；触屏和减少动态偏好下保持原生光标。首页与联系页另有低强度跟随光斑。
- **动效**：滚动入场使用 IntersectionObserver；保存后的页面同步使用 BroadcastChannel；不依赖动画库。
- **视频**：WebM（VP9），Chrome / Edge 直接播放；其它浏览器回退到封面图。

## 已知取舍

- 后台没有图片上传，只支持填路径；要上传需要再加一个文件接口和存储目录。
- 后台是单人密码，不是账号体系；公开部署前请务必改密码并加访问控制。
- 首页视频约 3.5MB，是页面里最大的静态资源；后续可以压到 2MB 左右。
- 关于区默认是等高线人像插图，不是真实照片；拿到照片后按上面的方式替换即可。
- 项目内容来自本地 `作品集/` 与各项目 README，没有编造在线演示地址。
