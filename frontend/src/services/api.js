const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  // Farmer registration + harvest logging
  registerFarmer: (data) =>
    request('/register-farmer', { method: 'POST', body: JSON.stringify(data) }),
  getHarvests: () => request('/harvests'),
  createHarvest: (data) =>
    request('/harvests', { method: 'POST', body: JSON.stringify(data) }),

  // Districts
  getDistricts: () => request('/districts'),

  // Market intelligence
  marketTrends: (region, crop) => {
    const params = new URLSearchParams()
    if (region && region !== 'All') params.set('region', region)
    if (crop) params.set('crop', crop)
    return request(`/market-trends?${params}`)
  },
  districtFarmers: (districtName, crop) =>
    request(
      `/districts/${encodeURIComponent(districtName)}/farmers?crop=${encodeURIComponent(crop)}`,
    ),

  // Orders / escrow
  secureOrder: (data) =>
    request('/orders/secure', { method: 'POST', body: JSON.stringify(data) }),

  // Equipment marketplace
  getEquipment: () => request('/equipment'),
  createEquipment: (data) =>
    request('/equipment', { method: 'POST', body: JSON.stringify(data) }),

  // Snwolley Voice + Chat
  stt: (formData) =>
    fetch(`${API_BASE}/speech/stt`, { method: 'POST', body: formData })
      .then((r) => r.json()),

  tts: (text) =>
    fetch(`${API_BASE}/speech/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).then((r) => r.blob()),

  chat: (message, chat_id) =>
    fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ message, chat_id }),
    }).then((r) => r.json()),
}

export async function tryApi(fn, fallback) {
  try {
    return await fn()
  } catch {
    return fallback()
  }
}
