import { Module } from '@nestjs/common';
import { TeamPublicV1Controller } from '../controllers/v1/public/team.controller';
import { TeamAdminV1Controller } from '../controllers/v1/admin/team.controller';
import {
  CreateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  GetTeamMemberUseCase,
  ListPublicTeamUseCase,
  ListTeamMembersUseCase,
  UpdateTeamMemberUseCase,
} from '@application/team/use-cases/team.use-cases';

@Module({
  controllers: [TeamPublicV1Controller, TeamAdminV1Controller],
  providers: [
    CreateTeamMemberUseCase,
    UpdateTeamMemberUseCase,
    GetTeamMemberUseCase,
    ListTeamMembersUseCase,
    DeleteTeamMemberUseCase,
    ListPublicTeamUseCase,
  ],
})
export class TeamPresentationModule {}
