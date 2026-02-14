import {
  INotification,
  NotificationSearchResult,
} from '@spider/shared/types/notification';
import { NotificationChannel } from '@spider/shared/types/common';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface NotificationPreferencesDto {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  lineNotifications?: boolean;
  inAppNotifications?: boolean;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  channels?: NotificationChannel[];
  unreadOnly?: boolean;
}

export const notificationsApi = {
  async getMyNotifications(
    token: string,
    filters: NotificationFilters = {}
  ): Promise<NotificationSearchResult> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.channels?.length)
      params.append('channels', filters.channels.join(','));
    if (filters.unreadOnly) params.append('unreadOnly', 'true');

    const response = await fetch(
      `${API_URL}/notifications/my?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async getUnreadCount(token: string): Promise<number> {
    const response = await fetch(`${API_URL}/notifications/my/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    const data = await response.json();
    return data.unreadCount || 0;
  },

  async markAsRead(
    token: string,
    notificationId: string
  ): Promise<INotification> {
    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllAsRead(token: string): Promise<{ count: number }> {
    const response = await fetch(`${API_URL}/notifications/my/read-all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },

  async getPreferences(token: string): Promise<NotificationPreferencesDto> {
    const response = await fetch(`${API_URL}/notifications/preferences`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    return response.json();
  },

  async updatePreferences(
    token: string,
    data: NotificationPreferencesDto
  ): Promise<NotificationPreferencesDto> {
    const response = await fetch(`${API_URL}/notifications/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }

    return response.json();
  },
};
