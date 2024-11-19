import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, ApiError } from '@/app/features/auth/api';
import {
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '@/app/features/auth/types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  process.env.NEXT_PUBLIC_API_URL + 'api/register/passenger/',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.tokens?.access_token || '');
        localStorage.setItem('refresh_token', response.tokens?.refresh_token || '');
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
  process.env.NEXT_PUBLIC_API_URL + 'api/login/',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.tokens.access);
        localStorage.setItem('refresh_token', response.tokens.refresh);

        const rememberMe = localStorage.getItem('rememberMe');
        if (rememberMe === 'true') {
          localStorage.setItem('phone_number', credentials.phone_number);
        }
      }

      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  process.env.NEXT_PUBLIC_API_URL + 'api/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
      console.log("Error: ", error);
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
        state.user  = action.payload || un;
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('phone_number');
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
