export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly passwordHash: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly roleNames: string[] = [],
    public readonly permissionCodes: string[] = [],
    public readonly mfaEnabled: boolean = false,
    public readonly oauthProvider: string | null = null,
  ) {}
}
