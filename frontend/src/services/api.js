import axios from 'axios';

// Prefer environment variable (defined at build time). Fallback to deployed backend.
// During local dev create a .env file with: VITE_API_BASE_URL=http://127.0.0.1:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://truegradient.onrender.com';

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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Test connection
  testConnection: () => api.get('/api/test'),
  
  // Authentication endpoints
  auth: {
    login: async (credentials) => {
      try {
        const response = await api.post('/api/auth/login', credentials);
        const { access_token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Login failed';
        throw new Error(errorMessage);
      }
    },
    
    register: async (userData) => {
      try {
        const response = await api.post('/api/auth/register', userData);
        const { access_token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Registration failed';
        throw new Error(errorMessage);
      }
    },
    
    logout: async () => {
      try {
        await api.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    
    getProfile: () => api.get('/api/auth/profile'),
    
    // Helper functions
    getToken: () => localStorage.getItem('token'),
    getUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
    isAuthenticated: () => {
      const token = localStorage.getItem('token');
      return !!token;
    },
  },
  // Chat endpoints (placeholder implementation)
  chat: {
    sendMessage: async (content) => {
      // Attempt real backend call if endpoint exists; fallback to mock answer
      try {
        const response = await api.post('/api/chat', { message: content });
        return response.data; // expected shape: { id, role:'assistant', content, tokens }
      } catch (error) {
        // If 404 or network error, return a mocked assistant response so UI works
        console.warn('Chat endpoint fallback (mock used):', error?.response?.status);
        return new Promise((resolve) => {
          setTimeout(() => resolve({
            id: Date.now().toString(),
            role: 'assistant',
            content: `Mock response: You said "${content}"`,
            tokens: Math.ceil(content.length / 4) + 5,
          }), 600);
        });
      }
    }
  }
};

export default api;