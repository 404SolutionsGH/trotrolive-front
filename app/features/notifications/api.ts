import { Notification } from '@/lib/notification-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class NotificationApi {
  static async fetchNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_URL}/accounts/api/notifications/`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return data.map((notification: any) => ({
        id: notification.id,
        type: notification.type as 'success' | 'error' | 'info' | 'warning',
        message: notification.message,
        read: notification.read,
        createdAt: notification.created_at,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_URL}/accounts/api/notifications/${notificationId}/mark_read/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(
        `${API_URL}/accounts/api/notifications/mark_all_read/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}
