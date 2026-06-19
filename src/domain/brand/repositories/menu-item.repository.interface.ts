import { MenuItem } from '../entities/menu-item.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateMenuItemData {
  brandId: number;
  category: LocalizedText;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  imageUrl?: string | null;
  isAvailable?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateMenuItemData {
  category?: LocalizedText;
  name?: LocalizedText;
  description?: LocalizedText;
  price?: number;
  imageUrl?: string | null;
  isAvailable?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListMenuItemsQuery {
  page?: number;
  limit?: number;
  brandId?: number;
}

export interface IMenuItemRepository {
  create(data: CreateMenuItemData): Promise<MenuItem>;
  findById(id: number): Promise<MenuItem | null>;
  findAll(query: ListMenuItemsQuery): Promise<PaginatedResult<MenuItem>>;
  findPublishedByBrandId(brandId: number): Promise<MenuItem[]>;
  update(id: number, data: UpdateMenuItemData): Promise<MenuItem>;
  softDelete(id: number): Promise<void>;
}
