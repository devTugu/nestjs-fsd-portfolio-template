import { Inject, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from '@domain/pricing/repositories/pricing-plan.repository.interface';
import { IPricingFeatureRowRepository } from '@domain/pricing/repositories/pricing-feature-row.repository.interface';
import {
  PublicPricingOutput,
  toPricingFeatureRowOutput,
  toPricingPlanOutput,
} from '../dto/pricing-output.mapper';
import {
  PRICING_PLAN_REPOSITORY,
  PRICING_FEATURE_ROW_REPOSITORY,
} from '@shared/constants/tokens';

@Injectable()
export class GetPublicPricingUseCase {
  constructor(
    @Inject(PRICING_PLAN_REPOSITORY)
    private readonly plans: IPricingPlanRepository,
    @Inject(PRICING_FEATURE_ROW_REPOSITORY)
    private readonly featureRows: IPricingFeatureRowRepository,
  ) {}

  async execute(): Promise<PublicPricingOutput> {
    const [plans, rows] = await Promise.all([
      this.plans.findAllPublished(),
      this.featureRows.findAllOrdered(),
    ]);
    return {
      plans: plans.map((p) => toPricingPlanOutput(p)),
      featureRows: rows.map((r) => toPricingFeatureRowOutput(r)),
    };
  }
}
