import { CreatePricingFeatureRowUseCase } from './create-pricing-feature-row.use-case';
import { DeletePricingFeatureRowUseCase } from './delete-pricing-feature-row.use-case';
import { GetPricingFeatureRowUseCase } from './get-pricing-feature-row.use-case';
import { ListPricingFeatureRowsUseCase } from './list-pricing-feature-rows.use-case';
import { UpdatePricingFeatureRowUseCase } from './update-pricing-feature-row.use-case';
import { localizedText } from '@shared/domain/localized-content';

describe('Pricing feature row use cases', () => {
  const row = {
    id: 1,
    productName: localizedText('API access', 'API access'),
    starterValue: localizedText('Limited', 'Limited'),
    proValue: localizedText('Full', 'Full'),
    enterpriseValue: localizedText('Custom', 'Custom'),
    sortOrder: 0,
  };

  const featureRows = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllOrdered: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('GetPricingFeatureRowUseCase returns row', async () => {
    featureRows.findById.mockResolvedValue(row);
    const result = await new GetPricingFeatureRowUseCase(
      featureRows as never,
    ).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetPricingFeatureRowUseCase throws NOT_FOUND', async () => {
    featureRows.findById.mockResolvedValue(null);
    await expect(
      new GetPricingFeatureRowUseCase(featureRows as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListPricingFeatureRowsUseCase maps items', async () => {
    featureRows.findAll.mockResolvedValue({
      items: [row],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListPricingFeatureRowsUseCase(
      featureRows as never,
    ).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('CreatePricingFeatureRowUseCase creates row', async () => {
    featureRows.create.mockResolvedValue(row);
    const result = await new CreatePricingFeatureRowUseCase(
      featureRows as never,
    ).execute({
      productName: row.productName,
      starterValue: row.starterValue,
      proValue: row.proValue,
      enterpriseValue: row.enterpriseValue,
    });
    expect(result.productName.en).toBe('API access');
  });

  it('UpdatePricingFeatureRowUseCase updates row', async () => {
    featureRows.findById.mockResolvedValue(row);
    featureRows.update.mockResolvedValue({
      ...row,
      productName: localizedText('Updated', 'Updated'),
    });
    const result = await new UpdatePricingFeatureRowUseCase(
      featureRows as never,
    ).execute(1, {
      productName: localizedText('Updated', 'Updated'),
    });
    expect(result.productName.en).toBe('Updated');
  });

  it('UpdatePricingFeatureRowUseCase throws NOT_FOUND', async () => {
    featureRows.findById.mockResolvedValue(null);
    await expect(
      new UpdatePricingFeatureRowUseCase(featureRows as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('DeletePricingFeatureRowUseCase deletes row', async () => {
    featureRows.findById.mockResolvedValue(row);
    await new DeletePricingFeatureRowUseCase(featureRows as never).execute(1);
    expect(featureRows.delete).toHaveBeenCalledWith(1);
  });

  it('DeletePricingFeatureRowUseCase throws NOT_FOUND', async () => {
    featureRows.findById.mockResolvedValue(null);
    await expect(
      new DeletePricingFeatureRowUseCase(featureRows as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
