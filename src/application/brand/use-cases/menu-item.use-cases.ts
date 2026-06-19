import { Inject, Injectable } from '@nestjs/common';
import { IMenuItemRepository } from '@domain/brand/repositories/menu-item.repository.interface';
import { IBrandRepository } from '@domain/brand/repositories/brand.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  BRAND_REPOSITORY,
  MENU_ITEM_REPOSITORY,
} from '@shared/constants/tokens';
import { MenuItemOutput, toMenuItemOutput } from '../dto/brand-output.mapper';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

@Injectable()
export class CreateMenuItemUseCase {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly menuItems: IMenuItemRepository,
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(input: {
    brandId: number;
    category: LocalizedText;
    name: LocalizedText;
    description: LocalizedText;
    price: number;
    imageUrl?: string | null;
    isAvailable?: boolean;
    sortOrder?: number;
    isPublished?: boolean;
  }): Promise<MenuItemOutput> {
    const brand = await this.brands.findById(input.brandId);
    if (!brand) throw AppErrors.NOT_FOUND('Brand not found.');
    const item = await this.menuItems.create(input);
    return toMenuItemOutput(item);
  }
}

@Injectable()
export class UpdateMenuItemUseCase {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly menuItems: IMenuItemRepository,
  ) {}

  async execute(
    id: number,
    input: {
      category?: LocalizedText;
      name?: LocalizedText;
      description?: LocalizedText;
      price?: number;
      imageUrl?: string | null;
      isAvailable?: boolean;
      sortOrder?: number;
      isPublished?: boolean;
    },
  ): Promise<MenuItemOutput> {
    const existing = await this.menuItems.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Menu item not found.');
    const item = await this.menuItems.update(id, input);
    return toMenuItemOutput(item);
  }
}

@Injectable()
export class GetMenuItemUseCase {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly menuItems: IMenuItemRepository,
  ) {}

  async execute(id: number): Promise<MenuItemOutput> {
    const item = await this.menuItems.findById(id);
    if (!item) throw AppErrors.NOT_FOUND('Menu item not found.');
    return toMenuItemOutput(item);
  }
}

@Injectable()
export class ListMenuItemsUseCase {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly menuItems: IMenuItemRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    brandId?: number;
  }): Promise<PaginatedResult<MenuItemOutput>> {
    const result = await this.menuItems.findAll(query);
    return { ...result, items: result.items.map(toMenuItemOutput) };
  }
}

@Injectable()
export class DeleteMenuItemUseCase {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly menuItems: IMenuItemRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const item = await this.menuItems.findById(id);
    if (!item) throw AppErrors.NOT_FOUND('Menu item not found.');
    await this.menuItems.softDelete(id);
  }
}
