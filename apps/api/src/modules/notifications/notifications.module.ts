import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailNotificationService } from './providers/email-notification.service';
import { LineNotificationService } from './providers/line-notification.service';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    EmailNotificationService,
    LineNotificationService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
