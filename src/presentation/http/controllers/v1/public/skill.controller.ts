import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicSkillsUseCase } from '@application/skill/use-cases/skill.use-cases';
import { ListPublicSkillsQueryDto } from '../../../dto/v1/skill.dto';

@ApiTags('Skills (Public) v1')
@Controller({ path: 'skills', version: '1' })
export class SkillPublicV1Controller {
  constructor(private readonly listPublicSkills: ListPublicSkillsUseCase) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published skills' })
  findAll(@Query() query: ListPublicSkillsQueryDto) {
    return this.listPublicSkills.execute(query.category);
  }
}
