import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  full_name: string;
  email: string;
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
  logout: () => void;
  checkAuth: () => boolean;
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
        // Store tokens in cookies
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

        // Store user in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }

        set({ 
          user, 
          isAuthenticated: true, 
          error: null,
          isLoading: false 
        });
      },

      logout: () => {
        // Clear tokens
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        Cookies.remove('csrftoken', { path: '/' });

        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('civic_jwt');
          localStorage.removeItem('refresh_token');
        }

        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null,
          publicKey: null,
          isLoading: false 
        });
      },

      checkAuth: () => {
        const accessToken = Cookies.get('access_token');
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (accessToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({ 
              user, 
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          } catch (error) {
            console.error('Error parsing stored user:', error);
            get().logout();
            return false;
          }
        } else {
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
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