import defaults from '../_lib/defaults.js'

/**
 * Cloudflare Pages Functions API for the portfolio admin.
 *
 * Bindings required in the Pages project:
 *   SITE_DATA      KV namespace (stores the site JSON under the "site" key)
 *   ADMIN_PASSWORD secret string
 *   ADMIN_SECRET   optional, recommended random string
 *
 * Routes:
 *   GET  /api/health
 *   POST /api/login
 *   GET  /api/site
 *   PUT  /api/site   (Bearer token from /api/login)
 */

const MAX_BODY = 1.5 * 1024 * 1024
const TOKEN_TTL = 8 * 60 * 60 * 1000
const LOGIN_LIMIT = 8
const LOCK_MS = 10 * 60 * 1000
const encoder = new TextEncoder()

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  })
}

function requireKv(env) {
  if (!env.SITE_DATA) {
    throw new HttpError(503, '未绑定 SITE_DATA。请在 Cloudflare Pages 的 KV 绑定中添加它。')
  }
  return env.SITE_DATA
}

function getConfig(env) {
  if (!env.ADMIN_PASSWORD) {
    throw new HttpError(503, '未配置 ADMIN_PASSWORD。请在 Cloudflare Pages 的环境变量中添加它。')
  }
  return {
    password: env.ADMIN_PASSWORD,
    secret: env.ADMIN_SECRET || `xr-portfolio::${env.ADMIN_PASSWORD}`
  }
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : value == null ? fallback : String(value)
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeProject(project, index) {
  if (!project || typeof project !== 'object') return null

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
      .map((item) => ({ src: asString(item?.src), alt: asString(item?.alt) }))
      .filter((item) => item.src),
    facts: asArray(project.facts)
      .map((item) => ({ value: asString(item?.value), label: asString(item?.label) }))
      .slice(0, 8),
    sections: asArray(project.sections)
      .map((item) => ({ title: asString(item?.title), body: asString(item?.body) }))
      .slice(0, 8),
    highlights: asArray(project.highlights)
      .map((item) => asString(item))
      .slice(0, 10)
  }
}

function normalizeSite(input) {
  const data = input && typeof input === 'object' ? input : {}
  const profile = data.profile && typeof data.profile === 'object' ? data.profile : {}

  if (!asString(profile.name).trim()) {
    throw new HttpError(400, '姓名不能为空')
  }

  return {
    profile: {
      ...profile,
      name: asString(profile.name),
      email: asString(profile.email),
      intro: asArray(profile.intro).map((item) => asString(item)),
      focus: asArray(profile.focus).map((item) => asString(item)),
      stats: asArray(profile.stats).map((item) => ({
        value: asString(item?.value),
        label: asString(item?.label),
        note: asString(item?.note)
      })),
      timeline: asArray(profile.timeline).map((item) => ({
        year: asString(item?.year),
        title: asString(item?.title),
        note: asString(item?.note)
      }))
    },
    projects: asArray(data.projects).map(normalizeProject).filter(Boolean),
    moreWork: asArray(data.moreWork).map((item) => ({
      title: asString(item?.title),
      meta: asString(item?.meta),
      year: asString(item?.year),
      detail: asString(item?.detail)
    })),
    updatedAt: new Date().toISOString()
  }
}

async function readJson(request) {
  const text = await request.text()
  if (encoder.encode(text).byteLength > MAX_BODY) {
    throw new HttpError(413, '请求体过大')
  }
  if (!text.trim()) throw new HttpError(400, '请求体不能为空')
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, '请求格式不正确')
  }
}

