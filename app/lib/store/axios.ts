import Cookies from 'js-cookie';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/login/')) {
      return config;
    }

    // Retrieve Civic JWT
    const civicJwt = localStorage.getItem('civic_jwt');
    if (civicJwt) {
      config.headers.Authorization = `Bearer ${civicJwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Axios Request Config:');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);

    // Add CSRF token
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

// Response Interceptor: Handle 401 errors and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // Prevent infinite retry loops

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axiosInstance.post('/accounts/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = data.access;
        localStorage.setItem('civic_jwt', newAccessToken);

        // Retry the failed request with the new token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('civic_jwt');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
