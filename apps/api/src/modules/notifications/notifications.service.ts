import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  Notification,
  NotificationChannel,
  NotificationStatus,
  UserProfile,
} from '@prisma/client';
import { MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotificationQueryDto,
  SendNotificationDto,
  SendTemplateNotificationDto,
  UpdateNotificationPreferencesDto,
} from './dto/notification.dto';
import { EmailNotificationService } from './providers/email-notification.service';
import { LineNotificationService } from './providers/line-notification.service';
import { NOTIFICATION_TEMPLATES } from './notification.templates';

export interface NotificationResult {
  success: number;
  failed: number;
  created: number;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly userStreams = new Map<string, Subject<MessageEvent>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailNotificationService,
    private readonly lineService: LineNotificationService
  ) {}

  async sendNotification(
    sendDto: SendNotificationDto
  ): Promise<NotificationResult> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: sendDto.userIds }, isActive: true },
      include: { profile: true },
    });

    const profilesByUserId = new Map(
      users.map((user) => [user.id, user.profile])
    );

    let success = 0;
    let failed = 0;
    let created = 0;

    for (const user of users) {
      const userId = user.id;
      for (const channel of sendDto.channels) {
        const profile = profilesByUserId.get(userId) || null;

        if (!this.isChannelEnabled(channel, profile)) {
          continue;
        }

        const notification = await this.prisma.notification.create({
          data: {
            userId,
            channel,
            title: sendDto.title,
            message: sendDto.message,
            data: sendDto.data,
          },
        });
        created += 1;

        const delivered = await this.dispatchNotification(
          notification,
          profile
        );
        if (delivered) {
          success += 1;
        } else {
          failed += 1;
        }
      }
    }

    return { success, failed, created };
  }

  async sendTemplateNotification(
    templateDto: SendTemplateNotificationDto
  ): Promise<NotificationResult> {
    const template = NOTIFICATION_TEMPLATES[templateDto.template];

    if (!template) {
      throw new NotFoundException(
        `Notification template ${templateDto.template} not found`
      );
    }

    const variables = templateDto.variables || {};
    const title = this.renderTemplateString(template.title, variables);
    const message = this.renderTemplateString(template.message, variables);

    return this.sendNotification({
      userIds: [templateDto.userId],
      channels: templateDto.channels || template.defaultChannels,
      title,
      message,
      data: {
        template: template.key,
        ...variables,
      },
    });
  }

  async getMyNotifications(userId: string, query: NotificationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const channels = this.normalizeEnumList(
      query.channels,
      NotificationChannel
    );
    const statuses = this.normalizeEnumList(query.statuses, NotificationStatus);

    const where = {
      userId,
      ...(channels.length ? { channel: { in: channels } } : {}),
      ...(statuses.length ? { status: { in: statuses } } : {}),
      ...(query.unreadOnly ? { readAt: null } : {}),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
        channel: NotificationChannel.IN_APP,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        readAt: new Date(),
      },
    });

    await this.publishUnreadCount(userId);
    return updated;
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    await this.publishUnreadCount(userId);
    return result;
  }

  async getPreferences(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return {
        emailNotifications: true,
        smsNotifications: false,
        lineNotifications: true,
        inAppNotifications: true,
      };
    }

    return {
      emailNotifications: profile.emailNotifications,
      smsNotifications: profile.smsNotifications,
      lineNotifications: profile.lineNotifications,
      inAppNotifications: profile.inAppNotifications,
    };
  }

  async updatePreferences(
    userId: string,
    updateDto: UpdateNotificationPreferencesDto
  ) {
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: updateDto,
      create: {
        userId,
        ...updateDto,
      },
    });

    return {
      emailNotifications: profile.emailNotifications,
      smsNotifications: profile.smsNotifications,
      lineNotifications: profile.lineNotifications,
      inAppNotifications: profile.inAppNotifications,
    };
  }

  subscribeToUserNotifications(userId: string): Observable<MessageEvent> {
    if (!this.userStreams.has(userId)) {
      this.userStreams.set(userId, new Subject<MessageEvent>());
    }

    return this.userStreams.get(userId)!.asObservable();
  }

  async publishUnreadCount(userId: string) {
    const unreadCount = await this.getUnreadCount(userId);
    this.publishToUser(userId, {
      type: 'unread_count',
      unreadCount,
    });
  }

  private async dispatchNotification(
    notification: Notification,
    profile: UserProfile | null
  ): Promise<boolean> {
    let delivered = false;

    if (notification.channel === NotificationChannel.IN_APP) {
      delivered = true;
      this.publishToUser(notification.userId, {
        type: 'new_notification',
        notification,
      });
    }

    if (notification.channel === NotificationChannel.EMAIL) {
      const user = await this.prisma.user.findUnique({
        where: { id: notification.userId },
        select: { email: true },
      });
      if (user?.email) {
        delivered = await this.emailService.sendEmail(
          user.email,
          notification.title,
          notification.message
        );
      }
    }

    if (notification.channel === NotificationChannel.LINE) {
      const lineUserId = this.extractLineUserId(notification, profile);
      if (lineUserId) {
        delivered = await this.lineService.pushMessage(
          lineUserId,
          notification.message
        );
      } else {
        this.logger.warn(
          `LINE notification skipped for user ${notification.userId}: missing lineUserId`
        );
      }
    }

    if (notification.channel === NotificationChannel.SMS) {
      this.logger.warn(
        'SMS channel is not configured yet, notification marked as failed'
      );
      delivered = false;
    }

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: delivered
          ? NotificationStatus.DELIVERED
          : NotificationStatus.FAILED,
        sentAt: new Date(),
        deliveredAt: delivered ? new Date() : null,
        retryCount: delivered
          ? notification.retryCount
          : notification.retryCount + 1,
      },
    });

    if (notification.channel === NotificationChannel.IN_APP) {
      await this.publishUnreadCount(notification.userId);
    }

    return delivered;
  }

  private extractLineUserId(
    notification: Notification,
    profile: UserProfile | null
  ): string | null {
    const lineFromData = (notification.data as any)?.lineUserId;
    if (typeof lineFromData === 'string' && lineFromData.trim().length > 0) {
      return lineFromData;
    }

    const lineFromProfile = (profile as any)?.lineUserId;
    if (
      typeof lineFromProfile === 'string' &&
      lineFromProfile.trim().length > 0
    ) {
      return lineFromProfile;
    }

    return null;
  }

  private publishToUser(userId: string, payload: Record<string, any>) {
    const stream = this.userStreams.get(userId);
    if (!stream) {
      return;
    }

    stream.next({
      data: payload,
    });
  }

  private isChannelEnabled(
    channel: NotificationChannel,
    profile: UserProfile | null
  ): boolean {
    if (!profile) {
      return channel !== NotificationChannel.SMS;
    }

    if (channel === NotificationChannel.EMAIL) {
      return profile.emailNotifications;
    }

    if (channel === NotificationChannel.SMS) {
      return profile.smsNotifications;
    }

    if (channel === NotificationChannel.LINE) {
      return profile.lineNotifications;
    }

    if (channel === NotificationChannel.IN_APP) {
      return profile.inAppNotifications;
    }

    return true;
  }

  private renderTemplateString(
    template: string,
    variables: Record<string, any>
  ): string {
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_m, key: string) => {
      const value = variables[key];
      if (value === null || value === undefined) {
        return '';
      }
      return String(value);
    });
  }

  private normalizeEnumList<T extends string>(
    value: any,
    enumObject: Record<string, T>
  ): T[] {
    if (!value) {
      return [];
    }

    const enumValues = new Set(Object.values(enumObject));
    const values = Array.isArray(value)
      ? value.flatMap((item) => String(item).split(','))
      : String(value).split(',');

    return values
      .map((item) => item.trim())
      .filter((item): item is T => enumValues.has(item as T));
  }
}
