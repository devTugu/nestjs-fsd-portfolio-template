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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateSkillUseCase,
  DeleteSkillUseCase,
  GetSkillUseCase,
  ListSkillsUseCase,
  UpdateSkillUseCase,
} from '@application/skill/use-cases/skill.use-cases';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateSkillDto,
  ListSkillsQueryDto,
  UpdateSkillDto,
} from '../../../dto/v1/skill.dto';

@ApiTags('Skills (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/skills', version: '1' })
export class SkillAdminV1Controller {
  constructor(
    private readonly createSkill: CreateSkillUseCase,
    private readonly listSkills: ListSkillsUseCase,
    private readonly getSkill: GetSkillUseCase,
    private readonly updateSkill: UpdateSkillUseCase,
    private readonly deleteSkill: DeleteSkillUseCase,
  ) {}

  @Post()
  @Permissions('SKILL_CREATE')
  @ApiOperation({ summary: 'Create skill' })
  create(@Body() dto: CreateSkillDto) {
    return this.createSkill.execute(dto);
  }

  @Get()
  @Permissions('SKILL_READ')
  @ApiOperation({ summary: 'List skills' })
  findAll(@Query() query: ListSkillsQueryDto) {
    return this.listSkills.execute(query);
  }

  @Get(':id')
  @Permissions('SKILL_READ')
  @ApiOperation({ summary: 'Get skill by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getSkill.execute(id);
  }

  @Patch(':id')
  @Permissions('SKILL_UPDATE')
  @ApiOperation({ summary: 'Update skill' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkillDto) {
    return this.updateSkill.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('SKILL_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteSkill.execute(id);
  }
}
