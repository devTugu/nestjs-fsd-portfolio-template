export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export class ContactMessage {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly subject: string | null,
    public readonly message: string,
    public readonly status: ContactMessageStatus,
    public readonly ipAddress: string | null,
    public readonly createdAt: Date,
  ) {}
}
