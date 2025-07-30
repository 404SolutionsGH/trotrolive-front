import Cookies from 'js-cookie';
import axios from 'axios';
import { tokenManager } from './manager'; // Import the token manager

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trotro.live';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('Axios Request:', config.method?.toUpperCase(), config.url);
    
    // Skip auth for specific endpoints
    const authSkipEndpoints = [
      '/civic-login/', 
      '/auth/login/', 
      '/register/', 
      '/token/refresh/',
      '/accounts/api/civic-auth/',
      '/accounts/api/login/',
      '/accounts/api/register/'
    ];
    const shouldSkipAuth = authSkipEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (!shouldSkipAuth) {
      // Get token from token manager
      let token = tokenManager.getAccessToken();
      console.log('[Axios Interceptor] Using token:', token ? 'Token exists' : 'No token');

      if (token && tokenManager.isTokenExpired(token)) {
        try {
          console.log('[Axios Interceptor] Token expired, refreshing...');
          token = await tokenManager.refreshToken();
        } catch (error) {
          console.error('Failed to refresh token in request interceptor:', error);
          return Promise.reject(error);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('[Axios Interceptor] No access token found for authenticated request.');
      }
    }

    // Add CSRF token if available
    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors by attempting token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('[Axios Response Interceptor] 401 error, attempting token refresh...');
        const newToken = await tokenManager.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed in response interceptor:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
