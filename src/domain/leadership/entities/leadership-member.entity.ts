import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';

export class LeadershipMember {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly title: LocalizedText,
    public readonly quote: LocalizedText,
    public readonly imageUrl: string | null,
    public readonly socialLinks: SocialLink[],
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
