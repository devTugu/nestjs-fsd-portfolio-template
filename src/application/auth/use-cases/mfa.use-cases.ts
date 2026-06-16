import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/user/repositories/user.repository.interface';
import { IMfaVerifier } from '@application/ports/identity.port';
import { AppErrors } from '@application/exceptions/application.exception';
import { USER_REPOSITORY, MFA_VERIFIER } from '@shared/constants/tokens';

@Injectable()
export class EnrollMfaUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    @Inject(MFA_VERIFIER) private readonly mfa: IMfaVerifier,
  ) {}

  async execute(userId: number): Promise<{ otpauthUrl: string }> {
    const user = await this.users.findById(userId);
    if (!user) throw AppErrors.NOT_FOUND('User not found.');

    const { secret, otpauthUrl } = this.mfa.generateSecret(user.email);
    await this.users.update(userId, {
      mfaSecretEncrypted: this.mfa.encryptSecret(secret),
      mfaEnabled: false,
    });

    return { otpauthUrl };
  }
}

@Injectable()
export class ConfirmMfaEnrollUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    @Inject(MFA_VERIFIER) private readonly mfa: IMfaVerifier,
  ) {}

  async execute(userId: number, code: string): Promise<void> {
    const encrypted = await this.users.getMfaSecretEncrypted(userId);
    if (!encrypted) throw AppErrors.BAD_REQUEST('Start MFA enrollment first.');

    const secret = this.mfa.decryptSecret(encrypted);
    if (!this.mfa.verifyToken(secret, code)) {
      throw AppErrors.UNAUTHORIZED('Invalid MFA code.');
    }

    await this.users.update(userId, { mfaEnabled: true });
  }
}

@Injectable()
export class DisableMfaUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.users.update(userId, {
      mfaEnabled: false,
      mfaSecretEncrypted: null,
    });
  }
}
