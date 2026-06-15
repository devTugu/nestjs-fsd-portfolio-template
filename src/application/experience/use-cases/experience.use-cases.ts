import { Inject, Injectable } from '@nestjs/common';
import { IExperienceRepository } from '@domain/experience/repositories/experience.repository.interface';
import { validateExperienceDates } from '@domain/experience/services/experience-date.validator';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  ExperienceOutput,
  toExperienceOutput,
} from '../dto/experience-output.mapper';
import { EXPERIENCE_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class CreateExperienceUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
  ) {}

  async execute(input: {
    company: string;
    role: string;
    location?: string | null;
    description?: string | null;
    startDate: string;
    endDate?: string | null;
    isCurrent?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
  }): Promise<ExperienceOutput> {
    const startDate = new Date(input.startDate);
    let endDate: Date | null;
    let isCurrent: boolean;
    try {
      ({ endDate, isCurrent } = validateExperienceDates({
        startDate,
        endDate: input.endDate ? new Date(input.endDate) : null,
        isCurrent: input.isCurrent,
      }));
    } catch (error) {
      throw AppErrors.BAD_REQUEST(
        error instanceof Error ? error.message : 'Invalid experience dates.',
      );
    }
    const experience = await this.experiences.create({
      ...input,
      startDate,
      endDate,
      isCurrent,
    });
    return toExperienceOutput(experience);
  }
}

@Injectable()
export class UpdateExperienceUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
  ) {}

  async execute(
    id: number,
    input: {
      company?: string;
      role?: string;
      location?: string | null;
      description?: string | null;
      startDate?: string;
      endDate?: string | null;
      isCurrent?: boolean;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ): Promise<ExperienceOutput> {
    const existing = await this.experiences.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Experience not found.');

    const startDate = input.startDate
      ? new Date(input.startDate)
      : existing.startDate;
    let endDate: Date | null;
    let isCurrent: boolean;
    try {
      ({ endDate, isCurrent } = validateExperienceDates({
        startDate,
        endDate:
          input.endDate !== undefined
            ? input.endDate
              ? new Date(input.endDate)
              : null
            : existing.endDate,
        isCurrent: input.isCurrent ?? existing.isCurrent,
      }));
    } catch (error) {
      throw AppErrors.BAD_REQUEST(
        error instanceof Error ? error.message : 'Invalid experience dates.',
      );
    }

    const experience = await this.experiences.update(id, {
      ...input,
      startDate,
      endDate,
      isCurrent,
    });
    return toExperienceOutput(experience);
  }
}

@Injectable()
export class GetExperienceUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
  ) {}

  async execute(id: number): Promise<ExperienceOutput> {
    const experience = await this.experiences.findById(id);
    if (!experience) throw AppErrors.NOT_FOUND('Experience not found.');
    return toExperienceOutput(experience);
  }
}

@Injectable()
export class ListExperiencesUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
  ) {}

  async execute(query: { page?: number; limit?: number; search?: string }) {
    const result = await this.experiences.findAll(query);
    return {
      ...result,
      items: result.items.map((e) => toExperienceOutput(e)),
    };
  }
}

@Injectable()
export class ListPublicExperiencesUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
  ) {}

  async execute(): Promise<ExperienceOutput[]> {
    const items = await this.experiences.findAllPublished();
    return items.map((e) => toExperienceOutput(e));
  }
}

@Injectable()
export class DeleteExperienceUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const experience = await this.experiences.findById(id);
    if (!experience) throw AppErrors.NOT_FOUND('Experience not found.');
    await this.experiences.softDelete(id);
  }
}
