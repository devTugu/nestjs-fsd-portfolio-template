import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/user/repositories/user.repository.interface';
import { IRoleRepository } from '@domain/authorization/repositories/role.repository.interface';
import { IPermissionRepository } from '@domain/authorization/repositories/permission.repository.interface';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { ISkillRepository } from '@domain/skill/repositories/skill.repository.interface';
import { IExperienceRepository } from '@domain/experience/repositories/experience.repository.interface';
import { IContactMessageRepository } from '@domain/contact/repositories/contact-message.repository.interface';
import {
  CONTACT_MESSAGE_REPOSITORY,
  EXPERIENCE_REPOSITORY,
  PERMISSION_REPOSITORY,
  PROJECT_REPOSITORY,
  ROLE_REPOSITORY,
  SKILL_REPOSITORY,
  USER_REPOSITORY,
} from '@shared/constants/tokens';
import { DashboardStatsOutput } from '../dto/dashboard-stats.output';

const PERMISSION_MAP = {
  users: 'USER_READ',
  roles: 'ROLE_READ',
  permissions: 'PERMISSION_READ',
  projects: 'PROJECT_READ',
  skills: 'SKILL_READ',
  experiences: 'EXPERIENCE_READ',
  contactMessages: 'CONTACT_READ',
} as const;

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: IPermissionRepository,
    @Inject(PROJECT_REPOSITORY) private readonly projects: IProjectRepository,
    @Inject(SKILL_REPOSITORY) private readonly skills: ISkillRepository,
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experiences: IExperienceRepository,
    @Inject(CONTACT_MESSAGE_REPOSITORY)
    private readonly contactMessages: IContactMessageRepository,
  ) {}

  async execute(permissionCodes: string[]): Promise<DashboardStatsOutput> {
    const allowed = new Set(permissionCodes);
    const stats: DashboardStatsOutput = {};
    const tasks: Promise<void>[] = [];

    if (allowed.has(PERMISSION_MAP.users)) {
      tasks.push(
        this.users.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.users = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.roles)) {
      tasks.push(
        this.roles.findAll(1, 1).then((result) => {
          stats.roles = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.permissions)) {
      tasks.push(
        this.permissions.findAll(1, 1).then((result) => {
          stats.permissions = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.projects)) {
      tasks.push(
        this.projects.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.projects = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.skills)) {
      tasks.push(
        this.skills.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.skills = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.experiences)) {
      tasks.push(
        this.experiences.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.experiences = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.contactMessages)) {
      tasks.push(
        Promise.all([
          this.contactMessages.findAll({ page: 1, limit: 1, status: 'NEW' }),
          this.contactMessages.findAll({ page: 1, limit: 1, status: 'READ' }),
          this.contactMessages.findAll({
            page: 1,
            limit: 1,
            status: 'ARCHIVED',
          }),
          this.contactMessages.findAll({ page: 1, limit: 1 }),
        ]).then(([newCount, readCount, archivedCount, totalCount]) => {
          stats.contactMessages = {
            new: newCount.total,
            read: readCount.total,
            archived: archivedCount.total,
            total: totalCount.total,
          };
        }),
      );
    }

    await Promise.all(tasks);
    return stats;
  }
}
