import { Module } from '@nestjs/common';
import { LeadershipPublicV1Controller } from '../controllers/v1/public/leadership.controller';
import { LeadershipAdminV1Controller } from '../controllers/v1/admin/leadership.controller';
import {
  CreateLeadershipMemberUseCase,
  DeleteLeadershipMemberUseCase,
  GetLeadershipMemberUseCase,
  ListLeadershipMembersUseCase,
  ListPublicLeadershipUseCase,
  UpdateLeadershipMemberUseCase,
} from '@application/leadership/use-cases/leadership.use-cases';

@Module({
  controllers: [LeadershipPublicV1Controller, LeadershipAdminV1Controller],
  providers: [
    CreateLeadershipMemberUseCase,
    UpdateLeadershipMemberUseCase,
    GetLeadershipMemberUseCase,
    ListLeadershipMembersUseCase,
    DeleteLeadershipMemberUseCase,
    ListPublicLeadershipUseCase,
  ],
})
export class LeadershipPresentationModule {}
