import { TeamMember } from '../entities/team-member.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateTeamMemberData {
  name: string;
  role: LocalizedText;
  imageUrl?: string | null;
  socialLinks?: SocialLink[];
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateTeamMemberData {
  name?: string;
  role?: LocalizedText;
  imageUrl?: string | null;
  socialLinks?: SocialLink[];
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListTeamMembersQuery {
  page?: number;
  limit?: number;
}

export interface ITeamMemberRepository {
  create(data: CreateTeamMemberData): Promise<TeamMember>;
  findById(id: number): Promise<TeamMember | null>;
  findAll(query: ListTeamMembersQuery): Promise<PaginatedResult<TeamMember>>;
  findAllPublished(): Promise<TeamMember[]>;
  update(id: number, data: UpdateTeamMemberData): Promise<TeamMember>;
  softDelete(id: number): Promise<void>;
}
