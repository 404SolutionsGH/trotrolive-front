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
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('accounts/api/civic-login/', credentials, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });

      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('User Details: ', response.data.user);
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

  // New Civic login function
  civicLogin: async (civicToken: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('accounts/api/civic-login/', {
        civic_token: civicToken,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Civic login API response:', response.data);
      
      // Store user data if present
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Civic login failed:', error.response?.data || error.message);
        
        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.detail ||
                           error.response?.data?.error ||
                           'Civic authentication failed';

        throw new ApiError(
          error.response?.status || 500,
          typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
        );
      } else {
        console.error('Civic login failed:', error);
      }
      throw new ApiError(500, 'An unexpected error occurred during Civic authentication');
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
        payload,
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
      const csrfToken = await getCsrfToken();
      console.log('Initiating logout...');
      const response = await axiosInstance.post(
        '/accounts/api/logout/',
        {},
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken || '',
          },
        }
      );
      console.log('Logout successful:', response.data);

      if (typeof window !== 'undefined') {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('user');
      }
    } catch (error) {
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
      if (typeof window !== 'undefined') {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('user');
      }
    }
  },
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ access: string } | null> => {
  try {
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await fetch('http://localhost:8000/accounts/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      return { access: data.access };
    }

    throw new Error('Access token missing in refresh response');
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export async function getCsrfToken() {
  const response = await axios.get('/accounts/api/get-csrf-token/');
  const csrfToken = response.data.csrfToken;
  console.log('CSRF Token from server:', csrfToken);
  return csrfToken;
}