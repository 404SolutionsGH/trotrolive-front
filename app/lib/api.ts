import axios from './axios';
import { AxiosError } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '@/app/types/auth';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>('/accounts/login', credentials);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Login failed';
        throw new ApiError(error.response?.status || 500, message);
      }
      throw new ApiError(500, 'An unexpected error occurred');
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>('/accounts/register', userData);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Registration failed';
        throw new ApiError(error.response?.status || 500, message);
      }
      throw new ApiError(500, 'An unexpected error occurred');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }
};
