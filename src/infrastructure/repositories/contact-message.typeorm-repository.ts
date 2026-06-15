import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateContactMessageData,
  IContactMessageRepository,
  ListContactMessagesQuery,
} from '@domain/contact/repositories/contact-message.repository.interface';
import {
  ContactMessage,
  ContactMessageStatus,
} from '@domain/contact/entities/contact-message.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { ContactMessageEntity } from '../database/typeorm/entities/contact-message.entity';
import { ContactMessageMapper } from '../database/typeorm/mappers/contact-message.mapper';

@Injectable()
export class ContactMessageTypeOrmRepository implements IContactMessageRepository {
  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly repository: Repository<ContactMessageEntity>,
  ) {}

  async create(data: CreateContactMessageData): Promise<ContactMessage> {
    const saved = await this.repository.save(
      this.repository.create({
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
        ipAddress: data.ipAddress ?? null,
        status: 'NEW',
      }),
    );
    return ContactMessageMapper.toDomain(saved);
  }

  async findById(id: number): Promise<ContactMessage | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ContactMessageMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListContactMessagesQuery,
  ): Promise<PaginatedResult<ContactMessage>> {
    const { page = 1, limit = 20, status } = query;
    const where = status ? { status } : {};
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      items: items.map((m) => ContactMessageMapper.toDomain(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(
    id: number,
    status: ContactMessageStatus,
  ): Promise<ContactMessage> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    entity.status = status;
    const saved = await this.repository.save(entity);
    return ContactMessageMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
