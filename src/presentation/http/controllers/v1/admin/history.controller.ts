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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateHistoryEntryUseCase,
  DeleteHistoryEntryUseCase,
  GetHistoryEntryUseCase,
  ListHistoryEntriesUseCase,
  UpdateHistoryEntryUseCase,
} from '@application/history/use-cases/history.use-cases';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateHistoryEntryDto,
  ListHistoryEntriesQueryDto,
  UpdateHistoryEntryDto,
} from '../../../dto/v1/history.dto';

@ApiTags('History (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/history', version: '1' })
export class HistoryAdminV1Controller {
  constructor(
    private readonly createHistory: CreateHistoryEntryUseCase,
    private readonly listHistory: ListHistoryEntriesUseCase,
    private readonly getHistory: GetHistoryEntryUseCase,
    private readonly updateHistory: UpdateHistoryEntryUseCase,
    private readonly deleteHistory: DeleteHistoryEntryUseCase,
  ) {}

  @Post()
  @Permissions('HISTORY_CREATE')
  create(@Body() dto: CreateHistoryEntryDto) {
    return this.createHistory.execute(dto);
  }

  @Get()
  @Permissions('HISTORY_READ')
  findAll(@Query() query: ListHistoryEntriesQueryDto) {
    return this.listHistory.execute(query);
  }

  @Get(':id')
  @Permissions('HISTORY_READ')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getHistory.execute(id);
  }

  @Patch(':id')
  @Permissions('HISTORY_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHistoryEntryDto,
  ) {
    return this.updateHistory.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('HISTORY_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteHistory.execute(id);
  }
}
