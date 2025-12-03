export interface ProviderKey {
  id: string
  name: string
  provider: string
  key: string
  created: string
}

const STORAGE_KEY = "phantomagents.keys"

function readStorage(): ProviderKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ProviderKey[]
  } catch (e) {
    console.error("keys-client: failed to read storage", e)
    return []
  }
}

function writeStorage(keys: ProviderKey[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch (e) {
    console.error("keys-client: failed to write storage", e)
  }
}

export function getKeys(): ProviderKey[] {
  return readStorage()
}

export function addKey(data: { name: string; provider: string; key: string }): ProviderKey {
  const keys = readStorage()
  const id = Math.random().toString(36).substring(2, 9)
  const item: ProviderKey = {
    id,
    name: data.name,
    provider: data.provider,
    key: data.key,
    created: new Date().toISOString(),
  }
  keys.unshift(item)
  writeStorage(keys)
  return item
}

export function deleteKey(id: string) {
  const keys = readStorage().filter((k) => k.id !== id)
  writeStorage(keys)
}

export function updateKey(id: string, updates: Partial<ProviderKey>) {
  const keys = readStorage()
  const idx = keys.findIndex((k) => k.id === id)
  if (idx === -1) return null
  keys[idx] = { ...keys[idx], ...updates }
  writeStorage(keys)
  return keys[idx]
}

export function maskKey(k: string) {
  if (!k) return ""
  if (k.length <= 10) return k.slice(0, 4) + "••••"
  return k.slice(0, 6) + "••••" + k.slice(-4)
}
