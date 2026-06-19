import { Inject, Injectable } from '@nestjs/common';
import { IPricingFeatureRowRepository } from '@domain/pricing/repositories/pricing-feature-row.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  PricingFeatureRowOutput,
  toPricingFeatureRowOutput,
} from '../dto/pricing-output.mapper';
import { PRICING_FEATURE_ROW_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class GetPricingFeatureRowUseCase {
  constructor(
    @Inject(PRICING_FEATURE_ROW_REPOSITORY)
    private readonly featureRows: IPricingFeatureRowRepository,
  ) {}

  async execute(id: number): Promise<PricingFeatureRowOutput> {
    const row = await this.featureRows.findById(id);
    if (!row) throw AppErrors.NOT_FOUND('Pricing feature row not found.');
    return toPricingFeatureRowOutput(row);
  }
}
