/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing token...');
      
      const response = await axios.post(
        `${baseURL}/accounts/api/token/refresh/`,
        { refresh: refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const newAccessToken = response.data.access;
      localStorage.setItem('civic_jwt', newAccessToken);

      // Process queued requests
      this.processQueue(null, newAccessToken);
      
      console.log('Token refreshed successfully');
      return newAccessToken;

    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      this.processQueue(error, null);
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
        window.location.href = '/auth/login';
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
    localStorage.removeItem('civic_jwt');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('civic_jwt');
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