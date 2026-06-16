import { Module } from '@nestjs/common';
import { SkillPublicV1Controller } from '../controllers/v1/public/skill.controller';
import { SkillAdminV1Controller } from '../controllers/v1/admin/skill.controller';
import {
  CreateSkillUseCase,
  DeleteSkillUseCase,
  GetSkillUseCase,
  ListPublicSkillsUseCase,
  ListSkillsUseCase,
  UpdateSkillUseCase,
} from '@application/skill/use-cases/skill.use-cases';

@Module({
  controllers: [SkillPublicV1Controller, SkillAdminV1Controller],
  providers: [
    CreateSkillUseCase,
    ListSkillsUseCase,
    GetSkillUseCase,
    UpdateSkillUseCase,
    DeleteSkillUseCase,
    ListPublicSkillsUseCase,
  ],
})
export class SkillPresentationModule {}
