import { reactive } from 'vue'
import defaults from '../data/site-defaults.json'

const clone = (value) => JSON.parse(JSON.stringify(value))
const channelName = 'xr-site'

const state = reactive({
  profile: clone(defaults.profile),
  projects: clone(defaults.projects),
  moreWork: clone(defaults.moreWork),
  updatedAt: defaults.updatedAt || '',
  loaded: false,
  source: 'defaults'
})

function replaceObject(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return
  for (const key of Object.keys(target)) {
    if (!(key in source)) delete target[key]
  }
  Object.assign(target, clone(source))
}

/**
 * Merge server data into the existing reactive objects so components keep
 * their references while the page updates in place.
 */
export function applySite(data) {
  if (!data) return
  if (data.profile) replaceObject(state.profile, data.profile)
  if (Array.isArray(data.projects)) {
    state.projects.splice(0, state.projects.length, ...clone(data.projects))
  }
  if (Array.isArray(data.moreWork)) {
    state.moreWork.splice(0, state.moreWork.length, ...clone(data.moreWork))
  }
  if (data.updatedAt) state.updatedAt = data.updatedAt
}

export async function loadSite({ force = false } = {}) {
  if (state.loaded && !force) return state
  try {
    const response = await fetch('/api/site', {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    applySite(await response.json())
    state.source = 'api'
  } catch {
    state.source = 'defaults'
  } finally {
    state.loaded = true
  }
  return state
}

export async function saveSite(payload, token) {
  const response = await fetch('/api/site', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (response.status === 401) {
    const error = new Error('登录状态已过期，请重新登录')
    error.code = 401
    throw error
  }

  if (!response.ok) {
    let message = `保存失败（HTTP ${response.status}）`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      /* keep the fallback message */
    }
    throw new Error(message)
  }

  const data = await response.json()
  applySite(data)
  notifySiteUpdated(data)
  return data
}

export function notifySiteUpdated(data) {
  try {
    const channel = new BroadcastChannel(channelName)
    channel.postMessage({ type: 'site-updated', at: Date.now(), data })
    channel.close()
  } catch {
    /* BroadcastChannel is optional */
  }
}

export function subscribeSiteUpdates(handler) {
  if (typeof BroadcastChannel === 'undefined') return () => {}
  const channel = new BroadcastChannel(channelName)
  channel.onmessage = (event) => {
    if (event.data?.type === 'site-updated') handler(event.data)
  }
  return () => channel.close()
}

export const siteState = state
