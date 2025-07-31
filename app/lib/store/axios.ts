import Cookies from 'js-cookie';
import axios from 'axios';
import { tokenManager } from './manager'; // Import the token manager

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trotro.live';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Display-Mode',
  },
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add auth headers for authenticated requests (not for login/register)
    if (config.url && !config.url.includes('/auth/') && !config.url.includes('/csrf/')) {
      let token = tokenManager.getAccessToken();
      
      // Check if we're in iframe mode
      const isIframeAuth = localStorage.getItem('iframe_auth') === 'true';
      
      if (isIframeAuth) {
        console.log('[Axios Interceptor] Using iframe authentication mode for', config.url);
      }
      
      console.log('[Axios Interceptor] Found token:', token ? 'Yes' : 'No');
      
      // For iframe mode, add special header
      if (isIframeAuth) {
        config.headers['X-Display-Mode'] = 'iframe';
        console.log('[Axios Interceptor] Using iframe authentication mode for', config.url);
      }

      // Handle token expiration if needed
      if (token && tokenManager.isTokenExpired(token)) {
        try {
          console.log('[Axios Interceptor] Token expired, attempting refresh');
          token = await tokenManager.refreshToken();
        } catch (error) {
          console.error('Failed to refresh token in request interceptor:', error);
          // Don't reject here to allow request to proceed with 401, which will be handled later
        }
      }

      // Set Authorization header if we have a token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[Axios Interceptor] Authorization header set');
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
  (response) => {
    // Log successful responses for debugging
    console.log('[Axios Response]', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[Axios Response] 401 error, attempting token refresh');

      try {
        console.log('[Axios Response Interceptor] 401 error, attempting token refresh...');
        const newToken = await tokenManager.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('[Axios Response] Token refreshed, retrying request');
          return axiosInstance(originalRequest);
        } else {
          console.log('[Axios Response] Token refresh failed, redirecting to login');
          // Clear auth data and redirect to login
          tokenManager.clearAuthData();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      } catch (refreshError) {
        console.error('[Axios Response] Token refresh failed:', refreshError);
        // Clear auth data and redirect to login
        tokenManager.clearAuthData();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      console.log('[Axios Response] 403 Forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('[Axios Response] Server error:', error.response.status);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
