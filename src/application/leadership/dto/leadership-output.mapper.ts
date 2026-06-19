import { LeadershipMember } from '@domain/leadership/entities/leadership-member.entity';

export interface LeadershipMemberOutput {
  id: number;
  name: string;
  title: LeadershipMember['title'];
  quote: LeadershipMember['quote'];
  imageUrl: string | null;
  socialLinks: LeadershipMember['socialLinks'];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toLeadershipMemberOutput(
  member: LeadershipMember,
): LeadershipMemberOutput {
  return {
    id: member.id,
    name: member.name,
    title: member.title,
    quote: member.quote,
    imageUrl: member.imageUrl,
    socialLinks: member.socialLinks,
    sortOrder: member.sortOrder,
    isPublished: member.isPublished,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}
