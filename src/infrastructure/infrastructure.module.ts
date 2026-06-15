import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  RefreshToken,
  AuditLog,
  ProjectEntity,
  SkillEntity,
  ExperienceEntity,
  SiteSettingEntity,
  ContactMessageEntity,
} from './database/typeorm/entities';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  ROLE_REPOSITORY,
  PERMISSION_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_ISSUER,
  TOKEN_BLACKLIST,
  PERMISSION_CACHE,
  AUDIT_LOG_REPOSITORY,
  PROJECT_REPOSITORY,
  SKILL_REPOSITORY,
  EXPERIENCE_REPOSITORY,
  SITE_SETTING_REPOSITORY,
  CONTACT_MESSAGE_REPOSITORY,
  NOTIFICATION_PORT,
  MEDIA_STORAGE_PORT,
} from '@shared/constants/tokens';
import { UserTypeOrmRepository } from './repositories/user.typeorm-repository';
import { RefreshTokenTypeOrmRepository } from './repositories/refresh-token.typeorm-repository';
import { RoleTypeOrmRepository } from './repositories/role.typeorm-repository';
import { PermissionTypeOrmRepository } from './repositories/permission.typeorm-repository';
import { AuditLogTypeOrmRepository } from './repositories/audit-log.typeorm-repository';
import { ProjectTypeOrmRepository } from './repositories/project.typeorm-repository';
import { SkillTypeOrmRepository } from './repositories/skill.typeorm-repository';
import { ExperienceTypeOrmRepository } from './repositories/experience.typeorm-repository';
import { SiteSettingTypeOrmRepository } from './repositories/site-setting.typeorm-repository';
import { ContactMessageTypeOrmRepository } from './repositories/contact-message.typeorm-repository';
import { BcryptPasswordHasher } from './auth/bcrypt-password-hasher';
import { JwtTokenIssuerAdapter } from './auth/jwt-token-issuer.adapter';
import { RedisClient } from './cache/redis/redis.client';
import { TokenBlacklistRedisAdapter } from './cache/redis/token-blacklist.redis-adapter';
import { PermissionCacheRedisAdapter } from './cache/redis/permission-cache.redis-adapter';
import { TokenBlacklistMemoryAdapter } from './cache/memory/token-blacklist.memory-adapter';
import { PermissionCacheMemoryAdapter } from './cache/memory/permission-cache.memory-adapter';
import { RedisHealthIndicator } from './cache/redis/redis.health';
import { isRedisEnabled } from './config/redis.config';
import { ITokenBlacklist } from '@application/ports/token-blacklist.port';
import { IPermissionCache } from '@application/ports/permission-cache.port';
import { INotificationPort } from '@application/ports/notification.port';
import { NoopNotificationAdapter } from './notification/noop-notification.adapter';
import { NodemailerNotificationAdapter } from './notification/nodemailer-notification.adapter';
import { UrlPassthroughAdapter } from './media/url-passthrough.adapter';
import { S3CompatibleStorageAdapter } from './media/s3-compatible-storage.adapter';
import { CompositeMediaStorageAdapter } from './media/composite-media-storage.adapter';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
      RefreshToken,
      AuditLog,
      ProjectEntity,
      SkillEntity,
      ExperienceEntity,
      SiteSettingEntity,
      ContactMessageEntity,
    ]),
  ],
  providers: [
    {
      provide: RedisClient,
      useFactory: (config: ConfigService) => {
        if (!isRedisEnabled(config)) return null;
        return new RedisClient(config);
      },
      inject: [ConfigService],
    },
    RedisHealthIndicator,
    { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenTypeOrmRepository,
    },
    { provide: ROLE_REPOSITORY, useClass: RoleTypeOrmRepository },
    { provide: PERMISSION_REPOSITORY, useClass: PermissionTypeOrmRepository },
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogTypeOrmRepository },
    { provide: PROJECT_REPOSITORY, useClass: ProjectTypeOrmRepository },
    { provide: SKILL_REPOSITORY, useClass: SkillTypeOrmRepository },
    { provide: EXPERIENCE_REPOSITORY, useClass: ExperienceTypeOrmRepository },
    {
      provide: SITE_SETTING_REPOSITORY,
      useClass: SiteSettingTypeOrmRepository,
    },
    {
      provide: CONTACT_MESSAGE_REPOSITORY,
      useClass: ContactMessageTypeOrmRepository,
    },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuerAdapter },
    {
      provide: TOKEN_BLACKLIST,
      useFactory: (
        config: ConfigService,
        redis: RedisClient | null,
      ): ITokenBlacklist => {
        if (isRedisEnabled(config) && redis) {
          return new TokenBlacklistRedisAdapter(redis);
        }
        return new TokenBlacklistMemoryAdapter();
      },
      inject: [ConfigService, RedisClient],
    },
    {
      provide: PERMISSION_CACHE,
      useFactory: (
        config: ConfigService,
        redis: RedisClient | null,
      ): IPermissionCache => {
        if (isRedisEnabled(config) && redis) {
          return new PermissionCacheRedisAdapter(redis);
        }
        return new PermissionCacheMemoryAdapter();
      },
      inject: [ConfigService, RedisClient],
    },
    NoopNotificationAdapter,
    NodemailerNotificationAdapter,
    {
      provide: NOTIFICATION_PORT,
      useFactory: (
        config: ConfigService,
        noop: NoopNotificationAdapter,
        nodemailer: NodemailerNotificationAdapter,
      ): INotificationPort => {
        if (config.get<string>('SMTP_HOST')) return nodemailer;
        return noop;
      },
      inject: [ConfigService, NoopNotificationAdapter, NodemailerNotificationAdapter],
    },
    UrlPassthroughAdapter,
    S3CompatibleStorageAdapter,
    CompositeMediaStorageAdapter,
    {
      provide: MEDIA_STORAGE_PORT,
      useExisting: CompositeMediaStorageAdapter,
    },
  ],
  exports: [
    JwtModule,
    TypeOrmModule,
    RedisClient,
    RedisHealthIndicator,
    USER_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
    ROLE_REPOSITORY,
    PERMISSION_REPOSITORY,
    AUDIT_LOG_REPOSITORY,
    PROJECT_REPOSITORY,
    SKILL_REPOSITORY,
    EXPERIENCE_REPOSITORY,
    SITE_SETTING_REPOSITORY,
    CONTACT_MESSAGE_REPOSITORY,
    PASSWORD_HASHER,
    TOKEN_ISSUER,
    TOKEN_BLACKLIST,
    PERMISSION_CACHE,
    NOTIFICATION_PORT,
    MEDIA_STORAGE_PORT,
  ],
})
export class InfrastructureModule {}
