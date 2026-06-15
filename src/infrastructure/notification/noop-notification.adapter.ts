import { Injectable, Logger } from '@nestjs/common';
import {
  ContactNotificationPayload,
  INotificationPort,
} from '@application/ports/notification.port';

@Injectable()
export class NoopNotificationAdapter implements INotificationPort {
  private readonly logger = new Logger(NoopNotificationAdapter.name);

  async sendContactNotification(
    payload: ContactNotificationPayload,
  ): Promise<void> {
    this.logger.debug(
      `Contact notification skipped (no SMTP): ${payload.email}`,
    );
  }
}
