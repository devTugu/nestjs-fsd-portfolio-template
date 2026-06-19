import { Brand } from '../entities/brand.entity';
import { BrandType } from '../entities/brand-type';
import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateBrandData {
  slug?: string;
  type: BrandType;
  name: LocalizedText;
  description: LocalizedText;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  address?: LocalizedText | null;
  phone?: string | null;
  mapEmbed?: string | null;
  socialLinks?: SocialLink[];
  workHours?: LocalizedText | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateBrandData {
  slug?: string;
  type?: BrandType;
  name?: LocalizedText;
  description?: LocalizedText;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  address?: LocalizedText | null;
  phone?: string | null;
  mapEmbed?: string | null;
  socialLinks?: SocialLink[];
  workHours?: LocalizedText | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListBrandsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: BrandType;
}

export interface IBrandRepository {
  create(data: CreateBrandData): Promise<Brand>;
  findById(id: number): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  findPublishedBySlug(slug: string): Promise<Brand | null>;
  findAll(query: ListBrandsQuery): Promise<PaginatedResult<Brand>>;
  findAllPublished(type?: BrandType, limit?: number): Promise<Brand[]>;
  update(id: number, data: UpdateBrandData): Promise<Brand>;
  softDelete(id: number): Promise<void>;
  slugExists(slug: string, excludeId?: number): Promise<boolean>;
}
