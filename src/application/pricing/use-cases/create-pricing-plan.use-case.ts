import { Inject, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from '@domain/pricing/repositories/pricing-plan.repository.interface';
import {
  PricingPlanOutput,
  toPricingPlanOutput,
} from '../dto/pricing-output.mapper';
import { PRICING_PLAN_REPOSITORY } from '@shared/constants/tokens';
import type {
  LocalizedStringList,
  LocalizedText,
} from '@shared/domain/localized-content';
import { generateSlug, generateUniqueSlug } from '@shared/utils/generate-slug';

@Injectable()
export class CreatePricingPlanUseCase {
  constructor(
    @Inject(PRICING_PLAN_REPOSITORY)
    private readonly plans: IPricingPlanRepository,
  ) {}

  async execute(input: {
    name: LocalizedText;
    slug?: string;
    description: LocalizedText;
    priceLabel: LocalizedText;
    priceNote?: LocalizedText | null;
    features: LocalizedStringList;
    ctaLabel: LocalizedText;
    ctaUrl: string;
    isHighlighted?: boolean;
    sortOrder?: number;
    isPublished?: boolean;
  }): Promise<PricingPlanOutput> {
    const slug = await this.resolveUniqueSlug(
      input.slug ?? generateSlug(input.name.en),
    );
    const plan = await this.plans.create({ ...input, slug });
    return toPricingPlanOutput(plan);
  }

  private async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.plans.slugExists(slug)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}
