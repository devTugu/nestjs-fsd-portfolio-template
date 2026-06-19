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
  CreateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  GetTeamMemberUseCase,
  ListTeamMembersUseCase,
  UpdateTeamMemberUseCase,
} from '@application/team/use-cases/team.use-cases';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateTeamMemberDto,
  ListTeamMembersQueryDto,
  UpdateTeamMemberDto,
} from '../../../dto/v1/team.dto';

@ApiTags('Team (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/team', version: '1' })
export class TeamAdminV1Controller {
  constructor(
    private readonly createTeam: CreateTeamMemberUseCase,
    private readonly listTeam: ListTeamMembersUseCase,
    private readonly getTeam: GetTeamMemberUseCase,
    private readonly updateTeam: UpdateTeamMemberUseCase,
    private readonly deleteTeam: DeleteTeamMemberUseCase,
  ) {}

  @Post()
  @Permissions('TEAM_CREATE')
  create(@Body() dto: CreateTeamMemberDto) {
    return this.createTeam.execute(dto);
  }

  @Get()
  @Permissions('TEAM_READ')
  findAll(@Query() query: ListTeamMembersQueryDto) {
    return this.listTeam.execute(query);
  }

  @Get(':id')
  @Permissions('TEAM_READ')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getTeam.execute(id);
  }

  @Patch(':id')
  @Permissions('TEAM_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamMemberDto,
  ) {
    return this.updateTeam.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('TEAM_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteTeam.execute(id);
  }
}
