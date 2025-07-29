import Cookies from 'js-cookie';
import axios from 'axios';
import { tokenManager } from './manager'; // Import the token manager

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trotro.live/';

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
    console.log('Axios Request:', config.method?.toUpperCase(), config.url);
    const authSkipEndpoints = ['/civic-login/', '/auth/login/', '/register/', '/token/refresh/', '/accounts/api/civic-auth/'];
    const shouldSkipAuth = authSkipEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Check if we're in iframe authentication mode
    const isIframeAuth = typeof window !== 'undefined' && localStorage.getItem('iframe_auth') === 'true';
    
    // For Civic auth endpoint, explicitly remove any Authorization header to prevent conflicts
    if (config.url?.includes('/accounts/api/civic-auth/')) {
      delete config.headers.Authorization;
      console.log('[Axios Interceptor] Authorization header removed for Civic auth endpoint');
      
      // If we have display mode info in the URL, add it as a header
      const urlParams = new URLSearchParams(window.location.search);
      const stateParam = urlParams.get('state');
      if (stateParam) {
        try {
          const decodedState = JSON.parse(atob(stateParam));
          const displayMode = decodedState.displayMode;
          if (displayMode) {
            config.headers['X-Display-Mode'] = displayMode;
            console.log(`[Axios Interceptor] Added display mode header: ${displayMode}`);
          }
        } catch (e) {
          console.error('[Axios Interceptor] Failed to parse state parameter:', e);
        }
      }
    }
    // Special handling for protected endpoints in any mode
    else if (!shouldSkipAuth) {
      // Comprehensive token gathering from all possible storage locations
      let token = null;
      
      // Check every possible token location in order of preference
      if (typeof window !== 'undefined') {
        // Try cookie first (server-set tokens)
        token = Cookies.get('access_token');
        
        // If no token in cookie, try localStorage (multiple options)
        if (!token) {
          token = localStorage.getItem('access_token') ||
                 localStorage.getItem('civic_jwt');
        }
        
        console.log('[Axios Interceptor] Found token:', token ? 'Yes' : 'No');
        
        // For iframe mode, add special header
        if (isIframeAuth) {
          config.headers['X-Display-Mode'] = 'iframe';
          console.log('[Axios Interceptor] Using iframe authentication mode for', config.url);
        }
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

// Response Interceptor with improved error handling
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
