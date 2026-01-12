import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import toast from 'react-hot-toast';

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config || {};

    // Handle 401 globally
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests with exponential backoff and Retry-After support
    if (error.response?.status === 429) {
      // Ensure we only retry a few times
      config.__retryCount = config.__retryCount || 0;
      const maxRetries = 3;

      if (config.__retryCount >= maxRetries) {
        toast.error('Too many requests. Please wait a moment and try again.');
        return Promise.reject(error);
      }

      config.__retryCount += 1;

      // Check for Retry-After header (in seconds) and fall back to exponential backoff
      const retryAfterHeader = error.response.headers && (error.response.headers['retry-after'] || error.response.headers['Retry-After']);
      let delayMs = 1000 * Math.pow(2, config.__retryCount - 1); // 1s, 2s, 4s

      if (retryAfterHeader) {
        const parsed = parseInt(retryAfterHeader, 10);
        if (!Number.isNaN(parsed)) {
          delayMs = Math.max(delayMs, parsed * 1000);
        }
      }

      // add a small jitter so many clients don't retry simultaneously
      delayMs += Math.floor(Math.random() * 500);

      await new Promise(resolve => setTimeout(resolve, delayMs));

      // Retry the original request
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;