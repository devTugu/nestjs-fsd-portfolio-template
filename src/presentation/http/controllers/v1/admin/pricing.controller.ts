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
import { CreatePricingPlanUseCase } from '@application/pricing/use-cases/create-pricing-plan.use-case';
import { ListPricingPlansUseCase } from '@application/pricing/use-cases/list-pricing-plans.use-case';
import { GetPricingPlanUseCase } from '@application/pricing/use-cases/get-pricing-plan.use-case';
import { UpdatePricingPlanUseCase } from '@application/pricing/use-cases/update-pricing-plan.use-case';
import { DeletePricingPlanUseCase } from '@application/pricing/use-cases/delete-pricing-plan.use-case';
import { CreatePricingFeatureRowUseCase } from '@application/pricing/use-cases/create-pricing-feature-row.use-case';
import { ListPricingFeatureRowsUseCase } from '@application/pricing/use-cases/list-pricing-feature-rows.use-case';
import { GetPricingFeatureRowUseCase } from '@application/pricing/use-cases/get-pricing-feature-row.use-case';
import { UpdatePricingFeatureRowUseCase } from '@application/pricing/use-cases/update-pricing-feature-row.use-case';
import { DeletePricingFeatureRowUseCase } from '@application/pricing/use-cases/delete-pricing-feature-row.use-case';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreatePricingPlanDto,
  CreatePricingFeatureRowDto,
  ListPricingFeatureRowsQueryDto,
  ListPricingPlansQueryDto,
  UpdatePricingPlanDto,
  UpdatePricingFeatureRowDto,
} from '../../../dto/v1/pricing.dto';

@ApiTags('Pricing Plans (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/pricing/plans', version: '1' })
export class PricingPlanAdminV1Controller {
  constructor(
    private readonly createPricingPlan: CreatePricingPlanUseCase,
    private readonly listPricingPlans: ListPricingPlansUseCase,
    private readonly getPricingPlan: GetPricingPlanUseCase,
    private readonly updatePricingPlan: UpdatePricingPlanUseCase,
    private readonly deletePricingPlan: DeletePricingPlanUseCase,
  ) {}

  @Post()
  @Permissions('PRICING_CREATE')
  @ApiOperation({ summary: 'Create pricing plan' })
  create(@Body() dto: CreatePricingPlanDto) {
    return this.createPricingPlan.execute(dto);
  }

  @Get()
  @Permissions('PRICING_READ')
  @ApiOperation({ summary: 'List all pricing plans (admin)' })
  findAll(@Query() query: ListPricingPlansQueryDto) {
    return this.listPricingPlans.execute(query);
  }

  @Get(':id')
  @Permissions('PRICING_READ')
  @ApiOperation({ summary: 'Get pricing plan by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getPricingPlan.execute(id);
  }

  @Patch(':id')
  @Permissions('PRICING_UPDATE')
  @ApiOperation({ summary: 'Update pricing plan' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePricingPlanDto,
  ) {
    return this.updatePricingPlan.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('PRICING_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete pricing plan' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deletePricingPlan.execute(id);
  }
}

@ApiTags('Pricing Feature Rows (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/pricing/feature-rows', version: '1' })
export class PricingFeatureRowAdminV1Controller {
  constructor(
    private readonly createFeatureRow: CreatePricingFeatureRowUseCase,
    private readonly listFeatureRows: ListPricingFeatureRowsUseCase,
    private readonly getFeatureRow: GetPricingFeatureRowUseCase,
    private readonly updateFeatureRow: UpdatePricingFeatureRowUseCase,
    private readonly deleteFeatureRow: DeletePricingFeatureRowUseCase,
  ) {}

  @Post()
  @Permissions('PRICING_CREATE')
  @ApiOperation({ summary: 'Create pricing feature row' })
  create(@Body() dto: CreatePricingFeatureRowDto) {
    return this.createFeatureRow.execute(dto);
  }

  @Get()
  @Permissions('PRICING_READ')
  @ApiOperation({ summary: 'List pricing feature rows (admin)' })
  findAll(@Query() query: ListPricingFeatureRowsQueryDto) {
    return this.listFeatureRows.execute(query);
  }

  @Get(':id')
  @Permissions('PRICING_READ')
  @ApiOperation({ summary: 'Get pricing feature row by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getFeatureRow.execute(id);
  }

  @Patch(':id')
  @Permissions('PRICING_UPDATE')
  @ApiOperation({ summary: 'Update pricing feature row' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePricingFeatureRowDto,
  ) {
    return this.updateFeatureRow.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('PRICING_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete pricing feature row' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteFeatureRow.execute(id);
  }
}
