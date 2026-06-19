import { Inject, Injectable } from '@nestjs/common';
import { IPricingFeatureRowRepository } from '@domain/pricing/repositories/pricing-feature-row.repository.interface';
import {
  PricingFeatureRowOutput,
  toPricingFeatureRowOutput,
} from '../dto/pricing-output.mapper';
import { PRICING_FEATURE_ROW_REPOSITORY } from '@shared/constants/tokens';
import type { LocalizedText } from '@shared/domain/localized-content';

@Injectable()
export class CreatePricingFeatureRowUseCase {
  constructor(
    @Inject(PRICING_FEATURE_ROW_REPOSITORY)
    private readonly featureRows: IPricingFeatureRowRepository,
  ) {}

  async execute(input: {
    productName: LocalizedText;
    starterValue: LocalizedText;
    proValue: LocalizedText;
    enterpriseValue: LocalizedText;
    sortOrder?: number;
  }): Promise<PricingFeatureRowOutput> {
    const row = await this.featureRows.create(input);
    return toPricingFeatureRowOutput(row);
  }
}
