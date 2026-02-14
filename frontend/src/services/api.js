import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401 errors for checkAuth - they're expected when not logged in
    if (error.config?.url === '/profile' && error.response?.status === 401) {
      // Silently handle 401 for profile check
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const signup = async (userData) => {
  const response = await api.post('/signup', userData)
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password })
  return response.data
}

export const logout = async () => {
  const response = await api.post('/logout')
  return response.data
}

export const checkAuth = async () => {
  try {
    const response = await api.get('/profile')
    return response.data
  } catch (error) {
    // 401 is expected when not logged in, so we don't need to log it
    if (error.response?.status === 401) {
      return null
    }
    throw error
  }
}

// Profile APIs
export const getProfile = async () => {
  const response = await api.get('/profile')
  return response.data
}

export const updateProfile = async (profileData) => {
  const response = await api.patch('/profile/edit', prfileData)
  return response.data
}

// User Feed APIs
export const getFeed = async (page = 1, limit = 10) => {
  const response = await api.get('/feed', {
    params: { page, limit }
  })
  return response.data
}

// Connection Request APIs
export const sendRequest = async (toUserId, status) => {
  const response = await api.post(`/request/send/${status}/${toUserId}`)
  return response.data
}

export const reviewRequest = async (requestId, status) => {
  const response = await api.post(`/request/review/${status}/${requestId}`)
  return response.data
}

// Connections APIs
export const getReceivedRequests = async () => {
  const response = await api.get('/user/requests/recieved')
  return response.data
}

export const getConnections = async () => {
  const response = await api.get('/user/connections')
  return response.data
}

export default api

