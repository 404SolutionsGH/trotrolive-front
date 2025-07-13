/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trotro.live/';

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
      const refreshToken = localStorage.getItem('refresh_token') || Cookies.get('refresh_token');
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
      Cookies.set('access_token', newAccessToken, { path: '/' });

      // Process queued requests
      this.processQueue(null, newAccessToken);
      
      console.log('Token refreshed successfully');
      return newAccessToken;

    } catch (error) {
      console.error('Token refresh failed:', error);

      // Only clear auth if error is 401 or 403
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 403) {
        this.clearAuthData();
      }

      this.processQueue(error, null);
      
      // Avoid redirecting unless explicitly required
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
    // Check if we're in iframe mode before clearing
    const isIframeAuth = localStorage.getItem('iframe_auth') === 'true';
    
    if (isIframeAuth) {
      console.log('[TokenManager] Preserving iframe auth context during clear');
      // Store the iframe auth flag temporarily
      const hasIframeAuth = localStorage.getItem('iframe_auth');
      const iframeAuthTimestamp = localStorage.getItem('iframe_auth_timestamp');
      
      // Clear localStorage but preserve special flags
      localStorage.removeItem('civic_jwt');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('notification-storage');
      
      // Restore iframe auth flags
      if (hasIframeAuth) {
        localStorage.setItem('iframe_auth', hasIframeAuth);
      }
      if (iframeAuthTimestamp) {
        localStorage.setItem('iframe_auth_timestamp', iframeAuthTimestamp);
      }
      
      // For iframe mode, we don't remove cookies as they may be needed for cross-domain communication
      console.log('[TokenManager] Preserved iframe auth context during clear');
    } else {
      // Regular clear for non-iframe mode
      // Clear localStorage
      localStorage.removeItem('civic_jwt');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('notification-storage');
      localStorage.removeItem('iframe_auth');
      localStorage.removeItem('iframe_auth_timestamp');
      
      // Clear cookies with specific path and domain settings to ensure complete removal
      Cookies.remove('access_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      Cookies.remove('csrftoken', { path: '/' });
      
      console.log('[TokenManager] Auth data cleared completely');
    }
  }

  getAccessToken(): string | null {
    // Check all possible storage locations to avoid inconsistencies
    // Start with cookies (set by server)
    const cookieToken = Cookies.get('access_token');
    
    // Then check localStorage (set by client)
    const localJwtToken = localStorage.getItem('civic_jwt');
    const localAccessToken = localStorage.getItem('access_token');
    
    // Check if we're in iframe mode
    const isIframeAuth = localStorage.getItem('iframe_auth') === 'true';
    if (isIframeAuth) {
      console.log('[TokenManager] Using iframe auth context for token retrieval');
    }
    
    // Return first available token
    const token = cookieToken || localAccessToken || localJwtToken || null;
    console.log('[TokenManager] Token found:', token ? 'Yes' : 'No');
    return token;
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