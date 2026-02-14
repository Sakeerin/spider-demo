import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Patch,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable, startWith } from 'rxjs';
import { UserRole } from '@spider/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  NotificationQueryDto,
  SendNotificationDto,
  SendTemplateNotificationDto,
  UpdateNotificationPreferencesDto,
} from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.SALES)
  async send(@Body() sendDto: SendNotificationDto) {
    return this.notificationsService.sendNotification(sendDto);
  }

  @Post('send-template')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.SALES)
  async sendTemplate(@Body() templateDto: SendTemplateNotificationDto) {
    return this.notificationsService.sendTemplateNotification(templateDto);
  }

  @Get('my')
  async getMyNotifications(
    @CurrentUser() user: any,
    @Query() query: NotificationQueryDto
  ) {
    return this.notificationsService.getMyNotifications(
      this.getUserId(user),
      query
    );
  }

  @Get('my/unread-count')
  async getMyUnreadCount(@CurrentUser() user: any) {
    const unreadCount = await this.notificationsService.getUnreadCount(
      this.getUserId(user)
    );
    return { unreadCount };
  }

  @Patch(':notificationId/read')
  async markAsRead(
    @CurrentUser() user: any,
    @Param('notificationId') notificationId: string
  ) {
    return this.notificationsService.markAsRead(
      notificationId,
      this.getUserId(user)
    );
  }

  @Patch('my/read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(this.getUserId(user));
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: any) {
    return this.notificationsService.getPreferences(this.getUserId(user));
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateNotificationPreferencesDto
  ) {
    return this.notificationsService.updatePreferences(
      this.getUserId(user),
      updateDto
    );
  }

  @Sse('stream')
  streamMyNotifications(@CurrentUser() user: any): Observable<MessageEvent> {
    const userId = this.getUserId(user);

    return this.notificationsService.subscribeToUserNotifications(userId).pipe(
      startWith({
        data: {
          type: 'connected',
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  private getUserId(user: any): string {
    return user?.id || user?.sub || user?.userId;
  }
}
