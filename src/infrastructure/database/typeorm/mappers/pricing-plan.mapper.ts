import { PricingPlan } from '@domain/pricing/entities/pricing-plan.entity';
import {
  coerceLocalizedStringList,
  coerceLocalizedText,
} from '@shared/domain/localized-content.mapper';
import { PricingPlanEntity } from '../entities/pricing-plan.entity';

export class PricingPlanMapper {
  static toDomain(entity: PricingPlanEntity): PricingPlan {
    return new PricingPlan(
      entity.id,
      entity.slug,
      coerceLocalizedText(entity.name),
      coerceLocalizedText(entity.description),
      coerceLocalizedText(entity.priceLabel),
      entity.priceNote ? coerceLocalizedText(entity.priceNote) : null,
      coerceLocalizedStringList(entity.features),
      coerceLocalizedText(entity.ctaLabel),
      entity.ctaUrl,
      entity.isHighlighted,
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
