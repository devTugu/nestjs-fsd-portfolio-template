import { Inject, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from '@domain/pricing/repositories/pricing-plan.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { PRICING_PLAN_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class DeletePricingPlanUseCase {
  constructor(
    @Inject(PRICING_PLAN_REPOSITORY)
    private readonly plans: IPricingPlanRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const plan = await this.plans.findById(id);
    if (!plan) throw AppErrors.NOT_FOUND('Pricing plan not found.');
    await this.plans.softDelete(id);
  }
}
