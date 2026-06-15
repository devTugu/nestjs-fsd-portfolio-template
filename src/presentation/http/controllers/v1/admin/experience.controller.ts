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
  CreateExperienceUseCase,
  DeleteExperienceUseCase,
  GetExperienceUseCase,
  ListExperiencesUseCase,
  UpdateExperienceUseCase,
} from '@application/experience/use-cases/experience.use-cases';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateExperienceDto,
  ListExperiencesQueryDto,
  UpdateExperienceDto,
} from '../../../dto/v1/experience.dto';

@ApiTags('Experiences (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/experiences', version: '1' })
export class ExperienceAdminV1Controller {
  constructor(
    private readonly createExperience: CreateExperienceUseCase,
    private readonly listExperiences: ListExperiencesUseCase,
    private readonly getExperience: GetExperienceUseCase,
    private readonly updateExperience: UpdateExperienceUseCase,
    private readonly deleteExperience: DeleteExperienceUseCase,
  ) {}

  @Post()
  @Permissions('EXPERIENCE_CREATE')
  create(@Body() dto: CreateExperienceDto) {
    return this.createExperience.execute(dto);
  }

  @Get()
  @Permissions('EXPERIENCE_READ')
  findAll(@Query() query: ListExperiencesQueryDto) {
    return this.listExperiences.execute(query);
  }

  @Get(':id')
  @Permissions('EXPERIENCE_READ')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getExperience.execute(id);
  }

  @Patch(':id')
  @Permissions('EXPERIENCE_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.updateExperience.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('EXPERIENCE_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteExperience.execute(id);
  }
}
