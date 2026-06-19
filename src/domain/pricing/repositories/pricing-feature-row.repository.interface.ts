import { PricingFeatureRow } from '../entities/pricing-feature-row.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreatePricingFeatureRowData {
  productName: LocalizedText;
  starterValue: LocalizedText;
  proValue: LocalizedText;
  enterpriseValue: LocalizedText;
  sortOrder?: number;
}

export interface UpdatePricingFeatureRowData {
  productName?: LocalizedText;
  starterValue?: LocalizedText;
  proValue?: LocalizedText;
  enterpriseValue?: LocalizedText;
  sortOrder?: number;
}

export interface ListPricingFeatureRowsQuery {
  page?: number;
  limit?: number;
}

export interface IPricingFeatureRowRepository {
  create(data: CreatePricingFeatureRowData): Promise<PricingFeatureRow>;
  findById(id: number): Promise<PricingFeatureRow | null>;
  findAll(
    query: ListPricingFeatureRowsQuery,
  ): Promise<PaginatedResult<PricingFeatureRow>>;
  findAllOrdered(): Promise<PricingFeatureRow[]>;
  update(
    id: number,
    data: UpdatePricingFeatureRowData,
  ): Promise<PricingFeatureRow>;
  delete(id: number): Promise<void>;
}
