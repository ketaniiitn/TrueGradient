import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Test connection
  testConnection: () => api.get('/api/test'),
  
  // Authentication (to be implemented)
  // login: (credentials) => api.post('/api/auth/login', credentials),
  // register: (userData) => api.post('/api/auth/register', userData),
};

export default api;