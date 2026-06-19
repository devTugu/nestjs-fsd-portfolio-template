import { Brand } from '@domain/brand/entities/brand.entity';
import { MenuItem } from '@domain/brand/entities/menu-item.entity';
import { BrandType } from '@domain/brand/entities/brand-type';
import { localizedText } from '@shared/domain/localized-content';
import {
  CreateMenuItemUseCase,
  DeleteMenuItemUseCase,
  GetMenuItemUseCase,
  ListMenuItemsUseCase,
  UpdateMenuItemUseCase,
} from './menu-item.use-cases';

describe('Menu item use cases', () => {
  const now = new Date();

  const brand = new Brand(
    1,
    'demo-restaurant',
    BrandType.RESTAURANT,
    localizedText('Demo', 'Demo'),
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

  const menuItems = {
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

  it('CreateMenuItemUseCase creates item', async () => {
    brands.findById.mockResolvedValue(brand);
    menuItems.create.mockResolvedValue(menuItem);

    const result = await new CreateMenuItemUseCase(
      menuItems as never,
      brands as never,
    ).execute({
      brandId: 1,
      category: localizedText('Main', 'Main'),
      name: localizedText('Burger', 'Burger'),
      description: localizedText('Tasty', 'Tasty'),
      price: 12.5,
    });

    expect(result.id).toBe(10);
  });

  it('CreateMenuItemUseCase throws when brand missing', async () => {
    brands.findById.mockResolvedValue(null);
    await expect(
      new CreateMenuItemUseCase(menuItems as never, brands as never).execute({
        brandId: 99,
        category: localizedText('Main', 'Main'),
        name: localizedText('Burger', 'Burger'),
        description: localizedText('Tasty', 'Tasty'),
        price: 12.5,
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('UpdateMenuItemUseCase updates item', async () => {
    menuItems.findById.mockResolvedValue(menuItem);
    menuItems.update.mockResolvedValue({
      ...menuItem,
      price: 15,
    });

    const result = await new UpdateMenuItemUseCase(menuItems as never).execute(
      10,
      { price: 15 },
    );

    expect(result.price).toBe(15);
  });

  it('UpdateMenuItemUseCase throws NOT_FOUND', async () => {
    menuItems.findById.mockResolvedValue(null);
    await expect(
      new UpdateMenuItemUseCase(menuItems as never).execute(10, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('GetMenuItemUseCase returns item', async () => {
    menuItems.findById.mockResolvedValue(menuItem);
    const result = await new GetMenuItemUseCase(menuItems as never).execute(10);
    expect(result.id).toBe(10);
  });

  it('GetMenuItemUseCase throws NOT_FOUND', async () => {
    menuItems.findById.mockResolvedValue(null);
    await expect(
      new GetMenuItemUseCase(menuItems as never).execute(10),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListMenuItemsUseCase maps paginated items', async () => {
    menuItems.findAll.mockResolvedValue({
      items: [menuItem],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });

    const result = await new ListMenuItemsUseCase(menuItems as never).execute({
      brandId: 1,
    });
    expect(result.items).toHaveLength(1);
  });

  it('DeleteMenuItemUseCase soft deletes', async () => {
    menuItems.findById.mockResolvedValue(menuItem);
    await new DeleteMenuItemUseCase(menuItems as never).execute(10);
    expect(menuItems.softDelete).toHaveBeenCalledWith(10);
  });

  it('DeleteMenuItemUseCase throws NOT_FOUND', async () => {
    menuItems.findById.mockResolvedValue(null);
    await expect(
      new DeleteMenuItemUseCase(menuItems as never).execute(10),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
