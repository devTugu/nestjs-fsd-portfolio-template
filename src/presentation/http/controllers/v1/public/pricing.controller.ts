import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { GetPublicPricingUseCase } from '@application/pricing/use-cases/get-public-pricing.use-case';

@ApiTags('Pricing (Public) v1')
@Controller({ path: 'pricing', version: '1' })
export class PricingPublicV1Controller {
  constructor(private readonly getPublicPricing: GetPublicPricingUseCase) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get published pricing plans and feature comparison',
  })
  findAll() {
    return this.getPublicPricing.execute();
  }
}
