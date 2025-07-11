import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, ApiError, refreshAccessToken } from '@/app/features/auth/api';
import {
  AuthState,
  LoginCredentials,
  RegisterData,
} from '@/app/features/auth/types'; // Removed AuthResponse
import { getCsrfToken } from '@/app/features/auth/api';
import Cookies from 'js-cookie';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Cookie configuration
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'development',
  sameSite: 'lax' as const, // Fixed type assertion
  path: '/',
};

// Helper functions for token management
const setAuthTokens = (tokens: { access?: string; refresh?: string }) => {
  if (tokens.access) {
    Cookies.set('access_token', tokens.access, cookieOptions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('civic_jwt', tokens.access); // Ensure compatibility with tokenManager
    }
  }
  if (tokens.refresh) {
    Cookies.set('refresh_token', tokens.refresh, cookieOptions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  }
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('[setAuthTokens] access_token:', localStorage.getItem('access_token'));
    console.log('[setAuthTokens] refresh_token:', localStorage.getItem('refresh_token'));
  }
};

const removeAuthTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const csrfToken = await getCsrfToken();

      const response = await authApi.register(userData, csrfToken);

      if (response.tokens?.access) {
        setAuthTokens({
          access: response.tokens.access,
          refresh: response.tokens.refresh
        });
      }

      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      console.log("Login response: ", response);

      if (!response?.tokens.access) {
        throw new Error('Invalid response format from server');
      }

      // Store tokens in cookies
      setAuthTokens({
        access: response.tokens.access,
        refresh: response.tokens.refresh
      });

      // Store non-sensitive user data in localStorage if needed
      if (typeof window !== 'undefined' && credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', credentials.email);
      }

      return response.user;
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof ApiError) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          errors: error.errors,
        });
      }

      return rejectWithValue({
        message: 'Login failed. Please check your credentials and try again.',
        status: 500,
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();

      // Clear all auth-related cookies and storage
      removeAuthTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
      }

      return null;
    } catch (error) {
      console.error("Logout error: ", error);
      return rejectWithValue('Logout failed');
    }
  }
);

// Add token refresh functionality
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = Cookies.get('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await refreshAccessToken(refreshToken);

      if (response && response.access) {
        Cookies.set('access_token', response.access, cookieOptions);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Token refresh failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkAuth: (state) => {
      const accessToken = Cookies.get('access_token');
      state.isAuthenticated = !!accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, checkAuth } = authSlice.actions;
export default authSlice.reducer;
