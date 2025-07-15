import { Notification } from '@/lib/notification-store';
import { axiosInstance } from '../../../lib/store/axios';

export class NotificationApi {
  static async fetchNotifications(): Promise<Notification[]> {
    try {
      const response = await axiosInstance.get('/accounts/api/notifications/');
      
      console.log('Notifications response:', response);
      
      const data = response.data.notifications || [];
      return data.map((notification: { id: string; type: string; message: string; read: boolean; created_at: string }) => ({
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
      const response = await axiosInstance.post(
        `/accounts/api/notifications/${notificationId}/mark_read/`
      );
      
      console.log('Mark as read response:', response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      const response = await axiosInstance.post(
        '/accounts/api/notifications/mark_all_read/'
      );
      
      console.log('Mark all read response:', response);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}
