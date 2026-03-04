import axios from 'axios'

<<<<<<< HEAD
const api = axios.create({
  baseURL: '/',
=======
const baseURL = (import.meta.env.VITE_API_BASE_URL || '/').replace(/\/$/, '')

const api = axios.create({
  baseURL,
>>>>>>> a35df03b0edb4f0a097edb68a952653ee60c665c
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
