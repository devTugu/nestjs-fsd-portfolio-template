import { Inject, Injectable } from '@nestjs/common';
import { ISkillRepository } from '@domain/skill/repositories/skill.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { SkillOutput, toSkillOutput } from '../dto/skill-output.mapper';
import { SKILL_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class CreateSkillUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
  ) {}

  async execute(input: {
    name: string;
    category: string;
    proficiency: number;
    icon?: string | null;
    isPublished?: boolean;
    sortOrder?: number;
  }): Promise<SkillOutput> {
    if (input.proficiency < 1 || input.proficiency > 5) {
      throw AppErrors.BAD_REQUEST('Proficiency must be between 1 and 5.');
    }
    if (await this.skills.nameCategoryExists(input.name, input.category)) {
      throw AppErrors.CONFLICT(
        'Skill with this name and category already exists.',
      );
    }
    const skill = await this.skills.create(input);
    return toSkillOutput(skill);
  }
}

@Injectable()
export class UpdateSkillUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
  ) {}

  async execute(
    id: number,
    input: {
      name?: string;
      category?: string;
      proficiency?: number;
      icon?: string | null;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ): Promise<SkillOutput> {
    const existing = await this.skills.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Skill not found.');
    if (input.proficiency !== undefined) {
      if (input.proficiency < 1 || input.proficiency > 5) {
        throw AppErrors.BAD_REQUEST('Proficiency must be between 1 and 5.');
      }
    }
    const name = input.name ?? existing.name;
    const category = input.category ?? existing.category;
    if (
      (input.name !== undefined || input.category !== undefined) &&
      (name !== existing.name || category !== existing.category) &&
      (await this.skills.nameCategoryExists(name, category, id))
    ) {
      throw AppErrors.CONFLICT(
        'Skill with this name and category already exists.',
      );
    }
    const skill = await this.skills.update(id, input);
    return toSkillOutput(skill);
  }
}

@Injectable()
export class GetSkillUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
  ) {}

  async execute(id: number): Promise<SkillOutput> {
    const skill = await this.skills.findById(id);
    if (!skill) throw AppErrors.NOT_FOUND('Skill not found.');
    return toSkillOutput(skill);
  }
}

@Injectable()
export class ListSkillsUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const result = await this.skills.findAll(query);
    return { ...result, items: result.items.map((s) => toSkillOutput(s)) };
  }
}

@Injectable()
export class ListPublicSkillsUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
  ) {}

  async execute(category?: string): Promise<SkillOutput[]> {
    const items = await this.skills.findAllPublished(category);
    return items.map((s) => toSkillOutput(s));
  }
}

@Injectable()
export class DeleteSkillUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const skill = await this.skills.findById(id);
    if (!skill) throw AppErrors.NOT_FOUND('Skill not found.');
    await this.skills.softDelete(id);
  }
}
