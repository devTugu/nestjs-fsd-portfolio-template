import { Inject, Injectable } from '@nestjs/common';
import { IBrandRepository } from '@domain/brand/repositories/brand.repository.interface';
import { IMenuItemRepository } from '@domain/brand/repositories/menu-item.repository.interface';
import { IBrandEventRepository } from '@domain/brand/repositories/brand-event.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  BRAND_EVENT_REPOSITORY,
  BRAND_REPOSITORY,
  MENU_ITEM_REPOSITORY,
} from '@shared/constants/tokens';
import { BrandType } from '@domain/brand/entities/brand-type';
import {
  BrandDetailOutput,
  BrandOutput,
  toBrandEventOutput,
  toBrandOutput,
  toMenuItemOutput,
} from '../dto/brand-output.mapper';
import { generateSlug, generateUniqueSlug } from '@shared/utils/generate-slug';
import type { LocalizedText } from '@shared/domain/localized-content';
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { PaginatedResult } from '@shared/types/pagination';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(input: {
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
  }): Promise<BrandOutput> {
    const slug = await this.resolveUniqueSlug(
      input.slug ?? generateSlug(input.name.en),
    );
    const brand = await this.brands.create({ ...input, slug });
    return toBrandOutput(brand);
  }

  private async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.brands.slugExists(slug)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(
    id: number,
    input: {
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
    },
  ): Promise<BrandOutput> {
    const existing = await this.brands.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Brand not found.');
    if (input.slug && input.slug !== existing.slug) {
      if (await this.brands.slugExists(input.slug, id)) {
        throw AppErrors.CONFLICT('Slug already exists.');
      }
    }
    const brand = await this.brands.update(id, input);
    return toBrandOutput(brand);
  }
}

@Injectable()
export class GetBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(id: number): Promise<BrandOutput> {
    const brand = await this.brands.findById(id);
    if (!brand) throw AppErrors.NOT_FOUND('Brand not found.');
    return toBrandOutput(brand);
  }
}

@Injectable()
export class ListBrandsUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    type?: BrandType;
  }): Promise<PaginatedResult<BrandOutput>> {
    const result = await this.brands.findAll(query);
    return {
      ...result,
      items: result.items.map(toBrandOutput),
    };
  }
}

@Injectable()
export class DeleteBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const brand = await this.brands.findById(id);
    if (!brand) throw AppErrors.NOT_FOUND('Brand not found.');
    await this.brands.softDelete(id);
  }
}

@Injectable()
export class ListPublicBrandsUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(type?: BrandType, limit?: number): Promise<BrandOutput[]> {
    const items = await this.brands.findAllPublished(type, limit);
    return items.map(toBrandOutput);
  }
}

@Injectable()
export class GetPublicBrandBySlugUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly menuItems: IMenuItemRepository,
    @Inject(BRAND_EVENT_REPOSITORY)
    private readonly brandEvents: IBrandEventRepository,
  ) {}

  async execute(slug: string): Promise<BrandDetailOutput> {
    const brand = await this.brands.findPublishedBySlug(slug);
    if (!brand) throw AppErrors.NOT_FOUND('Brand not found.');
    const output: BrandDetailOutput = toBrandOutput(brand);
    if (brand.type === BrandType.RESTAURANT) {
      const items = await this.menuItems.findPublishedByBrandId(brand.id);
      output.menuItems = items.map(toMenuItemOutput);
    } else {
      const events = await this.brandEvents.findPublishedByBrandId(brand.id);
      output.events = events.map(toBrandEventOutput);
    }
    return output;
  }
}
