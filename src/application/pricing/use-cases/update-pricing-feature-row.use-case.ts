import { Inject, Injectable } from '@nestjs/common';
import { IPricingFeatureRowRepository } from '@domain/pricing/repositories/pricing-feature-row.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  PricingFeatureRowOutput,
  toPricingFeatureRowOutput,
} from '../dto/pricing-output.mapper';
import { PRICING_FEATURE_ROW_REPOSITORY } from '@shared/constants/tokens';
import type { LocalizedText } from '@shared/domain/localized-content';

@Injectable()
export class UpdatePricingFeatureRowUseCase {
  constructor(
    @Inject(PRICING_FEATURE_ROW_REPOSITORY)
    private readonly featureRows: IPricingFeatureRowRepository,
  ) {}

  async execute(
    id: number,
    input: {
      productName?: LocalizedText;
      starterValue?: LocalizedText;
      proValue?: LocalizedText;
      enterpriseValue?: LocalizedText;
      sortOrder?: number;
    },
  ): Promise<PricingFeatureRowOutput> {
    const existing = await this.featureRows.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Pricing feature row not found.');
    const row = await this.featureRows.update(id, input);
    return toPricingFeatureRowOutput(row);
  }
}
