import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicLeadershipUseCase } from '@application/leadership/use-cases/leadership.use-cases';

@ApiTags('Leadership (Public) v1')
@Controller({ path: 'leadership', version: '1' })
export class LeadershipPublicV1Controller {
  constructor(
    private readonly listPublicLeadership: ListPublicLeadershipUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published leadership members' })
  findAll() {
    return this.listPublicLeadership.execute();
  }
}
