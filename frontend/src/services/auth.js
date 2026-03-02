import api from './api'

export async function register(payload) {
  const res = await api.post('/api/register/', payload)
  return res.data
}

export async function login(payload) {
  const res = await api.post('/api/login/', payload)
  return res.data
}
