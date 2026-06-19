import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/user/repositories/user.repository.interface';
import { IRoleRepository } from '@domain/authorization/repositories/role.repository.interface';
import { IPermissionRepository } from '@domain/authorization/repositories/permission.repository.interface';
import { IBrandRepository } from '@domain/brand/repositories/brand.repository.interface';
import { IHistoryEntryRepository } from '@domain/history/repositories/history-entry.repository.interface';
import { IBlogPostRepository } from '@domain/blog/repositories/blog-post.repository.interface';
import { IContactMessageRepository } from '@domain/contact/repositories/contact-message.repository.interface';
import {
  BLOG_POST_REPOSITORY,
  BRAND_REPOSITORY,
  CONTACT_MESSAGE_REPOSITORY,
  HISTORY_ENTRY_REPOSITORY,
  PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@shared/constants/tokens';
import { DashboardStatsOutput } from '../dto/dashboard-stats.output';

const PERMISSION_MAP = {
  users: 'USER_READ',
  roles: 'ROLE_READ',
  permissions: 'PERMISSION_READ',
  brands: 'BRAND_READ',
  history: 'HISTORY_READ',
  news: 'BLOG_READ',
  contactMessages: 'CONTACT_READ',
} as const;

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: IPermissionRepository,
    @Inject(BRAND_REPOSITORY) private readonly brands: IBrandRepository,
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPosts: IBlogPostRepository,
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

    if (allowed.has(PERMISSION_MAP.brands)) {
      tasks.push(
        this.brands.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.brands = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.history)) {
      tasks.push(
        this.history.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.history = result.total;
        }),
      );
    }

    if (allowed.has(PERMISSION_MAP.news)) {
      tasks.push(
        this.blogPosts.findAll({ page: 1, limit: 1 }).then((result) => {
          stats.news = result.total;
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
