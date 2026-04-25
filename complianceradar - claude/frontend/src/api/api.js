import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cr_token')
      localStorage.removeItem('cr_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post('/auth/login', data).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
}

// ── Citizen Reports ───────────────────────────────────
export const reportApi = {
  submit:     (data) => api.post('/reports', data).then(r => r.data),
  mine:       ()     => api.get('/reports/mine').then(r => r.data),
  all:        ()     => api.get('/reports').then(r => r.data),
  points:     ()     => api.get('/reports/points').then(r => r.data),
  resolve:    (id)   => api.patch(`/reports/${id}/resolve`).then(r => r.data),
}

// ── Enforcement Alerts ────────────────────────────────
export const alertApi = {
  all:        ()     => api.get('/alerts').then(r => r.data),
  open:       ()     => api.get('/alerts/open').then(r => r.data),
  mine:       ()     => api.get('/alerts/mine').then(r => r.data),
  resolve:    (id)   => api.patch(`/alerts/${id}/resolve`).then(r => r.data),
}

// ── Fusion Engine ─────────────────────────────────────
export const fusionApi = {
  trigger: () => api.post('/fusion/trigger').then(r => r.data),
}

// ── Industrial Units ──────────────────────────────────
export const unitApi = {
  all:          ()           => api.get('/units').then(r => r.data),
  lowCompliance:(threshold)  => api.get(`/units/low-compliance?threshold=${threshold}`).then(r => r.data),
}

// ── Satellite ─────────────────────────────────────────
export const satelliteApi = {
  all: () => api.get('/satellite').then(r => r.data),
}

export default api
