import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateBrandUseCase,
  DeleteBrandUseCase,
  GetBrandUseCase,
  ListBrandsUseCase,
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
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateBrandDto,
  CreateBrandEventDto,
  CreateMenuItemDto,
  ListBrandEventsQueryDto,
  ListBrandsQueryDto,
  ListMenuItemsQueryDto,
  UpdateBrandDto,
  UpdateBrandEventDto,
  UpdateMenuItemDto,
} from '../../../dto/v1/brand.dto';

@ApiTags('Brands (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ version: '1' })
export class BrandAdminV1Controller {
  constructor(
    private readonly createBrand: CreateBrandUseCase,
    private readonly listBrands: ListBrandsUseCase,
    private readonly getBrand: GetBrandUseCase,
    private readonly updateBrand: UpdateBrandUseCase,
    private readonly deleteBrand: DeleteBrandUseCase,
    private readonly createMenuItem: CreateMenuItemUseCase,
    private readonly listMenuItems: ListMenuItemsUseCase,
    private readonly getMenuItem: GetMenuItemUseCase,
    private readonly updateMenuItem: UpdateMenuItemUseCase,
    private readonly deleteMenuItem: DeleteMenuItemUseCase,
    private readonly createBrandEvent: CreateBrandEventUseCase,
    private readonly listBrandEvents: ListBrandEventsUseCase,
    private readonly getBrandEvent: GetBrandEventUseCase,
    private readonly updateBrandEvent: UpdateBrandEventUseCase,
    private readonly deleteBrandEvent: DeleteBrandEventUseCase,
  ) {}

  @Post('admin/brands')
  @Permissions('BRAND_CREATE')
  @ApiOperation({ summary: 'Create brand' })
  create(@Body() dto: CreateBrandDto) {
    return this.createBrand.execute(dto);
  }

  @Get('admin/brands')
  @Permissions('BRAND_READ')
  @ApiOperation({ summary: 'List brands' })
  findAll(@Query() query: ListBrandsQueryDto) {
    return this.listBrands.execute(query);
  }

  @Post('admin/menu-items')
  @Permissions('BRAND_UPDATE')
  @ApiOperation({ summary: 'Create menu item' })
  createMenu(@Body() dto: CreateMenuItemDto) {
    return this.createMenuItem.execute(dto);
  }

  @Get('admin/menu-items')
  @Permissions('BRAND_READ')
  @ApiOperation({ summary: 'List menu items' })
  listMenu(@Query() query: ListMenuItemsQueryDto) {
    return this.listMenuItems.execute(query);
  }

  @Get('admin/menu-items/:id')
  @Permissions('BRAND_READ')
  @ApiOperation({ summary: 'Get menu item' })
  getMenu(@Param('id', ParseIntPipe) id: number) {
    return this.getMenuItem.execute(id);
  }

  @Patch('admin/menu-items/:id')
  @Permissions('BRAND_UPDATE')
  @ApiOperation({ summary: 'Update menu item' })
  updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.updateMenuItem.execute(id, dto);
  }

  @Delete('admin/menu-items/:id')
  @Permissions('BRAND_UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete menu item' })
  async removeMenu(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteMenuItem.execute(id);
  }

  @Post('admin/brand-events')
  @Permissions('BRAND_UPDATE')
  @ApiOperation({ summary: 'Create brand event' })
  createEvent(@Body() dto: CreateBrandEventDto) {
    return this.createBrandEvent.execute(dto);
  }

  @Get('admin/brand-events')
  @Permissions('BRAND_READ')
  @ApiOperation({ summary: 'List brand events' })
  listEvents(@Query() query: ListBrandEventsQueryDto) {
    return this.listBrandEvents.execute(query);
  }

  @Get('admin/brand-events/:id')
  @Permissions('BRAND_READ')
  @ApiOperation({ summary: 'Get brand event' })
  getEvent(@Param('id', ParseIntPipe) id: number) {
    return this.getBrandEvent.execute(id);
  }

  @Patch('admin/brand-events/:id')
  @Permissions('BRAND_UPDATE')
  @ApiOperation({ summary: 'Update brand event' })
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandEventDto,
  ) {
    return this.updateBrandEvent.execute(id, dto);
  }

  @Delete('admin/brand-events/:id')
  @Permissions('BRAND_UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete brand event' })
  async removeEvent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteBrandEvent.execute(id);
  }

  @Get('admin/brands/:id')
  @Permissions('BRAND_READ')
  @ApiOperation({ summary: 'Get brand by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getBrand.execute(id);
  }

  @Patch('admin/brands/:id')
  @Permissions('BRAND_UPDATE')
  @ApiOperation({ summary: 'Update brand' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
    return this.updateBrand.execute(id, dto);
  }

  @Delete('admin/brands/:id')
  @Permissions('BRAND_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete brand' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteBrand.execute(id);
  }
}
