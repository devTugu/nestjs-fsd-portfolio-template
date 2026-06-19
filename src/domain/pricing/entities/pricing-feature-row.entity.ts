import type { LocalizedText } from '@shared/domain/localized-content';

export class PricingFeatureRow {
  constructor(
    public readonly id: number,
    public readonly productName: LocalizedText,
    public readonly starterValue: LocalizedText,
    public readonly proValue: LocalizedText,
    public readonly enterpriseValue: LocalizedText,
    public readonly sortOrder: number,
  ) {}
}
