import { ContactMessage } from '@domain/contact/entities/contact-message.entity';
import { ContactMessageEntity } from '../entities/contact-message.entity';

export class ContactMessageMapper {
  static toDomain(entity: ContactMessageEntity): ContactMessage {
    return new ContactMessage(
      entity.id,
      entity.name,
      entity.email,
      entity.subject,
      entity.message,
      entity.status,
      entity.ipAddress,
      entity.createdAt,
    );
  }
}
