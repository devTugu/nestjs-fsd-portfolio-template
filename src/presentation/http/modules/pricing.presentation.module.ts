import { Module } from '@nestjs/common';
import { PricingPublicV1Controller } from '../controllers/v1/public/pricing.controller';
import {
  PricingPlanAdminV1Controller,
  PricingFeatureRowAdminV1Controller,
} from '../controllers/v1/admin/pricing.controller';
import { CreatePricingPlanUseCase } from '@application/pricing/use-cases/create-pricing-plan.use-case';
import { ListPricingPlansUseCase } from '@application/pricing/use-cases/list-pricing-plans.use-case';
import { GetPricingPlanUseCase } from '@application/pricing/use-cases/get-pricing-plan.use-case';
import { UpdatePricingPlanUseCase } from '@application/pricing/use-cases/update-pricing-plan.use-case';
import { DeletePricingPlanUseCase } from '@application/pricing/use-cases/delete-pricing-plan.use-case';
import { GetPublicPricingUseCase } from '@application/pricing/use-cases/get-public-pricing.use-case';
import { CreatePricingFeatureRowUseCase } from '@application/pricing/use-cases/create-pricing-feature-row.use-case';
import { ListPricingFeatureRowsUseCase } from '@application/pricing/use-cases/list-pricing-feature-rows.use-case';
import { GetPricingFeatureRowUseCase } from '@application/pricing/use-cases/get-pricing-feature-row.use-case';
import { UpdatePricingFeatureRowUseCase } from '@application/pricing/use-cases/update-pricing-feature-row.use-case';
import { DeletePricingFeatureRowUseCase } from '@application/pricing/use-cases/delete-pricing-feature-row.use-case';

@Module({
  controllers: [
    PricingPublicV1Controller,
    PricingPlanAdminV1Controller,
    PricingFeatureRowAdminV1Controller,
  ],
  providers: [
    CreatePricingPlanUseCase,
    ListPricingPlansUseCase,
    GetPricingPlanUseCase,
    UpdatePricingPlanUseCase,
    DeletePricingPlanUseCase,
    GetPublicPricingUseCase,
    CreatePricingFeatureRowUseCase,
    ListPricingFeatureRowsUseCase,
    GetPricingFeatureRowUseCase,
    UpdatePricingFeatureRowUseCase,
    DeletePricingFeatureRowUseCase,
  ],
})
export class PricingPresentationModule {}
