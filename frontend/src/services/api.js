import axios from 'axios'

const defaultApiBaseUrl = 'https://urojoselling-latest-2.onrender.com'
const baseURL = (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).replace(/\/$/, '')

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
