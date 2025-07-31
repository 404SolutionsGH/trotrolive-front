import axios, { axiosInstance } from '../../lib/store/axios';
import { AxiosError } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '@/app/features/auth/types';
import Cookies from 'js-cookie';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const authApi = {
  civicAuth: async (civicToken: string, displayMode: string = 'default'): Promise<AuthResponse> => {
    try {
      // Check if we're in iframe mode
      const isIframeMode = displayMode === 'iframe';
      console.log(`[CivicAuth] Starting authentication in ${displayMode} mode`);
      
      // Clear any existing authentication state to prevent conflicts
      if (typeof window !== 'undefined') {
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        localStorage.removeItem('civic_jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('iframe_auth');
      }
      
      const payload = {
        civic_jwt: civicToken,
        display_mode: displayMode // Send display mode to backend for context
      };
      console.log('[CivicAuth] Sending payload:', { ...payload, civic_jwt: '***REDACTED***' });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });
      
      // Create the actual request promise
      const requestPromise = axiosInstance.post('accounts/api/civic-auth/', payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Explicitly set Authorization to empty to prevent any existing token from being sent
          'Authorization': '',
          // Add a custom header for iframe mode to help the server configure cookie settings
          'X-Display-Mode': displayMode
        },
        timeout: 25000, // 25 second timeout for axios
      });

      // Race between timeout and request
      const response = await Promise.race([requestPromise, timeoutPromise]) as any;
      
      console.log('[CivicAuth] Backend response received:', {
        status: response.status,
        hasTokens: !!response.data.access_token,
        hasUser: !!response.data.user,
        displayMode: response.data.display_mode
      });
      
      if (response.data.access_token && response.data.user) {
        // Store tokens immediately with special handling for iframe mode
        if (isIframeMode) {
          // For iframe mode, use a special flag to indicate iframe authentication
          localStorage.setItem('iframe_auth', 'true');
          localStorage.setItem('iframe_auth_timestamp', Date.now().toString());
        }
        
        // Always store tokens in both localStorage and cookies for redundancy
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('civic_jwt', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set cookies with SameSite attributes appropriate for iframe use
        Cookies.set('access_token', response.data.access_token, {
          path: '/',
          sameSite: isIframeMode ? 'none' : 'lax',
          secure: true,
          expires: 1 // 1 day
        });
        
        Cookies.set('refresh_token', response.data.refresh_token, {
          path: '/',
          sameSite: isIframeMode ? 'none' : 'lax',
          secure: true,
          expires: 7 // 7 days
        });
        
        // Force all axios instances to use the new token
        if (axios.defaults.headers) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        }
        
        // Also set the token on our configured axiosInstance
        if (axiosInstance.defaults.headers) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        }
        
        console.log('[CivicAuth] Authentication successful, tokens stored');
      } else {
        console.error('[CivicAuth] Invalid response format:', response.data);
        throw new Error('Invalid response format from authentication server');
      }

      return response.data;
    } catch (error) {
      console.error('[CivicAuth] Authentication failed:', error);
      
      if (error instanceof AxiosError) {
        console.error('[CivicAuth] Backend error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.detail ||
                           error.response?.data?.error ||
                           error.message ||
                           'Civic authentication failed';

        throw new ApiError(
          error.response?.status || 500,
          typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
        );
      } else if (error instanceof Error && error.message === 'Request timeout') {
        console.error('[CivicAuth] Request timed out');
        throw new ApiError(408, 'Authentication request timed out. Please try again.');
      } else {
        console.error('[CivicAuth] Unexpected error:', error);
        throw new ApiError(500, 'An unexpected error occurred during Civic authentication');
      }
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/accounts/api/login/', credentials, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });

      const user = localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('User Details: ', user);
      console.log('Login API response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login failed:', error.response?.data || error.message);
      } else {
        console.error('Login failed:', error);
      }
      throw error;
    }
  },

  register: async (userData: RegisterData, csrfToken: string): Promise<AuthResponse> => {
    try {

      const payload = {
        user: {
          full_name: userData.full_name.trim(),
          email: userData.email.trim().toLowerCase(),
          phone: userData.phone,
          password: userData.password
        }
      };

      console.log('Registration payload:', payload);

      const response = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/api/register/passenger/`,
        payload, // Send the nested structure
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Registration response:', response.data);
      return response.data;

    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Registration error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        // Extract error message from various possible formats
        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.detail ||
                           error.response?.data?.error ||
                           Object.values(error.response?.data || {})[0] ||
                           'Registration failed';

        throw new ApiError(
          error.response?.status || 500,
          typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
        );
      }
      throw new ApiError(500, 'An unexpected error occurred during registration');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const csrfToken = await getCsrfToken(); // Await the CSRF token
      console.log('Initiating logout...');
      const response = await axiosInstance.post(
        '/accounts/api/logout/',
        {}, // Body (optional, empty here)
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken || '', // Ensure the token is sent
          },
        }
      );
      console.log('Logout successful:', response.data);

      // Clear auth-related cookies or tokens
      if (typeof window !== 'undefined') {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      }
    } catch (error) {
      // Log detailed error information
      if (error instanceof AxiosError) {
        console.error('Logout failed:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error('Logout failed:', error);
      }
      alert('Logout failed. Please try again.');
    } finally {
      // Additional cleanup
      if (typeof window !== 'undefined') {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      }
    }
  },

};

export const refreshAccessToken = async (refreshToken: string): Promise<{ access: string } | null> => {
  try {
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    console.log('Refreshing token using axiosInstance...');
    const response = await axiosInstance.post('/accounts/api/token/refresh/',
      { refresh: refreshToken },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const data = response.data;
    if (data.access) {
      localStorage.setItem('access_token', data.access); // Save the new access token
      return { access: data.access };
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export async function getCsrfToken() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/csrf/`, {
      withCredentials: true,
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
}