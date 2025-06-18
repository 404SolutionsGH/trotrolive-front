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
  civicAuth: async (civicToken: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('accounts/api/civic-auth/', {
        civic_token: civicToken,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Civic authentication failed:', error.response?.data || error.message);
        
        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.detail ||
                           error.response?.data?.error ||
                           'Civic authentication failed';

        throw new ApiError(
          error.response?.status || 500,
          typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
        );
      } else {
        console.error('Civic authentication failed:', error);
      }
      throw new ApiError(500, 'An unexpected error occurred during Civic authentication');
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