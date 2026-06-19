import { Inject, Injectable } from '@nestjs/common';
import { ITeamMemberRepository } from '@domain/team/repositories/team-member.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { TEAM_MEMBER_REPOSITORY } from '@shared/constants/tokens';
import {
  TeamMemberOutput,
  toTeamMemberOutput,
} from '../dto/team-output.mapper';
import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { PaginatedResult } from '@shared/types/pagination';

@Injectable()
export class CreateTeamMemberUseCase {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY)
    private readonly team: ITeamMemberRepository,
  ) {}

  async execute(input: {
    name: string;
    role: LocalizedText;
    imageUrl?: string | null;
    socialLinks?: SocialLink[];
    sortOrder?: number;
    isPublished?: boolean;
  }): Promise<TeamMemberOutput> {
    const member = await this.team.create(input);
    return toTeamMemberOutput(member);
  }
}

@Injectable()
export class UpdateTeamMemberUseCase {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY)
    private readonly team: ITeamMemberRepository,
  ) {}

  async execute(
    id: number,
    input: {
      name?: string;
      role?: LocalizedText;
      imageUrl?: string | null;
      socialLinks?: SocialLink[];
      sortOrder?: number;
      isPublished?: boolean;
    },
  ): Promise<TeamMemberOutput> {
    const existing = await this.team.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Team member not found.');
    const member = await this.team.update(id, input);
    return toTeamMemberOutput(member);
  }
}

@Injectable()
export class GetTeamMemberUseCase {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY)
    private readonly team: ITeamMemberRepository,
  ) {}

  async execute(id: number): Promise<TeamMemberOutput> {
    const member = await this.team.findById(id);
    if (!member) throw AppErrors.NOT_FOUND('Team member not found.');
    return toTeamMemberOutput(member);
  }
}

@Injectable()
export class ListTeamMembersUseCase {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY)
    private readonly team: ITeamMemberRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<TeamMemberOutput>> {
    const result = await this.team.findAll(query);
    return { ...result, items: result.items.map(toTeamMemberOutput) };
  }
}

@Injectable()
export class DeleteTeamMemberUseCase {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY)
    private readonly team: ITeamMemberRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const member = await this.team.findById(id);
    if (!member) throw AppErrors.NOT_FOUND('Team member not found.');
    await this.team.softDelete(id);
  }
}

@Injectable()
export class ListPublicTeamUseCase {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY)
    private readonly team: ITeamMemberRepository,
  ) {}

  async execute(): Promise<TeamMemberOutput[]> {
    const items = await this.team.findAllPublished();
    return items.map(toTeamMemberOutput);
  }
}
