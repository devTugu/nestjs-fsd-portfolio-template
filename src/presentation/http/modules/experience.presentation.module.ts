import { Module } from '@nestjs/common';
import { ExperiencePublicV1Controller } from '../controllers/v1/public/experience.controller';
import { ExperienceAdminV1Controller } from '../controllers/v1/admin/experience.controller';
import {
  CreateExperienceUseCase,
  DeleteExperienceUseCase,
  GetExperienceUseCase,
  ListExperiencesUseCase,
  ListPublicExperiencesUseCase,
  UpdateExperienceUseCase,
} from '@application/experience/use-cases/experience.use-cases';

@Module({
  controllers: [ExperiencePublicV1Controller, ExperienceAdminV1Controller],
  providers: [
    CreateExperienceUseCase,
    ListExperiencesUseCase,
    GetExperienceUseCase,
    UpdateExperienceUseCase,
    DeleteExperienceUseCase,
    ListPublicExperiencesUseCase,
  ],
})
export class ExperiencePresentationModule {}
