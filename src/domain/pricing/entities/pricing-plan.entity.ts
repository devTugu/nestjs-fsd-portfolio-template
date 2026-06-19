import type {
  LocalizedStringList,
  LocalizedText,
} from '@shared/domain/localized-content';

export class PricingPlan {
  constructor(
    public readonly id: number,
    public readonly slug: string,
    public readonly name: LocalizedText,
    public readonly description: LocalizedText,
    public readonly priceLabel: LocalizedText,
    public readonly priceNote: LocalizedText | null,
    public readonly features: LocalizedStringList,
    public readonly ctaLabel: LocalizedText,
    public readonly ctaUrl: string,
    public readonly isHighlighted: boolean,
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
