import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session cookies
})

// CSRF token storage
let csrfToken = null

// Fetch CSRF token from backend
async function getCSRFToken() {
    if (!csrfToken) {
        try {
            const response = await api.get('/csrf-token')
            csrfToken = response.data.token
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error)
        }
    }
    return csrfToken
}

// Request interceptor - add CSRF token to state-changing requests
api.interceptors.request.use(
    async (config) => {
        // Add CSRF token to POST, PUT, DELETE, PATCH requests
        if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
            const token = await getCSRFToken()
            if (token) {
                config.headers['X-CSRF-Token'] = token
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If CSRF token is invalid, fetch a new one and retry
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
            csrfToken = null // Clear the invalid token
            const newToken = await getCSRFToken()
            if (newToken && error.config) {
                error.config.headers['X-CSRF-Token'] = newToken
                return api.request(error.config) // Retry the request
            }
        }

        // Handle common errors
        if (error.response?.status === 401 && !error.config.url.includes('verify-session')) {
            // Unauthorized - clear local storage and redirect
            localStorage.removeItem('exman_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Initialize CSRF token on module load
getCSRFToken()

// API helper functions
export const authAPI = {
    login: (email, password) => api.post('/login', { email, password }),
    signup: (data) => api.post('/signup', data),
    logout: () => api.post('/logout'),
}

export const entriesAPI = {
    addEntry: (data) => api.post('/entry/add', data),
    getEntries: () => api.get('/dashboard'),
    deleteEntry: (entryId) => api.post(`/entry/delete/${entryId}`),
}

export const reportsAPI = {
    getWeekly: () => api.get('/reports/weekly'),
    getMonthly: () => api.get('/reports/monthly'),
    downloadPDF: (period) => api.get(`/reports/download/${period}`, { responseType: 'blob' }),
}

export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (data) => api.post('/profile/update', data),
    deleteAccount: () => api.post('/settings/delete'),
}

export default api
