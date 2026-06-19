import { TeamMember } from '@domain/team/entities/team-member.entity';

export interface TeamMemberOutput {
  id: number;
  name: string;
  role: TeamMember['role'];
  imageUrl: string | null;
  socialLinks: TeamMember['socialLinks'];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toTeamMemberOutput(member: TeamMember): TeamMemberOutput {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    imageUrl: member.imageUrl,
    socialLinks: member.socialLinks,
    sortOrder: member.sortOrder,
    isPublished: member.isPublished,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}
