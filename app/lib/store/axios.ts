import Cookies from 'js-cookie';
import axios from 'axios';
import { tokenManager } from './manager'; // Import the token manager

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trotro.live/';

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
    const authSkipEndpoints = ['/civic-login/', '/auth/login/', '/register/', '/token/refresh/'];
    const shouldSkipAuth = authSkipEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (!shouldSkipAuth) {
      // Try both 'civic_jwt' and 'access_token' for robustness
      let token = tokenManager.getAccessToken();
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('access_token');
      }
      console.log('[Axios Interceptor] Using token:', token);

      if (token && tokenManager.isTokenExpired(token)) {
        try {
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


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
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
//   withCredentials: true, // Include cookies in requests
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (config.url?.includes('/auth/login/')) {
//       return config;
//     }

//     // Retrieve Civic JWT
//     const civicJwt = localStorage.getItem('civic_jwt');
//     if (civicJwt) {
//       config.headers.Authorization = `Bearer ${civicJwt}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('Axios Request Config:');
//     console.log('URL:', config.url);
//     console.log('Method:', config.method);
//     console.log('Headers:', config.headers);

//     // Add CSRF token
//     const csrfToken = Cookies.get('csrftoken');
//     if (csrfToken) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }

//     return config;
//   },
//   (error) => {
//     console.error('Axios Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor: Handle 401 errors and refresh tokens
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true; // Prevent infinite retry loops

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) throw new Error('No refresh token available');

//         const { data } = await axiosInstance.post('/accounts/api/token/refresh/', {
//           refresh: refreshToken,
//         });

//         const newAccessToken = data.access;
//         localStorage.setItem('civic_jwt', newAccessToken);

//         // Retry the failed request with the new token
//         error.config.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(error.config);
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
//         localStorage.removeItem('civic_jwt');
//         localStorage.removeItem('refresh_token');
//         window.location.href = '/auth/login'; // Redirect to login
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
