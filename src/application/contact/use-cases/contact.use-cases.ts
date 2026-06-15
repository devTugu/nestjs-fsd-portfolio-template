import { Inject, Injectable } from '@nestjs/common';
import { Email } from '@domain/value-objects/email.vo';
import { IContactMessageRepository } from '@domain/contact/repositories/contact-message.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { INotificationPort } from '@application/ports/notification.port';
import {
  ContactMessageOutput,
  toContactMessageOutput,
} from '../dto/contact-message-output.mapper';
import {
  CONTACT_MESSAGE_REPOSITORY,
  NOTIFICATION_PORT,
} from '@shared/constants/tokens';

@Injectable()
export class SubmitContactMessageUseCase {
  constructor(
    @Inject(CONTACT_MESSAGE_REPOSITORY)
    private readonly messages: IContactMessageRepository,
    @Inject(NOTIFICATION_PORT)
    private readonly notifications: INotificationPort,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    website?: string;
    ipAddress?: string | null;
  }): Promise<ContactMessageOutput> {
    if (input.website) {
      throw AppErrors.BAD_REQUEST('Invalid submission.');
    }
    if (input.message.length < 10) {
      throw AppErrors.BAD_REQUEST('Message must be at least 10 characters.');
    }
    Email.create(input.email);

    const saved = await this.messages.create({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      ipAddress: input.ipAddress,
    });

    void this.notifications.sendContactNotification({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    });

    return toContactMessageOutput(saved);
  }
}

@Injectable()
export class ListContactMessagesUseCase {
  constructor(
    @Inject(CONTACT_MESSAGE_REPOSITORY)
    private readonly messages: IContactMessageRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    status?: 'NEW' | 'READ' | 'ARCHIVED';
  }) {
    const result = await this.messages.findAll(query);
    return {
      ...result,
      items: result.items.map((m) => toContactMessageOutput(m)),
    };
  }
}

@Injectable()
export class UpdateContactMessageStatusUseCase {
  constructor(
    @Inject(CONTACT_MESSAGE_REPOSITORY)
    private readonly messages: IContactMessageRepository,
  ) {}

  async execute(
    id: number,
    status: 'NEW' | 'READ' | 'ARCHIVED',
  ): Promise<ContactMessageOutput> {
    const existing = await this.messages.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Contact message not found.');
    const updated = await this.messages.updateStatus(id, status);
    return toContactMessageOutput(updated);
  }
}

@Injectable()
export class DeleteContactMessageUseCase {
  constructor(
    @Inject(CONTACT_MESSAGE_REPOSITORY)
    private readonly messages: IContactMessageRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.messages.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Contact message not found.');
    await this.messages.delete(id);
  }
}
