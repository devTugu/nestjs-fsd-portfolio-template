import {
  ContactMessage,
  ContactMessageStatus,
} from '../entities/contact-message.entity';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateContactMessageData {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  ipAddress?: string | null;
}

export interface ListContactMessagesQuery {
  page?: number;
  limit?: number;
  status?: ContactMessageStatus;
}

export interface IContactMessageRepository {
  create(data: CreateContactMessageData): Promise<ContactMessage>;
  findById(id: number): Promise<ContactMessage | null>;
  findAll(
    query: ListContactMessagesQuery,
  ): Promise<PaginatedResult<ContactMessage>>;
  updateStatus(
    id: number,
    status: ContactMessageStatus,
  ): Promise<ContactMessage>;
  delete(id: number): Promise<void>;
}
