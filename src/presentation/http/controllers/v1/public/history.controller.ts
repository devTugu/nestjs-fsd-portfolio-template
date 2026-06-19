import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicHistoryUseCase } from '@application/history/use-cases/history.use-cases';

@ApiTags('History (Public) v1')
@Controller({ path: 'history', version: '1' })
export class HistoryPublicV1Controller {
  constructor(private readonly listPublicHistory: ListPublicHistoryUseCase) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published company history' })
  findAll() {
    return this.listPublicHistory.execute();
  }
}
