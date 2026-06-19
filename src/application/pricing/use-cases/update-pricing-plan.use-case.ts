import { Inject, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from '@domain/pricing/repositories/pricing-plan.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
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
export class UpdatePricingPlanUseCase {
  constructor(
    @Inject(PRICING_PLAN_REPOSITORY)
    private readonly plans: IPricingPlanRepository,
  ) {}

  async execute(
    id: number,
    input: {
      name?: LocalizedText;
      slug?: string;
      description?: LocalizedText;
      priceLabel?: LocalizedText;
      priceNote?: LocalizedText | null;
      features?: LocalizedStringList;
      ctaLabel?: LocalizedText;
      ctaUrl?: string;
      isHighlighted?: boolean;
      sortOrder?: number;
      isPublished?: boolean;
    },
  ): Promise<PricingPlanOutput> {
    const existing = await this.plans.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Pricing plan not found.');

    const updateData: Parameters<IPricingPlanRepository['update']>[1] = {
      ...input,
    };

    if (input.slug !== undefined) {
      if (await this.plans.slugExists(input.slug, id)) {
        throw AppErrors.CONFLICT('Slug is already in use.');
      }
    } else if (input.name !== undefined && input.name.en !== existing.name.en) {
      const baseSlug = generateSlug(input.name.en);
      updateData.slug = await this.resolveUniqueSlug(baseSlug, id);
    }

    const plan = await this.plans.update(id, updateData);
    return toPricingPlanOutput(plan);
  }

  private async resolveUniqueSlug(
    baseSlug: string,
    excludeId: number,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.plans.slugExists(slug, excludeId)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}
