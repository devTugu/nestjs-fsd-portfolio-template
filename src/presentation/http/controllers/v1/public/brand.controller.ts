import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import {
  GetPublicBrandBySlugUseCase,
  ListPublicBrandsUseCase,
} from '@application/brand/use-cases/brand.use-cases';
import { ListPublicBrandsQueryDto } from '../../../dto/v1/brand.dto';

@ApiTags('Brands (Public) v1')
@Controller({ path: 'brands', version: '1' })
export class BrandPublicV1Controller {
  constructor(
    private readonly listPublicBrands: ListPublicBrandsUseCase,
    private readonly getPublicBrand: GetPublicBrandBySlugUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published brands' })
  findAll(@Query() query: ListPublicBrandsQueryDto) {
    return this.listPublicBrands.execute(query.type, query.limit);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get published brand by slug with menu/events' })
  findOne(@Param('slug') slug: string) {
    return this.getPublicBrand.execute(slug);
  }
}
