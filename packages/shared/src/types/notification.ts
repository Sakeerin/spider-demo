// Notification-related types and interfaces

import { NotificationChannel, NotificationStatus } from './common';

export interface INotification {
  id: string;
  userId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  message: string;
  data?: Record<string, any>;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationWithUser extends INotification {
  user: {
    id: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
}

// Notification creation and update DTOs
export interface CreateNotificationDto {
  userId: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, any>;
  maxRetries?: number;
}

export interface SendNotificationDto {
  userIds: string[];
  channels: NotificationChannel[];
  title: string;
  message: string;
  data?: Record<string, any>;
  scheduleAt?: Date;
}

export interface UpdateNotificationDto {
  status?: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  retryCount?: number;
}

// Notification templates
export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  variables: string[];
  isActive: boolean;
}

export interface NotificationTemplateData {
  template: string;
  variables: Record<string, any>;
  userId: string;
  channels?: NotificationChannel[];
}

// Notification preferences
export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lineNotifications: boolean;
  inAppNotifications: boolean;
  leadNotifications: boolean;
  jobNotifications: boolean;
  milestoneNotifications: boolean;
  reviewNotifications: boolean;
  marketingNotifications: boolean;
}

// Notification search and filtering
export interface NotificationSearchFilters {
  userId?: string;
  channel?: NotificationChannel[];
  status?: NotificationStatus[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface NotificationSearchResult {
  notifications: INotificationWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Notification statistics
export interface NotificationStatistics {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  channelBreakdown: Record<NotificationChannel, {
    sent: number;
    delivered: number;
    failed: number;
    rate: number;
  }>;
}