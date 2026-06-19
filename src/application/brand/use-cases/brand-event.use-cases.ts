import { Inject, Injectable } from '@nestjs/common';
import { IBrandEventRepository } from '@domain/brand/repositories/brand-event.repository.interface';
import { IBrandRepository } from '@domain/brand/repositories/brand.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  BRAND_EVENT_REPOSITORY,
  BRAND_REPOSITORY,
} from '@shared/constants/tokens';
import {
  BrandEventOutput,
  toBrandEventOutput,
} from '../dto/brand-output.mapper';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

@Injectable()
export class CreateBrandEventUseCase {
  constructor(
    @Inject(BRAND_EVENT_REPOSITORY)
    private readonly brandEvents: IBrandEventRepository,
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
  ) {}

  async execute(input: {
    brandId: number;
    title: LocalizedText;
    description: LocalizedText;
    eventDate: Date;
    location: LocalizedText;
    imageUrl?: string | null;
    sortOrder?: number;
    isPublished?: boolean;
  }): Promise<BrandEventOutput> {
    const brand = await this.brands.findById(input.brandId);
    if (!brand) throw AppErrors.NOT_FOUND('Brand not found.');
    const event = await this.brandEvents.create(input);
    return toBrandEventOutput(event);
  }
}

@Injectable()
export class UpdateBrandEventUseCase {
  constructor(
    @Inject(BRAND_EVENT_REPOSITORY)
    private readonly brandEvents: IBrandEventRepository,
  ) {}

  async execute(
    id: number,
    input: {
      title?: LocalizedText;
      description?: LocalizedText;
      eventDate?: Date;
      location?: LocalizedText;
      imageUrl?: string | null;
      sortOrder?: number;
      isPublished?: boolean;
    },
  ): Promise<BrandEventOutput> {
    const existing = await this.brandEvents.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Brand event not found.');
    const event = await this.brandEvents.update(id, input);
    return toBrandEventOutput(event);
  }
}

@Injectable()
export class GetBrandEventUseCase {
  constructor(
    @Inject(BRAND_EVENT_REPOSITORY)
    private readonly brandEvents: IBrandEventRepository,
  ) {}

  async execute(id: number): Promise<BrandEventOutput> {
    const event = await this.brandEvents.findById(id);
    if (!event) throw AppErrors.NOT_FOUND('Brand event not found.');
    return toBrandEventOutput(event);
  }
}

@Injectable()
export class ListBrandEventsUseCase {
  constructor(
    @Inject(BRAND_EVENT_REPOSITORY)
    private readonly brandEvents: IBrandEventRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    brandId?: number;
  }): Promise<PaginatedResult<BrandEventOutput>> {
    const result = await this.brandEvents.findAll(query);
    return { ...result, items: result.items.map(toBrandEventOutput) };
  }
}

@Injectable()
export class DeleteBrandEventUseCase {
  constructor(
    @Inject(BRAND_EVENT_REPOSITORY)
    private readonly brandEvents: IBrandEventRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const event = await this.brandEvents.findById(id);
    if (!event) throw AppErrors.NOT_FOUND('Brand event not found.');
    await this.brandEvents.softDelete(id);
  }
}
