import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { BrandType } from './brand-type';

export class Brand {
  constructor(
    public readonly id: number,
    public readonly slug: string,
    public readonly type: BrandType,
    public readonly name: LocalizedText,
    public readonly description: LocalizedText,
    public readonly logoUrl: string | null,
    public readonly coverImageUrl: string | null,
    public readonly address: LocalizedText | null,
    public readonly phone: string | null,
    public readonly mapEmbed: string | null,
    public readonly socialLinks: SocialLink[],
    public readonly workHours: LocalizedText | null,
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly publishedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
