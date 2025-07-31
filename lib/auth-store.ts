import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { useNotificationStore } from './notification-store';

interface User {
  id: string;
  full_name: string;
  email: string;
  web3_address?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  publicKey: string | null;
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPublicKey: (publicKey: string | null) => void;
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      publicKey: null,

      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setPublicKey: (publicKey) => set({ publicKey }),

      login: (user, tokens) => {
        // Store tokens in cookies with secure settings
        Cookies.set('access_token', tokens.access, { 
          expires: 7, 
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        Cookies.set('refresh_token', tokens.refresh, { 
          expires: 7, 
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        // Store user in state
        set({ 
          user, 
          isAuthenticated: true, 
          error: null,
          isLoading: false 
        });
      },

      logout: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/logout/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Logout failed');
          }
        } catch (error) {
          console.error('Logout error (likely CORS issue):', error);
          // Continue with local logout even if API call fails
        } finally {
          // Clear tokens
          Cookies.remove('access_token', { path: '/' });
          Cookies.remove('refresh_token', { path: '/' });
          Cookies.remove('csrftoken', { path: '/' });

          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('notification-storage');
          }

          // Clear state
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null,
            publicKey: null,
            isLoading: false 
          });

          // Clear notifications
          useNotificationStore.getState().clearAll();

          // Force reload to clear any cached data
          window.location.href = '/';
        }
      },

      checkAuth: async () => {
        const accessToken = Cookies.get('access_token');
        
        if (!accessToken) {
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          return false;
        }

        try {
          // Verify token with backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/protected/`, {
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Token invalid');
          }

          const data = await response.json();
          
          if (data.user) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          }
          
          throw new Error('No user data');
        } catch (error) {
          console.error('Auth check failed (likely CORS issue):', error);
          // Don't automatically logout on CORS errors, let user handle it
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        publicKey: state.publicKey
      }),
    }
  )
);
