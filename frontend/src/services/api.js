import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send httpOnly cookies if supported
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor — attach Bearer token if present ───────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 & token refresh ───────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept 401s for auth endpoints like login, register, or refresh-token itself
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken =
          typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

        const refreshRes = await api.post('/auth/refresh-token', {
          refreshToken: storedRefreshToken,
        });

        const { accessToken: newAccess, refreshToken: newRefresh } =
          refreshRes.data?.data || {};

        if (typeof window !== 'undefined') {
          if (newAccess) localStorage.setItem('accessToken', newAccess);
          if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        }

        // Retry original request with new token
        if (newAccess) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Refresh failed — log out the user and clean tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          const { useAuthStore } = require('@/store/authStore');
          useAuthStore.getState().logout();

          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login';
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
