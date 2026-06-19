import { PricingPlan } from '../entities/pricing-plan.entity';
import type {
  LocalizedStringList,
  LocalizedText,
} from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreatePricingPlanData {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  priceLabel: LocalizedText;
  priceNote?: LocalizedText | null;
  features: LocalizedStringList;
  ctaLabel: LocalizedText;
  ctaUrl: string;
  isHighlighted?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdatePricingPlanData {
  slug?: string;
  name?: LocalizedText;
  description?: LocalizedText;
  priceLabel?: LocalizedText;
  priceNote?: LocalizedText | null;
  features?: LocalizedStringList;
  ctaLabel?: LocalizedText;
  ctaUrl?: string;
  isHighlighted?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListPricingPlansQuery {
  page?: number;
  limit?: number;
  publishedOnly?: boolean;
}

export interface IPricingPlanRepository {
  create(data: CreatePricingPlanData): Promise<PricingPlan>;
  findById(id: number): Promise<PricingPlan | null>;
  findBySlug(slug: string): Promise<PricingPlan | null>;
  findAll(query: ListPricingPlansQuery): Promise<PaginatedResult<PricingPlan>>;
  findAllPublished(): Promise<PricingPlan[]>;
  update(id: number, data: UpdatePricingPlanData): Promise<PricingPlan>;
  softDelete(id: number): Promise<void>;
  slugExists(slug: string, excludeId?: number): Promise<boolean>;
}
