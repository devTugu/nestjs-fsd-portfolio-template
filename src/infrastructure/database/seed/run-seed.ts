import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {
  Role,
  Permission,
  User,
  UserRole,
  RolePermission,
  RefreshToken,
  ProjectEntity,
  SkillEntity,
  ExperienceEntity,
  SiteSettingEntity,
} from '../typeorm/entities';
import {
  PERMISSION_CODES,
  SUPER_ADMIN_ROLE_NAME,
  CONTENT_MANAGER_ROLE_NAME,
  PORTFOLIO_PERMISSION_CODES,
} from './permissions.const';
import {
  DEMO_EXPERIENCES,
  DEMO_PROJECTS,
  DEMO_SITE_SETTINGS,
  DEMO_SKILLS,
} from './portfolio-seed.const';

dotenv.config({ path: '.env' });

const useSsl = process.env.DB_SSL === 'true';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Role,
    Permission,
    User,
    UserRole,
    RolePermission,
    RefreshToken,
    ProjectEntity,
    SkillEntity,
    ExperienceEntity,
    SiteSettingEntity,
  ],
  synchronize: false,
  connectTimeout: 15000,
  ...(useSsl && { ssl: { rejectUnauthorized: true } }),
});

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';

async function runSeed(): Promise<void> {
  await dataSource.initialize();

  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);

  let superAdminRole = await roleRepo.findOne({
    where: { name: SUPER_ADMIN_ROLE_NAME },
  });
  if (!superAdminRole) {
    superAdminRole = await roleRepo.save(
      roleRepo.create({
        name: SUPER_ADMIN_ROLE_NAME,
        description: 'Super administrator with all permissions',
      }),
    );
    console.log('Created SUPER_ADMIN role');
  }

  for (const code of PERMISSION_CODES) {
    const existing = await permissionRepo.findOne({ where: { code } });
    if (!existing) {
      await permissionRepo.save(
        permissionRepo.create({ code, description: code }),
      );
      console.log('Created permission:', code);
    }
  }

  const allPerms = await permissionRepo.find();
  const existingRp = await rolePermissionRepo.find({
    where: { roleId: superAdminRole.id },
  });
  const existingPermIds = new Set(existingRp.map((rp) => rp.permissionId));
  for (const p of allPerms) {
    if (existingPermIds.has(p.id)) continue;
    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: superAdminRole.id,
        permissionId: p.id,
      }),
    );
  }

  let adminUser = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    adminUser = await userRepo.save(
      userRepo.create({ email: ADMIN_EMAIL, passwordHash, isActive: true }),
    );
    console.log('Created admin user:', ADMIN_EMAIL);
  }

  const existingUr = await userRoleRepo.findOne({
    where: { userId: adminUser.id, roleId: superAdminRole.id },
  });
  if (!existingUr) {
    await userRoleRepo.save(
      userRoleRepo.create({ userId: adminUser.id, roleId: superAdminRole.id }),
    );
  }

  let contentManagerRole = await roleRepo.findOne({
    where: { name: CONTENT_MANAGER_ROLE_NAME },
  });
  if (!contentManagerRole) {
    contentManagerRole = await roleRepo.save(
      roleRepo.create({
        name: CONTENT_MANAGER_ROLE_NAME,
        description: 'Portfolio content manager',
      }),
    );
    console.log('Created CONTENT_MANAGER role');
  }

  const portfolioPerms = allPerms.filter((p) =>
    (PORTFOLIO_PERMISSION_CODES as readonly string[]).includes(p.code),
  );
  const existingCmRp = await rolePermissionRepo.find({
    where: { roleId: contentManagerRole.id },
  });
  const existingCmPermIds = new Set(existingCmRp.map((rp) => rp.permissionId));
  for (const p of portfolioPerms) {
    if (existingCmPermIds.has(p.id)) continue;
    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: contentManagerRole.id,
        permissionId: p.id,
      }),
    );
  }

  const projectRepo = dataSource.getRepository(ProjectEntity);
  for (const demo of DEMO_PROJECTS) {
    const exists = await projectRepo.findOne({ where: { slug: demo.slug } });
    if (!exists) {
      await projectRepo.save(
        projectRepo.create({
          ...demo,
          publishedAt: demo.isPublished ? new Date() : null,
        }),
      );
      console.log('Created demo project:', demo.slug);
    }
  }

  const skillRepo = dataSource.getRepository(SkillEntity);
  for (const demo of DEMO_SKILLS) {
    const exists = await skillRepo.findOne({
      where: { name: demo.name, category: demo.category },
    });
    if (!exists) {
      await skillRepo.save(skillRepo.create({ ...demo, isPublished: true }));
      console.log('Created demo skill:', demo.name);
    }
  }

  const experienceRepo = dataSource.getRepository(ExperienceEntity);
  for (const demo of DEMO_EXPERIENCES) {
    const exists = await experienceRepo.findOne({
      where: { company: demo.company, role: demo.role },
    });
    if (!exists) {
      await experienceRepo.save(
        experienceRepo.create({
          ...demo,
          startDate: new Date(demo.startDate),
          endDate: demo.endDate ? new Date(demo.endDate) : null,
        }),
      );
      console.log('Created demo experience:', demo.company);
    }
  }

  const siteSettingsRepo = dataSource.getRepository(SiteSettingEntity);
  const existingSettings = await siteSettingsRepo.findOne({ where: { id: 1 } });
  if (!existingSettings) {
    await siteSettingsRepo.save(siteSettingsRepo.create(DEMO_SITE_SETTINGS));
    console.log('Created default site settings');
  }

  await dataSource.destroy();
  console.log('Seed completed.');
}

runSeed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
