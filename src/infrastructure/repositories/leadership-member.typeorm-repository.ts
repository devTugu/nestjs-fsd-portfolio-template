import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateLeadershipMemberData,
  ILeadershipMemberRepository,
  ListLeadershipMembersQuery,
  UpdateLeadershipMemberData,
} from '@domain/leadership/repositories/leadership-member.repository.interface';
import { LeadershipMember as DomainLeadershipMember } from '@domain/leadership/entities/leadership-member.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { LeadershipMemberEntity } from '../database/typeorm/entities/multi-brand.entity';
import { LeadershipMemberMapper } from '../database/typeorm/mappers/multi-brand.mapper';

@Injectable()
export class LeadershipMemberTypeOrmRepository implements ILeadershipMemberRepository {
  constructor(
    @InjectRepository(LeadershipMemberEntity)
    private readonly repository: Repository<LeadershipMemberEntity>,
  ) {}

  async create(
    data: CreateLeadershipMemberData,
  ): Promise<DomainLeadershipMember> {
    const saved = await this.repository.save(
      this.repository.create({
        name: data.name,
        title: data.title,
        quote: data.quote,
        imageUrl: data.imageUrl ?? null,
        socialLinks: data.socialLinks ?? [],
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? true,
      }),
    );
    return LeadershipMemberMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainLeadershipMember | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? LeadershipMemberMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListLeadershipMembersQuery,
  ): Promise<PaginatedResult<DomainLeadershipMember>> {
    const { page = 1, limit = 50 } = query;
    const [items, total] = await this.repository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return {
      items: items.map((m) => LeadershipMemberMapper.toDomain(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(): Promise<DomainLeadershipMember[]> {
    const items = await this.repository.find({
      where: { isPublished: true, deletedAt: IsNull() },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return items.map((m) => LeadershipMemberMapper.toDomain(m));
  }

  async update(
    id: number,
    data: UpdateLeadershipMemberData,
  ): Promise<DomainLeadershipMember> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.name !== undefined) entity.name = data.name;
    if (data.title !== undefined) entity.title = data.title;
    if (data.quote !== undefined) entity.quote = data.quote;
    if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
    if (data.socialLinks !== undefined) entity.socialLinks = data.socialLinks;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    const saved = await this.repository.save(entity);
    return LeadershipMemberMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    await this.repository.softRemove(entity);
  }
}
