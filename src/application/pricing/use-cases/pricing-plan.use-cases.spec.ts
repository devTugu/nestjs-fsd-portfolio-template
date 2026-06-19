import { CreatePricingPlanUseCase } from './create-pricing-plan.use-case';
import { DeletePricingPlanUseCase } from './delete-pricing-plan.use-case';
import { GetPricingPlanUseCase } from './get-pricing-plan.use-case';
import { ListPricingPlansUseCase } from './list-pricing-plans.use-case';
import { UpdatePricingPlanUseCase } from './update-pricing-plan.use-case';
import {
  localizedStringList,
  localizedText,
} from '@shared/domain/localized-content';

describe('Pricing plan use cases', () => {
  const plan = {
    id: 1,
    slug: 'starter',
    name: localizedText('Starter', 'Starter'),
    description: localizedText('For individuals', 'For individuals'),
    priceLabel: localizedText('$9', '$9'),
    priceNote: null,
    features: localizedStringList(['Feature A'], ['Feature A']),
    ctaLabel: localizedText('Get started', 'Get started'),
    ctaUrl: 'https://example.com/start',
    isHighlighted: false,
    sortOrder: 0,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const plans = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    slugExists: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('GetPricingPlanUseCase returns plan', async () => {
    plans.findById.mockResolvedValue(plan);
    const result = await new GetPricingPlanUseCase(plans as never).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetPricingPlanUseCase throws NOT_FOUND', async () => {
    plans.findById.mockResolvedValue(null);
    await expect(
      new GetPricingPlanUseCase(plans as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListPricingPlansUseCase maps items', async () => {
    plans.findAll.mockResolvedValue({
      items: [plan],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListPricingPlansUseCase(plans as never).execute(
      {},
    );
    expect(result.items).toHaveLength(1);
  });

  it('CreatePricingPlanUseCase creates with unique slug', async () => {
    plans.slugExists.mockResolvedValue(false);
    plans.create.mockResolvedValue(plan);
    const result = await new CreatePricingPlanUseCase(plans as never).execute({
      name: plan.name,
      description: plan.description,
      priceLabel: plan.priceLabel,
      features: plan.features,
      ctaLabel: plan.ctaLabel,
      ctaUrl: plan.ctaUrl,
    });
    expect(result.slug).toBe('starter');
  });

  it('CreatePricingPlanUseCase deduplicates slug', async () => {
    plans.slugExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    plans.create.mockResolvedValue({ ...plan, slug: 'starter-2' });
    await new CreatePricingPlanUseCase(plans as never).execute({
      name: plan.name,
      description: plan.description,
      priceLabel: plan.priceLabel,
      features: plan.features,
      ctaLabel: plan.ctaLabel,
      ctaUrl: plan.ctaUrl,
    });
    expect(plans.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'starter-1' }),
    );
  });

  it('UpdatePricingPlanUseCase throws NOT_FOUND', async () => {
    plans.findById.mockResolvedValue(null);
    await expect(
      new UpdatePricingPlanUseCase(plans as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('UpdatePricingPlanUseCase throws on slug conflict', async () => {
    plans.findById.mockResolvedValue(plan);
    plans.slugExists.mockResolvedValue(true);
    await expect(
      new UpdatePricingPlanUseCase(plans as never).execute(1, {
        slug: 'taken',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('UpdatePricingPlanUseCase regenerates slug when name changes', async () => {
    plans.findById.mockResolvedValue(plan);
    plans.slugExists.mockResolvedValue(false);
    plans.update.mockResolvedValue({ ...plan, slug: 'pro-plan' });
    await new UpdatePricingPlanUseCase(plans as never).execute(1, {
      name: localizedText('Pro Plan', 'Pro Plan'),
    });
    expect(plans.update).toHaveBeenCalled();
  });

  it('DeletePricingPlanUseCase soft deletes', async () => {
    plans.findById.mockResolvedValue(plan);
    await new DeletePricingPlanUseCase(plans as never).execute(1);
    expect(plans.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeletePricingPlanUseCase throws NOT_FOUND', async () => {
    plans.findById.mockResolvedValue(null);
    await expect(
      new DeletePricingPlanUseCase(plans as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
