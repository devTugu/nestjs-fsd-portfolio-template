import { Inject, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from '@domain/pricing/repositories/pricing-plan.repository.interface';
import {
  PricingPlanOutput,
  toPricingPlanOutput,
} from '../dto/pricing-output.mapper';
import { PaginatedResult } from '@shared/types/pagination';
import { PRICING_PLAN_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ListPricingPlansUseCase {
  constructor(
    @Inject(PRICING_PLAN_REPOSITORY)
    private readonly plans: IPricingPlanRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<PricingPlanOutput>> {
    const result = await this.plans.findAll(query);
    return {
      ...result,
      items: result.items.map((p) => toPricingPlanOutput(p)),
    };
  }
}
