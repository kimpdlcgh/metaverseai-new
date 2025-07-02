import { supabase } from '../lib/supabase';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
  expiresAt?: Date;
}

export class NotificationService {
  /**
   * Creates a new notification for a user
   */
  static async createNotification({
    userId,
    title,
    message,
    type,
    actionUrl,
    expiresAt
  }: CreateNotificationParams): Promise<string | null> {
    try {
      console.log(`Creating notification for user ${userId}:`, { title, type });
      
      const { data, error } = await supabase.rpc(
        'create_notification',
        {
          p_action_url: actionUrl || null,
          p_expires_at: expiresAt ? expiresAt.toISOString() : null,
          p_message: message,
          p_title: title,
          p_type: type,
          p_user_id: userId
        }
      );
      
      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
      
      console.log('Notification created successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }

  /**
   * Marks a notification as read
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc(
        'mark_notification_read',
        {
          p_notification_id: notificationId,
          p_user_id: userId
        }
      );
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  /**
   * Marks all notifications for a user as read
   */
  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc(
        'mark_all_notifications_read',
        {
          p_user_id: userId
        }
      );
      
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return 0;
    }
  }

  /**
   * Deletes a notification
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }

  /**
   * Gets all notifications for a user
   */
  static async getNotifications(userId: string, limit = 50, includeRead = true) {
    try {
      let query = supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (!includeRead) {
        query = query.eq('read', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  /**
   * Gets the count of unread notifications for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Creates a notification for a successful profile update
   */
  static async notifyProfileUpdated(userId: string, details?: string): Promise<void> {
    const timestamp = new Date().toLocaleTimeString();
    await this.createNotification({
      userId,
      title: 'Profile Updated',
      message: `Your profile was successfully updated at ${timestamp}${details ? `. ${details}` : ''}`,
      type: 'success',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
    });
  }

  /**
   * Creates a notification for a successful image upload
   */
  static async notifyImageUploaded(userId: string, imageType: 'avatar' | 'cover'): Promise<void> {
    const imageTypeLabel = imageType === 'avatar' ? 'profile picture' : 'cover photo';
    await this.createNotification({
      userId,
      title: `${imageType === 'avatar' ? 'Avatar' : 'Cover Photo'} Updated`,
      message: `Your ${imageTypeLabel} was successfully uploaded and saved.`,
      type: 'success',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
    });
  }

  /**
   * Creates a notification for a failed operation
   */
  static async notifyError(userId: string, operation: string, errorMessage: string): Promise<void> {
    await this.createNotification({
      userId,
      title: `Error: ${operation} Failed`,
      message: errorMessage,
      type: 'error',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Expires in 14 days
    });
  }
}