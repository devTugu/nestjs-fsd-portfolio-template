import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/user/repositories/user.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { USER_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ExportUserDataUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
  ) {}

  async execute(id: number): Promise<Record<string, unknown>> {
    const user = await this.users.findById(id);
    if (!user) throw AppErrors.NOT_FOUND('User not found.');
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      roleNames: user.roleNames,
      mfaEnabled: user.mfaEnabled,
      oauthProvider: user.oauthProvider,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

@Injectable()
export class AnonymizeUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const user = await this.users.findById(id);
    if (!user) throw AppErrors.NOT_FOUND('User not found.');
    await this.users.anonymize(id);
  }
}
