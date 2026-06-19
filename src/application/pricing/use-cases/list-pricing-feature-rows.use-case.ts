import { Inject, Injectable } from '@nestjs/common';
import { IPricingFeatureRowRepository } from '@domain/pricing/repositories/pricing-feature-row.repository.interface';
import {
  PricingFeatureRowOutput,
  toPricingFeatureRowOutput,
} from '../dto/pricing-output.mapper';
import { PaginatedResult } from '@shared/types/pagination';
import { PRICING_FEATURE_ROW_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ListPricingFeatureRowsUseCase {
  constructor(
    @Inject(PRICING_FEATURE_ROW_REPOSITORY)
    private readonly featureRows: IPricingFeatureRowRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<PricingFeatureRowOutput>> {
    const result = await this.featureRows.findAll(query);
    return {
      ...result,
      items: result.items.map((r) => toPricingFeatureRowOutput(r)),
    };
  }
}
