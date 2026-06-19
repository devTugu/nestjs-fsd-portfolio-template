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
  CreateLeadershipMemberUseCase,
  DeleteLeadershipMemberUseCase,
  GetLeadershipMemberUseCase,
  ListLeadershipMembersUseCase,
  UpdateLeadershipMemberUseCase,
} from '@application/leadership/use-cases/leadership.use-cases';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateLeadershipMemberDto,
  ListLeadershipMembersQueryDto,
  UpdateLeadershipMemberDto,
} from '../../../dto/v1/leadership.dto';

@ApiTags('Leadership (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/leadership', version: '1' })
export class LeadershipAdminV1Controller {
  constructor(
    private readonly createLeadership: CreateLeadershipMemberUseCase,
    private readonly listLeadership: ListLeadershipMembersUseCase,
    private readonly getLeadership: GetLeadershipMemberUseCase,
    private readonly updateLeadership: UpdateLeadershipMemberUseCase,
    private readonly deleteLeadership: DeleteLeadershipMemberUseCase,
  ) {}

  @Post()
  @Permissions('LEADERSHIP_CREATE')
  create(@Body() dto: CreateLeadershipMemberDto) {
    return this.createLeadership.execute(dto);
  }

  @Get()
  @Permissions('LEADERSHIP_READ')
  findAll(@Query() query: ListLeadershipMembersQueryDto) {
    return this.listLeadership.execute(query);
  }

  @Get(':id')
  @Permissions('LEADERSHIP_READ')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getLeadership.execute(id);
  }

  @Patch(':id')
  @Permissions('LEADERSHIP_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLeadershipMemberDto,
  ) {
    return this.updateLeadership.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('LEADERSHIP_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteLeadership.execute(id);
  }
}
