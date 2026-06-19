import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicTeamUseCase } from '@application/team/use-cases/team.use-cases';

@ApiTags('Team (Public) v1')
@Controller({ path: 'team', version: '1' })
export class TeamPublicV1Controller {
  constructor(private readonly listPublicTeam: ListPublicTeamUseCase) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published team members' })
  findAll() {
    return this.listPublicTeam.execute();
  }
}
