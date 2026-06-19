import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateTeamMemberData,
  ITeamMemberRepository,
  ListTeamMembersQuery,
  UpdateTeamMemberData,
} from '@domain/team/repositories/team-member.repository.interface';
import { TeamMember as DomainTeamMember } from '@domain/team/entities/team-member.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { TeamMemberEntity } from '../database/typeorm/entities/multi-brand.entity';
import { TeamMemberMapper } from '../database/typeorm/mappers/multi-brand.mapper';

@Injectable()
export class TeamMemberTypeOrmRepository implements ITeamMemberRepository {
  constructor(
    @InjectRepository(TeamMemberEntity)
    private readonly repository: Repository<TeamMemberEntity>,
  ) {}

  async create(data: CreateTeamMemberData): Promise<DomainTeamMember> {
    const saved = await this.repository.save(
      this.repository.create({
        name: data.name,
        role: data.role,
        imageUrl: data.imageUrl ?? null,
        socialLinks: data.socialLinks ?? [],
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? true,
      }),
    );
    return TeamMemberMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainTeamMember | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? TeamMemberMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListTeamMembersQuery,
  ): Promise<PaginatedResult<DomainTeamMember>> {
    const { page = 1, limit = 50 } = query;
    const [items, total] = await this.repository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return {
      items: items.map((m) => TeamMemberMapper.toDomain(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(): Promise<DomainTeamMember[]> {
    const items = await this.repository.find({
      where: { isPublished: true, deletedAt: IsNull() },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return items.map((m) => TeamMemberMapper.toDomain(m));
  }

  async update(
    id: number,
    data: UpdateTeamMemberData,
  ): Promise<DomainTeamMember> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.name !== undefined) entity.name = data.name;
    if (data.role !== undefined) entity.role = data.role;
    if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
    if (data.socialLinks !== undefined) entity.socialLinks = data.socialLinks;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    const saved = await this.repository.save(entity);
    return TeamMemberMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    await this.repository.softRemove(entity);
  }
}
