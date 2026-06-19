import { Module } from '@nestjs/common';
import { BrandPublicV1Controller } from '../controllers/v1/public/brand.controller';
import { BrandAdminV1Controller } from '../controllers/v1/admin/brand.controller';
import {
  CreateBrandUseCase,
  DeleteBrandUseCase,
  GetBrandUseCase,
  GetPublicBrandBySlugUseCase,
  ListBrandsUseCase,
  ListPublicBrandsUseCase,
  UpdateBrandUseCase,
} from '@application/brand/use-cases/brand.use-cases';
import {
  CreateMenuItemUseCase,
  DeleteMenuItemUseCase,
  GetMenuItemUseCase,
  ListMenuItemsUseCase,
  UpdateMenuItemUseCase,
} from '@application/brand/use-cases/menu-item.use-cases';
import {
  CreateBrandEventUseCase,
  DeleteBrandEventUseCase,
  GetBrandEventUseCase,
  ListBrandEventsUseCase,
  UpdateBrandEventUseCase,
} from '@application/brand/use-cases/brand-event.use-cases';

@Module({
  controllers: [BrandPublicV1Controller, BrandAdminV1Controller],
  providers: [
    CreateBrandUseCase,
    UpdateBrandUseCase,
    GetBrandUseCase,
    ListBrandsUseCase,
    DeleteBrandUseCase,
    ListPublicBrandsUseCase,
    GetPublicBrandBySlugUseCase,
    CreateMenuItemUseCase,
    UpdateMenuItemUseCase,
    GetMenuItemUseCase,
    ListMenuItemsUseCase,
    DeleteMenuItemUseCase,
    CreateBrandEventUseCase,
    UpdateBrandEventUseCase,
    GetBrandEventUseCase,
    ListBrandEventsUseCase,
    DeleteBrandEventUseCase,
  ],
})
export class BrandPresentationModule {}
