import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ContactMessageStatusEntity = 'NEW' | 'READ' | 'ARCHIVED';

@Entity({ name: 'contact_messages' })
export class ContactMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 200, nullable: true })
  subject: string | null;

  @Column({ type: 'text' })
  message: string;

  @Index('IDX_contact_messages_status')
  @Column({
    type: 'enum',
    enum: ['NEW', 'READ', 'ARCHIVED'],
    default: 'NEW',
  })
  status: ContactMessageStatusEntity;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
