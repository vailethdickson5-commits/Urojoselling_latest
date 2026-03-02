import api from './api'

function toProductFormData(payload) {
  const fd = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return
    if (value === null) return
    if (key === 'image' && !value) return
    fd.append(key, value)
  })
  return fd
}

export async function listProducts() {
  const res = await api.get('/api/products/')
  return res.data
}

export async function getProduct(id) {
  const res = await api.get(`/api/products/${id}/`)
  return res.data
}

export async function listCategories() {
  const res = await api.get('/api/categories/')
  return res.data
}

export async function createCategory(payload) {
  const res = await api.post('/api/categories/', payload)
  return res.data
}

export async function updateCategory(id, payload) {
  const res = await api.put(`/api/categories/${id}/`, payload)
  return res.data
}

export async function deleteCategory(id) {
  const res = await api.delete(`/api/categories/${id}/`)
  return res.data
}

export async function createProduct(payload) {
  const hasFile = payload?.image instanceof File
  const body = hasFile ? toProductFormData(payload) : payload
  const res = await api.post('/api/products/', body, {
    headers: hasFile ? { 'Content-Type': 'multipart/form-data' } : undefined,
  })
  return res.data
}

export async function updateProduct(id, payload) {
  const hasFile = payload?.image instanceof File
  const body = hasFile ? toProductFormData(payload) : payload
  const res = await api.put(`/api/products/${id}/`, body, {
    headers: hasFile ? { 'Content-Type': 'multipart/form-data' } : undefined,
  })
  return res.data
}

export async function deleteProduct(id) {
  const res = await api.delete(`/api/products/${id}/`)
  return res.data
}
