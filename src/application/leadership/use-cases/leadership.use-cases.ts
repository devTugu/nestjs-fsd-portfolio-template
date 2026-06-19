import { Inject, Injectable } from '@nestjs/common';
import { ILeadershipMemberRepository } from '@domain/leadership/repositories/leadership-member.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { LEADERSHIP_MEMBER_REPOSITORY } from '@shared/constants/tokens';
import {
  LeadershipMemberOutput,
  toLeadershipMemberOutput,
} from '../dto/leadership-output.mapper';
import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { PaginatedResult } from '@shared/types/pagination';

@Injectable()
export class CreateLeadershipMemberUseCase {
  constructor(
    @Inject(LEADERSHIP_MEMBER_REPOSITORY)
    private readonly leadership: ILeadershipMemberRepository,
  ) {}

  async execute(input: {
    name: string;
    title: LocalizedText;
    quote: LocalizedText;
    imageUrl?: string | null;
    socialLinks?: SocialLink[];
    sortOrder?: number;
    isPublished?: boolean;
  }): Promise<LeadershipMemberOutput> {
    const member = await this.leadership.create(input);
    return toLeadershipMemberOutput(member);
  }
}

@Injectable()
export class UpdateLeadershipMemberUseCase {
  constructor(
    @Inject(LEADERSHIP_MEMBER_REPOSITORY)
    private readonly leadership: ILeadershipMemberRepository,
  ) {}

  async execute(
    id: number,
    input: {
      name?: string;
      title?: LocalizedText;
      quote?: LocalizedText;
      imageUrl?: string | null;
      socialLinks?: SocialLink[];
      sortOrder?: number;
      isPublished?: boolean;
    },
  ): Promise<LeadershipMemberOutput> {
    const existing = await this.leadership.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Leadership member not found.');
    const member = await this.leadership.update(id, input);
    return toLeadershipMemberOutput(member);
  }
}

@Injectable()
export class GetLeadershipMemberUseCase {
  constructor(
    @Inject(LEADERSHIP_MEMBER_REPOSITORY)
    private readonly leadership: ILeadershipMemberRepository,
  ) {}

  async execute(id: number): Promise<LeadershipMemberOutput> {
    const member = await this.leadership.findById(id);
    if (!member) throw AppErrors.NOT_FOUND('Leadership member not found.');
    return toLeadershipMemberOutput(member);
  }
}

@Injectable()
export class ListLeadershipMembersUseCase {
  constructor(
    @Inject(LEADERSHIP_MEMBER_REPOSITORY)
    private readonly leadership: ILeadershipMemberRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<LeadershipMemberOutput>> {
    const result = await this.leadership.findAll(query);
    return { ...result, items: result.items.map(toLeadershipMemberOutput) };
  }
}

@Injectable()
export class DeleteLeadershipMemberUseCase {
  constructor(
    @Inject(LEADERSHIP_MEMBER_REPOSITORY)
    private readonly leadership: ILeadershipMemberRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const member = await this.leadership.findById(id);
    if (!member) throw AppErrors.NOT_FOUND('Leadership member not found.');
    await this.leadership.softDelete(id);
  }
}

@Injectable()
export class ListPublicLeadershipUseCase {
  constructor(
    @Inject(LEADERSHIP_MEMBER_REPOSITORY)
    private readonly leadership: ILeadershipMemberRepository,
  ) {}

  async execute(): Promise<LeadershipMemberOutput[]> {
    const items = await this.leadership.findAllPublished();
    return items.map(toLeadershipMemberOutput);
  }
}
