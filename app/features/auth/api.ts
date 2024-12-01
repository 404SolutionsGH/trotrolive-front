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
      // Make sure to remove any stale tokens before login

      const response = await axiosInstance.post('/accounts/api/login/', credentials, {
        withCredentials: true,  // Ensure cookies are included with this specific request
        headers: {
          'Accept': 'application/json',
          // 'X-XSRF-TOKEN': getCookie('csrftoken'),  // If using CSRF protection
        }
      });

      const user = localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log("User Details: ", user);
      // localStorage.setItem('refresh_token', response.data.tokens.refresh);

      console.log('Login API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },
//   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
//     // Ensure CSRF token exists in cookies
//     const csrfToken_top = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
//     console.log('CSRF Token: ', csrfToken_top);
//     // csrfToken = csrfToken.split('=')[1];

//     if (!csrfToken_top) {
//       throw new ApiError(400, 'CSRF token missing');
//     }
//     const token = csrfToken_top.split('=')[1];
//     console.log('CSRF Token Split: ', token);

//     try {
//       const { data } = await axios.post<AuthResponse>(
//         `${process.env.NEXT_PUBLIC_API_URL}/accounts/api/login/`,
//         credentials,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': token,
//           },
//           withCredentials: true, // Ensure credentials are sent with the request
//         }
//       );

//       localStorage.setItem('access_token', data.tokens?.access);
//       localStorage.setItem('refresh_token', data.tokens?.refresh);

//       console.log('Login response: ', data);
//       return data;

//     } catch (error) {
//       if (error instanceof AxiosError) {
//         const message = error.response?.data?.message || 'Login failed';
//         throw new ApiError(
//           error.response?.status || 500,
//           message,
//           error.response?.data?.errors
//         );
//       }
//       throw new ApiError(500, 'An unexpected error occurred');
//     }
//   },


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
    const csrfToken = getCsrfToken(); // Fetch the CSRF token
    try {
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
      console.error('Logout failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
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

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token'); // Assuming you store the token in localStorage
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
      localStorage.setItem('access_token', data.access); // Save the new access token
      return data.access;
    }

    throw new Error('Access token missing in refresh response');
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};



export async function getCsrfToken() {
  const response = await axios.get('/accounts/api/get-csrf-token/'); // Request CSRF token from backend
  const csrfToken = response.data.csrfToken;
  console.log('CSRF Token from server:', csrfToken);
  return csrfToken;
}