function toBase64Url(bytes) {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value) {
  try {
    const base = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base.padEnd(Math.ceil(base.length / 4) * 4, '=')
    const binary = atob(padded)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  } catch {
    return null
  }
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function sign(secret, expires) {
  const signature = await crypto.subtle.sign(
    'HMAC',
    await hmacKey(secret),
    encoder.encode(String(expires))
  )
  return toBase64Url(new Uint8Array(signature))
}

async function createToken(secret) {
  const expires = Date.now() + TOKEN_TTL
  return `${expires}.${await sign(secret, expires)}`
}

async function verifyToken(header, secret) {
  if (!header || !header.startsWith('Bearer ')) return false
  const token = header.slice(7).trim()
  const dot = token.indexOf('.')
  if (dot < 1) return false

  const expires = Number(token.slice(0, dot))
  const now = Date.now()
  if (!Number.isFinite(expires) || expires < now || expires > now + TOKEN_TTL + 5 * 60 * 1000) {
    return false
  }

  const signature = fromBase64Url(token.slice(dot + 1))
  if (!signature) return false

  return crypto.subtle.verify(
    'HMAC',
    await hmacKey(secret),
    signature,
    encoder.encode(String(expires))
  )
}

async function digest(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
}

async function passwordMatches(given, expected) {
  if (given.length > 512) return false
  const [a, b] = await Promise.all([digest(given), digest(expected)])
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i]
  return diff === 0
}

function clientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Real-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

async function getAttempts(kv, ip) {
  try {
    return (await kv.get(`login:${ip}`, { type: 'json' })) || { count: 0, until: 0 }
  } catch {
    return { count: 0, until: 0 }
  }
}

async function recordFailure(kv, ip, previous) {
  const next = { count: (previous?.count || 0) + 1, until: 0 }
  if (next.count >= LOGIN_LIMIT) {
    next.count = 0
    next.until = Date.now() + LOCK_MS
  }
  await kv.put(`login:${ip}`, JSON.stringify(next), { expirationTtl: 900 })
}

async function handleLogin(request, env) {
  if (request.method !== 'POST') throw new HttpError(405, '只支持 POST')
  const config = getConfig(env)
  const kv = requireKv(env)
  const ip = clientIp(request)

  const previous = await getAttempts(kv, ip)
  if (previous.until > Date.now()) {
    throw new HttpError(429, '尝试次数过多，请稍后再试')
  }

  const body = await readJson(request)
  const given = typeof body?.password === 'string' ? body.password : ''
  const ok = await passwordMatches(given, config.password)

  if (!ok) {
    await recordFailure(kv, ip, previous)
    await new Promise((resolve) => setTimeout(resolve, 450))
    throw new HttpError(401, '密码不正确')
  }

  await kv.delete(`login:${ip}`).catch(() => {})
  return json({ token: await createToken(config.secret), expiresIn: TOKEN_TTL / 1000 })
}

async function handleSite(request, env) {
  if (request.method === 'GET') {
    if (!env.SITE_DATA) return json(defaults)
    try {
      const saved = await env.SITE_DATA.get('site', { type: 'json', cacheTtl: 30 })
      return json(saved || defaults)
    } catch {
      return json(defaults)
    }
  }

  if (request.method !== 'PUT') throw new HttpError(405, '只支持 GET / PUT')
  const config = getConfig(env)
  const kv = requireKv(env)
  const ok = await verifyToken(request.headers.get('Authorization'), config.secret)
  if (!ok) throw new HttpError(401, '登录已过期，请重新登录')

  const body = await readJson(request)
  const site = normalizeSite(body)
  await kv.put('site', JSON.stringify(site))
  return json(site)
}

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { Allow: 'GET, PUT, POST, OPTIONS' }
    })
  }

  try {
    if (url.pathname === '/api/health') {
      return json({
        ok: true,
        service: 'xr-portfolio-admin',
        runtime: 'cloudflare-pages',
        adminReady: Boolean(env.SITE_DATA && env.ADMIN_PASSWORD),
        now: new Date().toISOString()
      })
    }

    if (url.pathname === '/api/login') {
      return await handleLogin(request, env)
    }

    if (url.pathname === '/api/site') {
      return await handleSite(request, env)
    }

    return json({ error: '接口不存在' }, 404)
  } catch (error) {
    if (error instanceof HttpError) {
      return json({ error: error.message }, error.status)
    }
    console.error('[api]', error)
    return json({ error: '服务暂时不可用，请稍后重试' }, 500)
  }
}
