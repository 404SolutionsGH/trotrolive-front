'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useNotificationStore } from '@/lib/notification-store';
import { NotificationApi } from '@/app/features/notifications/api';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const initAuth = async () => {
      const isValid = await checkAuth();
      
      // Handle unauthenticated access to protected routes
      if (!isValid && pathname?.startsWith('/dashboard')) {
        router.replace('/auth/login');
      }
    };

    initAuth();
  }, [checkAuth, pathname, router]);

  useEffect(() => {
    if (isAuthenticated) {
      // Set up notification polling
      const fetchNotifications = async () => {
        try {
          const notifications = await NotificationApi.fetchNotifications();
          notifications.forEach(notification => {
            if (!notification.read) {
              addNotification({
                type: notification.type,
                message: notification.message
              });
            }
          });
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };

      // Initial fetch
      fetchNotifications();

      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, addNotification]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
