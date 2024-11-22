import axios from '../../lib/store/axios';
import { AxiosError } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '@/app/features/auth/types';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login/`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Login failed';
        throw new ApiError(
          error.response?.status || 500,
          message,
          error.response?.data?.errors
        );
      }
      throw new ApiError(500, 'An unexpected error occurred');
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/register/passenger/`,
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout/`,
        null,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  },
};

// function getCsrfToken() {
//   const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
//   return csrfCookie ? csrfCookie.split('=')[1] : '';
// }


export async function getCsrfToken() {
  const response = await axios.get('api/get-csrf-token/'); // Request CSRF token from backend
  const csrfToken = response.data.csrfToken;
  console.log('CSRF Token from server:', csrfToken);
  return csrfToken;
}