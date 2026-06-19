import { Inject, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from '@domain/pricing/repositories/pricing-plan.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  PricingPlanOutput,
  toPricingPlanOutput,
} from '../dto/pricing-output.mapper';
import { PRICING_PLAN_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class GetPricingPlanUseCase {
  constructor(
    @Inject(PRICING_PLAN_REPOSITORY)
    private readonly plans: IPricingPlanRepository,
  ) {}

  async execute(id: number): Promise<PricingPlanOutput> {
    const plan = await this.plans.findById(id);
    if (!plan) throw AppErrors.NOT_FOUND('Pricing plan not found.');
    return toPricingPlanOutput(plan);
  }
}
