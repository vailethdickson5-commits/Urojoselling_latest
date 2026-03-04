import api from './api'

export async function addStock(payload) {
  const res = await api.post('/api/inventory/add/', payload)
  return res.data
}

export async function listInventoryLogs() {
  const res = await api.get('/api/inventory/logs/')
  return res.data
}
