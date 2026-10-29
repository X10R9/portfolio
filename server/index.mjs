import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const DATA_FILE = path.join(ROOT, 'server', 'data', 'site.json')
const DEFAULTS_FILE = path.join(ROOT, 'src', 'data', 'site-defaults.json')
const PORT = Number(process.env.PORT || 4177)
const API_ONLY = process.argv.includes('--api-only')
const PASSWORD = process.env.ADMIN_PASSWORD || 'xuru2026'
const SECRET = process.env.ADMIN_SECRET || `xr-portfolio::${PASSWORD}`
const TOKEN_TTL = 8 * 60 * 60 * 1000
const MAX_BODY = 1.5 * 1024 * 1024
const ALLOWED_ORIGINS = new Set([
  'http://127.0.0.1:5175',
  'http://localhost:5175',
  'http://127.0.0.1:4177'
])

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
}

function ensureData() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    const seed = fs.existsSync(DEFAULTS_FILE) ? fs.readFileSync(DEFAULTS_FILE, 'utf8') : '{}'
    fs.writeFileSync(DATA_FILE, seed, 'utf8')
    console.log('[data] seeded', DATA_FILE)
  }
}

function readSite() {
  ensureData()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

function writeSite(data) {
  ensureData()
  const temp = `${DATA_FILE}.tmp`
  fs.writeFileSync(temp, JSON.stringify(data, null, 2) + '\n', 'utf8')
  fs.renameSync(temp, DATA_FILE)
}

function sign(expires) {
  return crypto.createHmac('sha256', SECRET).update(String(expires)).digest('base64url')
}

function createToken() {
  const expires = Date.now() + TOKEN_TTL
  return `${expires}.${sign(expires)}`
}

function verifyToken(header) {
  if (!header || !header.startsWith('Bearer ')) return false
  const token = header.slice(7).trim()
  const dot = token.indexOf('.')
  if (dot < 1) return false
  const expires = Number(token.slice(0, dot))
  const given = token.slice(dot + 1)
  if (!Number.isFinite(expires) || expires < Date.now()) return false
  const expected = sign(expires)
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function json(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('请求体过大'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function normalizeProject(project, index) {
  if (!project || typeof project !== 'object') return null
  const asString = (value, fallback = '') =>
    typeof value === 'string' ? value : value == null ? fallback : String(value)
  const asArray = (value) => (Array.isArray(value) ? value : [])

  return {
    id: asString(project.id) || `project-${Date.now()}-${index}`,
    index: asString(project.index, String(index + 1).padStart(2, '0')),
    title: asString(project.title, '未命名项目'),
    subtitle: asString(project.subtitle),
    type: asString(project.type),
    year: asString(project.year),
    role: asString(project.role),
    stack: asArray(project.stack).map((item) => asString(item)).filter(Boolean),
    summary: asString(project.summary),
    cover: asString(project.cover),
    coverAlt: asString(project.coverAlt),
    coverPosition: asString(project.coverPosition, '50% 50%'),
    aspect: asString(project.aspect, '16 / 10'),
    gallery: asArray(project.gallery)
      .map((item) => ({
        src: asString(item?.src),
        alt: asString(item?.alt)
      }))
      .filter((item) => item.src),
    facts: asArray(project.facts)
      .map((item) => ({
        value: asString(item?.value),
        label: asString(item?.label)
      }))
      .slice(0, 8),
    sections: asArray(project.sections)
      .map((item) => ({
        title: asString(item?.title),
        body: asString(item?.body)
      }))
      .slice(0, 8),
    highlights: asArray(project.highlights).map((item) => asString(item)).slice(0, 10)
  }
}

function normalizeSite(input) {
  const data = input && typeof input === 'object' ? input : {}
  const profile = data.profile && typeof data.profile === 'object' ? data.profile : {}
  const asString = (value, fallback = '') =>
    typeof value === 'string' ? value : value == null ? fallback : String(value)

  if (!asString(profile.name).trim()) {
    throw Object.assign(new Error('姓名不能为空'), { status: 400 })
  }

  return {
    profile: {
      ...profile,
      name: asString(profile.name),
      email: asString(profile.email),
      intro: Array.isArray(profile.intro) ? profile.intro.map((item) => asString(item)) : [],
      focus: Array.isArray(profile.focus) ? profile.focus.map((item) => asString(item)) : [],
      stats: Array.isArray(profile.stats)
        ? profile.stats.map((item) => ({
            value: asString(item?.value),
            label: asString(item?.label),
            note: asString(item?.note)
          }))
        : [],
      timeline: Array.isArray(profile.timeline)
        ? profile.timeline.map((item) => ({
            year: asString(item?.year),
            title: asString(item?.title),
            note: asString(item?.note)
          }))
        : []
    },
    projects: (Array.isArray(data.projects) ? data.projects : [])
      .map(normalizeProject)
      .filter(Boolean),
    moreWork: (Array.isArray(data.moreWork) ? data.moreWork : []).map((item) => ({
      title: asString(item?.title),
      meta: asString(item?.meta),
      year: asString(item?.year),
      detail: asString(item?.detail)
    })),
    updatedAt: new Date().toISOString()
  }
}

const attempts = new Map()

function clientKey(req) {
  return req.socket.remoteAddress || 'local'
}

async function handleApi(req, res, url) {
  const origin = req.headers.origin
  if (origin && (ALLOWED_ORIGINS.has(origin) || origin === `http://127.0.0.1:${PORT}`)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return true
  }

  if (url.pathname === '/api/health') {
    json(res, 200, { ok: true, service: 'xr-portfolio-admin', now: new Date().toISOString() })
    return true
  }

  if (url.pathname === '/api/login' && req.method === 'POST') {
    const key = clientKey(req)
    const entry = attempts.get(key)
    if (entry && entry.until > Date.now()) {
      json(res, 429, { error: '尝试次数过多，请稍后再试' })
      return true
    }

    let body
    try {
      body = JSON.parse(await readBody(req))
    } catch {
      json(res, 400, { error: '请求格式不正确' })
      return true
    }

    const given = typeof body?.password === 'string' ? body.password : ''
    const a = Buffer.from(given)
    const b = Buffer.from(PASSWORD)
    const ok = a.length === b.length && crypto.timingSafeEqual(a, b)

    if (!ok) {
      const next = { count: (entry?.count || 0) + 1, until: 0 }
      if (next.count >= 8) {
        next.count = 0
        next.until = Date.now() + 10 * 60 * 1000
      }
      attempts.set(key, next)
      await new Promise((resolve) => setTimeout(resolve, 450))
      json(res, 401, { error: '密码不正确' })
      return true
    }

    attempts.delete(key)
    const token = createToken()
    json(res, 200, { token, expiresAt: Date.now() + TOKEN_TTL })
    return true
  }

  if (url.pathname === '/api/site' && req.method === 'GET') {
    json(res, 200, readSite())
    return true
  }

  if (url.pathname === '/api/site' && (req.method === 'PUT' || req.method === 'POST')) {
    if (!verifyToken(req.headers.authorization)) {
      json(res, 401, { error: '未登录或登录已过期' })
      return true
    }

    let body
    try {
      body = JSON.parse(await readBody(req))
    } catch (error) {
      json(res, error.status || 400, { error: error.status ? error.message : '请求格式不正确' })
      return true
    }

    let normalized
    try {
      normalized = normalizeSite(body)
    } catch (error) {
      json(res, error.status || 400, { error: error.message })
      return true
    }

    writeSite(normalized)
    console.log('[data] saved', new Date().toISOString())
    json(res, 200, normalized)
    return true
  }

  json(res, 404, { error: '接口不存在' })
  return true
}

function serveStatic(req, res, url) {
  if (API_ONLY) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('API only')
    return
  }

  if (!fs.existsSync(DIST)) {
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('dist 不存在，请先运行 npm run build')
    return
  }

  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400).end('Bad request')
    return
  }

  if (pathname === '/admin' || pathname === '/admin/') pathname = '/index.html'
  if (pathname === '/') pathname = '/index.html'

  const safePath = path
    .normalize(pathname)
    .replace(/^(\.\.[/\\])+/, '')
    .replace(/^[/\\]+/, '')
  let file = path.join(DIST, safePath)
  if (!file.startsWith(DIST + path.sep) && file !== DIST) {
    res.writeHead(403).end('Forbidden')
    return
  }

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (!path.extname(pathname)) {
      file = path.join(DIST, 'index.html')
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Not found')
      return
    }
  }

  const ext = path.extname(file).toLowerCase()
  const stat = fs.statSync(file)
  const isHashedAsset = pathname.startsWith('/assets/')
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': isHashedAsset ? 'public, max-age=31536000, immutable' : 'no-store',
    'X-Content-Type-Options': 'nosniff'
  })

  if (req.method === 'HEAD') {
    res.end()
    return
  }

  fs.createReadStream(file).pipe(res)
}

ensureData()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`)
  try {
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url)
      return
    }
    serveStatic(req, res, url)
  } catch (error) {
    console.error('[server]', error)
    if (!res.headersSent) json(res, 500, { error: '服务器内部错误' })
    else res.end()
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Portfolio server  http://127.0.0.1:${PORT}`)
  console.log(`  Admin             http://127.0.0.1:${PORT}/?admin=1`)
  if (API_ONLY) console.log('  Mode              API only')
  console.log('')
})
