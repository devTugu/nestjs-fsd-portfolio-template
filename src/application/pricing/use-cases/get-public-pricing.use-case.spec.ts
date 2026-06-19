import { GetPublicPricingUseCase } from './get-public-pricing.use-case';
import {
  localizedStringList,
  localizedText,
} from '@shared/domain/localized-content';

describe('GetPublicPricingUseCase', () => {
  const plan = {
    id: 1,
    slug: 'starter',
    name: localizedText('Starter', 'Starter'),
    description: localizedText('Desc', 'Desc'),
    priceLabel: localizedText('$9', '$9'),
    priceNote: null,
    features: localizedStringList(['A'], ['A']),
    ctaLabel: localizedText('Start', 'Start'),
    ctaUrl: 'https://example.com',
    isHighlighted: false,
    sortOrder: 0,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const row = {
    id: 1,
    productName: localizedText('API', 'API'),
    starterValue: localizedText('Yes', 'Yes'),
    proValue: localizedText('Yes', 'Yes'),
    enterpriseValue: localizedText('Custom', 'Custom'),
    sortOrder: 0,
  };

  const plans = { findAllPublished: jest.fn() };
  const featureRows = { findAllOrdered: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it('returns published plans and feature rows', async () => {
    plans.findAllPublished.mockResolvedValue([plan]);
    featureRows.findAllOrdered.mockResolvedValue([row]);

    const result = await new GetPublicPricingUseCase(
      plans as never,
      featureRows as never,
    ).execute();

    expect(result.plans).toHaveLength(1);
    expect(result.featureRows).toHaveLength(1);
    expect(result.plans[0].slug).toBe('starter');
  });

  it('returns empty arrays when no data', async () => {
    plans.findAllPublished.mockResolvedValue([]);
    featureRows.findAllOrdered.mockResolvedValue([]);

    const result = await new GetPublicPricingUseCase(
      plans as never,
      featureRows as never,
    ).execute();

    expect(result.plans).toHaveLength(0);
    expect(result.featureRows).toHaveLength(0);
  });
});
