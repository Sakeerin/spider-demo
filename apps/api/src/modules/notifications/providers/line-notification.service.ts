import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LineNotificationService {
  private readonly logger = new Logger(LineNotificationService.name);

  constructor(private readonly configService: ConfigService) {}

  async pushMessage(lineUserId: string, message: string): Promise<boolean> {
    const lineApiUrl = 'https://api.line.me/v2/bot/message/push';
    const accessToken = this.configService.get<string>(
      'LINE_CHANNEL_ACCESS_TOKEN'
    );

    if (!accessToken) {
      this.logger.log(
        `LINE OA token not configured. Simulated LINE message to ${lineUserId}: ${message}`
      );
      return true;
    }

    try {
      const response = await fetch(lineApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: lineUserId,
          messages: [{ type: 'text', text: message }],
        }),
      });

      if (!response.ok) {
        this.logger.warn(
          `LINE OA returned ${response.status} for user ${lineUserId}`
        );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `LINE OA request failed for user ${lineUserId}`,
        error instanceof Error ? error.stack : String(error)
      );
      return false;
    }
  }
}
