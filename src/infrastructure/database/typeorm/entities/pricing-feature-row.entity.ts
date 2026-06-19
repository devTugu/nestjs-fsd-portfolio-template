import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { LocalizedText } from '@shared/domain/localized-content';

@Entity({ name: 'pricing_feature_rows' })
export class PricingFeatureRowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name', type: 'json' })
  productName: LocalizedText;

  @Column({ name: 'starter_value', type: 'json' })
  starterValue: LocalizedText;

  @Column({ name: 'pro_value', type: 'json' })
  proValue: LocalizedText;

  @Column({ name: 'enterprise_value', type: 'json' })
  enterpriseValue: LocalizedText;

  @Index('IDX_pricing_feature_rows_sort')
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
