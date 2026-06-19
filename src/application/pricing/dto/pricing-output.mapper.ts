import { PricingPlan } from '@domain/pricing/entities/pricing-plan.entity';
import { PricingFeatureRow } from '@domain/pricing/entities/pricing-feature-row.entity';
import type {
  LocalizedStringList,
  LocalizedText,
} from '@shared/domain/localized-content';

export interface PricingPlanOutput {
  id: number;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  priceLabel: LocalizedText;
  priceNote: LocalizedText | null;
  features: LocalizedStringList;
  ctaLabel: LocalizedText;
  ctaUrl: string;
  isHighlighted: boolean;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingFeatureRowOutput {
  id: number;
  productName: LocalizedText;
  starterValue: LocalizedText;
  proValue: LocalizedText;
  enterpriseValue: LocalizedText;
  sortOrder: number;
}

export interface PublicPricingOutput {
  plans: PricingPlanOutput[];
  featureRows: PricingFeatureRowOutput[];
}

export function toPricingPlanOutput(plan: PricingPlan): PricingPlanOutput {
  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: plan.description,
    priceLabel: plan.priceLabel,
    priceNote: plan.priceNote,
    features: plan.features,
    ctaLabel: plan.ctaLabel,
    ctaUrl: plan.ctaUrl,
    isHighlighted: plan.isHighlighted,
    sortOrder: plan.sortOrder,
    isPublished: plan.isPublished,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
}

export function toPricingFeatureRowOutput(
  row: PricingFeatureRow,
): PricingFeatureRowOutput {
  return {
    id: row.id,
    productName: row.productName,
    starterValue: row.starterValue,
    proValue: row.proValue,
    enterpriseValue: row.enterpriseValue,
    sortOrder: row.sortOrder,
  };
}
