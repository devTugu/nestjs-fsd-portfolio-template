import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicExperiencesUseCase } from '@application/experience/use-cases/experience.use-cases';

@ApiTags('Experiences (Public) v1')
@Controller({ path: 'experiences', version: '1' })
export class ExperiencePublicV1Controller {
  constructor(
    private readonly listPublicExperiences: ListPublicExperiencesUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published experiences' })
  findAll() {
    return this.listPublicExperiences.execute();
  }
}
