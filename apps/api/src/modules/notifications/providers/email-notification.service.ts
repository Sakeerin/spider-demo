import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(
    recipient: string,
    subject: string,
    body: string
  ): Promise<boolean> {
    const emailWebhookUrl = this.configService.get<string>('EMAIL_WEBHOOK_URL');

    if (!emailWebhookUrl) {
      this.logger.log(
        `Email provider not configured. Simulated email to ${recipient}: ${subject}`
      );
      return true;
    }

    try {
      const response = await fetch(emailWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipient,
          subject,
          body,
        }),
      });

      if (!response.ok) {
        this.logger.warn(
          `Email provider returned ${response.status} for ${recipient}`
        );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Email send failed for ${recipient}`,
        error instanceof Error ? error.stack : String(error)
      );
      return false;
    }
  }
}
