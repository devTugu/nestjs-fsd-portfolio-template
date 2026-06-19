import { BrandEvent } from '../entities/brand-event.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateBrandEventData {
  brandId: number;
  title: LocalizedText;
  description: LocalizedText;
  eventDate: Date;
  location: LocalizedText;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateBrandEventData {
  title?: LocalizedText;
  description?: LocalizedText;
  eventDate?: Date;
  location?: LocalizedText;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListBrandEventsQuery {
  page?: number;
  limit?: number;
  brandId?: number;
}

export interface IBrandEventRepository {
  create(data: CreateBrandEventData): Promise<BrandEvent>;
  findById(id: number): Promise<BrandEvent | null>;
  findAll(query: ListBrandEventsQuery): Promise<PaginatedResult<BrandEvent>>;
  findPublishedByBrandId(brandId: number): Promise<BrandEvent[]>;
  update(id: number, data: UpdateBrandEventData): Promise<BrandEvent>;
  softDelete(id: number): Promise<void>;
}
