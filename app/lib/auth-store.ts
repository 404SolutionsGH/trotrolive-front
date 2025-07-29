import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '../features/auth/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  publicKey: string | null;
  access_token: string | null;
  refresh_token: string | null;
  setPublicKey: (key: string) => void;
  login: (userData: {
    user: User;
    access_token: string;
    refresh_token: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      publicKey: null,
      access_token: null,
      refresh_token: null,

      setPublicKey: (key: string) => set({ publicKey: key }),

      login: (userData: {
        user: User;
        access_token: string;
        refresh_token: string;
      }) => {
        set({
          isAuthenticated: true,
          user: userData.user,
          access_token: userData.access_token,
          refresh_token: userData.refresh_token,
        });
        // Store tokens in cookies
        if (userData.access_token) {
          Cookies.set('access_token', userData.access_token, { path: '/', expires: 7 });
        }
        if (userData.refresh_token) {
          Cookies.set('refresh_token', userData.refresh_token, { path: '/', expires: 30 });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          publicKey: null,
          access_token: null,
          refresh_token: null,
        });
        // Clear cookies
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        localStorage.removeItem('civic_jwt');
      },


    }),
    {
      name: 'auth-storage',
    }
  )
);
