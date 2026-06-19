import { PricingFeatureRow } from '@domain/pricing/entities/pricing-feature-row.entity';
import { coerceLocalizedText } from '@shared/domain/localized-content.mapper';
import { PricingFeatureRowEntity } from '../entities/pricing-feature-row.entity';

export class PricingFeatureRowMapper {
  static toDomain(entity: PricingFeatureRowEntity): PricingFeatureRow {
    return new PricingFeatureRow(
      entity.id,
      coerceLocalizedText(entity.productName),
      coerceLocalizedText(entity.starterValue),
      coerceLocalizedText(entity.proValue),
      coerceLocalizedText(entity.enterpriseValue),
      entity.sortOrder,
    );
  }
}
