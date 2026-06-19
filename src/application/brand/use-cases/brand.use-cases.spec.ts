import { Brand } from '@domain/brand/entities/brand.entity';
import { BrandEvent } from '@domain/brand/entities/brand-event.entity';
import { MenuItem } from '@domain/brand/entities/menu-item.entity';
import { BrandType } from '@domain/brand/entities/brand-type';
import { localizedText } from '@shared/domain/localized-content';
import {
  CreateBrandUseCase,
  DeleteBrandUseCase,
  GetBrandUseCase,
  GetPublicBrandBySlugUseCase,
  ListBrandsUseCase,
  ListPublicBrandsUseCase,
  UpdateBrandUseCase,
} from './brand.use-cases';

describe('Brand use cases', () => {
  const now = new Date();

  const brand = new Brand(
    1,
    'demo-restaurant',
    BrandType.RESTAURANT,
    localizedText('Demo Restaurant', 'Demo Restaurant'),
    localizedText('Description', 'Description'),
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

  const eventBrand = new Brand(
    2,
    'demo-event',
    BrandType.EVENT,
    localizedText('Demo Event', 'Demo Event'),
    localizedText('Event desc', 'Event desc'),
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

  const menuItem = new MenuItem(
    10,
    1,
    localizedText('Main', 'Main'),
    localizedText('Burger', 'Burger'),
    localizedText('Tasty', 'Tasty'),
    12.5,
    null,
    true,
    0,
    true,
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

  const brands = {
    findById: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    slugExists: jest.fn(),
  };

  const menuItems = {
    findPublishedByBrandId: jest.fn(),
  };

  const brandEvents = {
    findPublishedByBrandId: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('CreateBrandUseCase generates slug from name', async () => {
    brands.slugExists.mockResolvedValue(false);
    brands.create.mockResolvedValue(brand);

    const result = await new CreateBrandUseCase(brands as never).execute({
      type: BrandType.RESTAURANT,
      name: localizedText('Demo Restaurant', 'Demo Restaurant'),
      description: localizedText('Description', 'Description'),
    });

    expect(result.slug).toBe('demo-restaurant');
    expect(brands.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'demo-restaurant' }),
    );
  });

  it('CreateBrandUseCase resolves slug collision', async () => {
    brands.slugExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    brands.create.mockResolvedValue({ ...brand, slug: 'demo-restaurant-1' });

    await new CreateBrandUseCase(brands as never).execute({
      type: BrandType.RESTAURANT,
      name: localizedText('Demo Restaurant', 'Demo Restaurant'),
      description: localizedText('Description', 'Description'),
    });

    expect(brands.slugExists).toHaveBeenCalledTimes(2);
    expect(brands.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'demo-restaurant-1' }),
    );
  });

  it('UpdateBrandUseCase updates brand', async () => {
    brands.findById.mockResolvedValue(brand);
    brands.slugExists.mockResolvedValue(false);
    brands.update.mockResolvedValue({
      ...brand,
      name: localizedText('Updated', 'Updated'),
    });

    const result = await new UpdateBrandUseCase(brands as never).execute(1, {
      name: localizedText('Updated', 'Updated'),
    });

    expect(result.name.en).toBe('Updated');
  });

  it('UpdateBrandUseCase throws NOT_FOUND', async () => {
    brands.findById.mockResolvedValue(null);
    await expect(
      new UpdateBrandUseCase(brands as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('UpdateBrandUseCase throws CONFLICT on slug', async () => {
    brands.findById.mockResolvedValue(brand);
    brands.slugExists.mockResolvedValue(true);
    await expect(
      new UpdateBrandUseCase(brands as never).execute(1, { slug: 'taken' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('GetBrandUseCase returns brand', async () => {
    brands.findById.mockResolvedValue(brand);
    const result = await new GetBrandUseCase(brands as never).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetBrandUseCase throws NOT_FOUND', async () => {
    brands.findById.mockResolvedValue(null);
    await expect(
      new GetBrandUseCase(brands as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListBrandsUseCase maps paginated items', async () => {
    brands.findAll.mockResolvedValue({
      items: [brand],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });

    const result = await new ListBrandsUseCase(brands as never).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('DeleteBrandUseCase soft deletes', async () => {
    brands.findById.mockResolvedValue(brand);
    await new DeleteBrandUseCase(brands as never).execute(1);
    expect(brands.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeleteBrandUseCase throws NOT_FOUND', async () => {
    brands.findById.mockResolvedValue(null);
    await expect(
      new DeleteBrandUseCase(brands as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListPublicBrandsUseCase calls findAllPublished', async () => {
    brands.findAllPublished.mockResolvedValue([brand]);
    const result = await new ListPublicBrandsUseCase(brands as never).execute(
      BrandType.RESTAURANT,
      5,
    );
    expect(result).toHaveLength(1);
    expect(brands.findAllPublished).toHaveBeenCalledWith(
      BrandType.RESTAURANT,
      5,
    );
  });

  it('GetPublicBrandBySlugUseCase returns menu items for restaurant', async () => {
    brands.findPublishedBySlug.mockResolvedValue(brand);
    menuItems.findPublishedByBrandId.mockResolvedValue([menuItem]);

    const result = await new GetPublicBrandBySlugUseCase(
      brands as never,
      menuItems as never,
      brandEvents as never,
    ).execute('demo-restaurant');

    expect(result.menuItems).toHaveLength(1);
    expect(result.events).toBeUndefined();
  });

  it('GetPublicBrandBySlugUseCase returns events for event brand', async () => {
    brands.findPublishedBySlug.mockResolvedValue(eventBrand);
    brandEvents.findPublishedByBrandId.mockResolvedValue([brandEvent]);

    const result = await new GetPublicBrandBySlugUseCase(
      brands as never,
      menuItems as never,
      brandEvents as never,
    ).execute('demo-event');

    expect(result.events).toHaveLength(1);
    expect(result.menuItems).toBeUndefined();
  });

  it('GetPublicBrandBySlugUseCase throws NOT_FOUND', async () => {
    brands.findPublishedBySlug.mockResolvedValue(null);
    await expect(
      new GetPublicBrandBySlugUseCase(
        brands as never,
        menuItems as never,
        brandEvents as never,
      ).execute('missing'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
