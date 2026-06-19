import { Brand } from '@domain/brand/entities/brand.entity';
import { BrandEvent } from '@domain/brand/entities/brand-event.entity';
import { BrandType } from '@domain/brand/entities/brand-type';
import { localizedText } from '@shared/domain/localized-content';
import {
  CreateBrandEventUseCase,
  DeleteBrandEventUseCase,
  GetBrandEventUseCase,
  ListBrandEventsUseCase,
  UpdateBrandEventUseCase,
} from './brand-event.use-cases';

describe('Brand event use cases', () => {
  const now = new Date();

  const brand = new Brand(
    2,
    'demo-event',
    BrandType.EVENT,
    localizedText('Demo Event', 'Demo Event'),
    localizedText('Desc', 'Desc'),
    null,
    null,
    null,
    null,
    null,
    [],
    null,
    0,
    true,
    now,
    now,
    now,
  );

  const brandEvent = new BrandEvent(
    20,
    2,
    localizedText('Gala', 'Gala'),
    localizedText('Annual gala', 'Annual gala'),
    now,
    localizedText('Ulaanbaatar', 'Ulaanbaatar'),
    null,
    0,
    true,
    now,
    now,
  );

  const brandEvents = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const brands = {
    findById: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('CreateBrandEventUseCase creates event', async () => {
    brands.findById.mockResolvedValue(brand);
    brandEvents.create.mockResolvedValue(brandEvent);

    const result = await new CreateBrandEventUseCase(
      brandEvents as never,
      brands as never,
    ).execute({
      brandId: 2,
      title: localizedText('Gala', 'Gala'),
      description: localizedText('Annual gala', 'Annual gala'),
      eventDate: now,
      location: localizedText('Ulaanbaatar', 'Ulaanbaatar'),
    });

    expect(result.id).toBe(20);
  });

  it('CreateBrandEventUseCase throws when brand missing', async () => {
    brands.findById.mockResolvedValue(null);
    await expect(
      new CreateBrandEventUseCase(
        brandEvents as never,
        brands as never,
      ).execute({
        brandId: 99,
        title: localizedText('Gala', 'Gala'),
        description: localizedText('Annual gala', 'Annual gala'),
        eventDate: now,
        location: localizedText('Ulaanbaatar', 'Ulaanbaatar'),
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('UpdateBrandEventUseCase updates event', async () => {
    brandEvents.findById.mockResolvedValue(brandEvent);
    brandEvents.update.mockResolvedValue({
      ...brandEvent,
      sortOrder: 1,
    });

    const result = await new UpdateBrandEventUseCase(
      brandEvents as never,
    ).execute(20, { sortOrder: 1 });

    expect(result.sortOrder).toBe(1);
  });

  it('UpdateBrandEventUseCase throws NOT_FOUND', async () => {
    brandEvents.findById.mockResolvedValue(null);
    await expect(
      new UpdateBrandEventUseCase(brandEvents as never).execute(20, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('GetBrandEventUseCase returns event', async () => {
    brandEvents.findById.mockResolvedValue(brandEvent);
    const result = await new GetBrandEventUseCase(brandEvents as never).execute(
      20,
    );
    expect(result.id).toBe(20);
  });

  it('GetBrandEventUseCase throws NOT_FOUND', async () => {
    brandEvents.findById.mockResolvedValue(null);
    await expect(
      new GetBrandEventUseCase(brandEvents as never).execute(20),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListBrandEventsUseCase maps paginated items', async () => {
    brandEvents.findAll.mockResolvedValue({
      items: [brandEvent],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });

    const result = await new ListBrandEventsUseCase(
      brandEvents as never,
    ).execute({ brandId: 2 });
    expect(result.items).toHaveLength(1);
  });

  it('DeleteBrandEventUseCase soft deletes', async () => {
    brandEvents.findById.mockResolvedValue(brandEvent);
    await new DeleteBrandEventUseCase(brandEvents as never).execute(20);
    expect(brandEvents.softDelete).toHaveBeenCalledWith(20);
  });

  it('DeleteBrandEventUseCase throws NOT_FOUND', async () => {
    brandEvents.findById.mockResolvedValue(null);
    await expect(
      new DeleteBrandEventUseCase(brandEvents as never).execute(20),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
