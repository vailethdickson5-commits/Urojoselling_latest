import api from './api'

export async function createOrder(payload) {
  const res = await api.post('/api/orders/', payload)
  return res.data
}

export async function listOrders() {
  const res = await api.get('/api/orders/')
  return res.data
}

export async function getOrder(id) {
  const res = await api.get(`/api/orders/${id}/`)
  return res.data
}

export async function updateOrderStatus(id, payload) {
  const res = await api.put(`/api/orders/${id}/status/`, payload)
  return res.data
}
