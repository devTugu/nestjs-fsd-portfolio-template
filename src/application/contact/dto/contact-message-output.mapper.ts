import { ContactMessage } from '@domain/contact/entities/contact-message.entity';

export interface ContactMessageOutput {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactMessage['status'];
  ipAddress: string | null;
  createdAt: string;
}

export function toContactMessageOutput(
  message: ContactMessage,
): ContactMessageOutput {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    status: message.status,
    ipAddress: message.ipAddress,
    createdAt: message.createdAt.toISOString(),
  };
}
