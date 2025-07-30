/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trotro.live';

// Token refresh utility
class TokenManager {
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: Function; reject: Function }> = [];

  async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      // Try to get refresh token from cookies first, then localStorage
      const refreshToken = Cookies.get('refresh_token') || localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing token...');
      console.log('Base URL:', baseURL);
      console.log('Refresh token exists:', !!refreshToken);
      
      const response = await axios.post(
        `${baseURL}/accounts/api/token/refresh/`,
        { refresh: refreshToken },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true,
        }
      );

      console.log('Token refresh response:', response.data);

      if (!response.data.access) {
        throw new Error('No access token in response');
      }

      const newAccessToken = response.data.access;
      
      // Store token consistently in both places
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('civic_jwt', newAccessToken); // Keep for backward compatibility
      Cookies.set('access_token', newAccessToken, { 
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      // Process queued requests
      this.processQueue(null, newAccessToken);
      
      console.log('Token refreshed successfully');
      return newAccessToken;

    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Log more details about the error
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      
      this.clearAuthData();
      this.processQueue(error, null);
      
      // Redirect to main page instead of login (matching your app flow)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
        window.location.href = '/';
      }
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  clearAuthData() {
    // Clear from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('civic_jwt');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Clear from cookies
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
  }

  getAccessToken(): string | null {
    // Try cookies first, then localStorage
    return Cookies.get('access_token') || localStorage.getItem('access_token') || localStorage.getItem('civic_jwt');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

export const tokenManager = new TokenManager();