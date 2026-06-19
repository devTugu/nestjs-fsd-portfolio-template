import { LeadershipMember } from '../entities/leadership-member.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateLeadershipMemberData {
  name: string;
  title: LocalizedText;
  quote: LocalizedText;
  imageUrl?: string | null;
  socialLinks?: SocialLink[];
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateLeadershipMemberData {
  name?: string;
  title?: LocalizedText;
  quote?: LocalizedText;
  imageUrl?: string | null;
  socialLinks?: SocialLink[];
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListLeadershipMembersQuery {
  page?: number;
  limit?: number;
}

export interface ILeadershipMemberRepository {
  create(data: CreateLeadershipMemberData): Promise<LeadershipMember>;
  findById(id: number): Promise<LeadershipMember | null>;
  findAll(
    query: ListLeadershipMembersQuery,
  ): Promise<PaginatedResult<LeadershipMember>>;
  findAllPublished(): Promise<LeadershipMember[]>;
  update(
    id: number,
    data: UpdateLeadershipMemberData,
  ): Promise<LeadershipMember>;
  softDelete(id: number): Promise<void>;
}
