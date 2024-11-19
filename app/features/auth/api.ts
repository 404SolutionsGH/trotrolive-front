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

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register/passenger/`,
        userData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      // const responseHtml = JSON.stringify(data);
      // document.open();
      // document.write(responseHtml);
      // document.close();
      console.log(data);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Registration failed';
        throw new ApiError(
          error.response?.status || 500,
          message,
          error.response?.data?.errors
        );
      }
      throw new ApiError(500, 'An unexpected error occurred');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout/`,
        {},
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
