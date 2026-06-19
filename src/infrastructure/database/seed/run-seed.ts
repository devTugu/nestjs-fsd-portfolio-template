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
  SiteSettingEntity,
  BlogPostEntity,
  NavigationNodeEntity,
  BrandEntity,
  MenuItemEntity,
  BrandEventEntity,
  HistoryEntryEntity,
  LeadershipMemberEntity,
  TeamMemberEntity,
} from '../typeorm/entities';
import {
  PERMISSION_CODES,
  SUPER_ADMIN_ROLE_NAME,
  CONTENT_MANAGER_ROLE_NAME,
  CMS_PERMISSION_CODES,
  E2E_VIEWER_PERMISSION_CODES,
  E2E_VIEWER_ROLE_NAME,
} from './permissions.const';
import { buildDemoSiteSettings } from './brand-seed.util';
import { DEMO_BLOG_POSTS } from './blog-seed.const';
import { DEMO_NAVIGATION_NODES } from './navigation-seed.const';
import {
  DEMO_BRANDS,
  DEMO_BRAND_EVENTS,
  DEMO_HISTORY,
  DEMO_LEADERSHIP,
  DEMO_MENU_ITEMS,
  DEMO_TEAM,
} from './multi-brand-seed.const';

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
    SiteSettingEntity,
    BlogPostEntity,
    NavigationNodeEntity,
    BrandEntity,
    MenuItemEntity,
    BrandEventEntity,
    HistoryEntryEntity,
    LeadershipMemberEntity,
    TeamMemberEntity,
  ],
  synchronize: false,
  connectTimeout: 15000,
  ...(useSsl && { ssl: { rejectUnauthorized: true } }),
});

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
const VIEWER_EMAIL = process.env.SEED_VIEWER_EMAIL ?? 'viewer@example.com';
const VIEWER_PASSWORD = process.env.SEED_VIEWER_PASSWORD ?? 'Viewer123!';

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
  } else {
    await userRepo.update(adminUser.id, {
      mfaEnabled: false,
      mfaSecretEncrypted: null,
    });
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

  const cmsPerms = allPerms.filter((p) =>
    (CMS_PERMISSION_CODES as readonly string[]).includes(p.code),
  );
  const existingCmRp = await rolePermissionRepo.find({
    where: { roleId: contentManagerRole.id },
  });
  const existingCmPermIds = new Set(existingCmRp.map((rp) => rp.permissionId));
  for (const p of cmsPerms) {
    if (existingCmPermIds.has(p.id)) continue;
    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: contentManagerRole.id,
        permissionId: p.id,
      }),
    );
  }

  const brandRepo = dataSource.getRepository(BrandEntity);
  const brandIdBySlug = new Map<string, number>();
  for (const demo of DEMO_BRANDS) {
    const exists = await brandRepo.findOne({ where: { slug: demo.slug } });
    if (!exists) {
      const saved = await brandRepo.save(
        brandRepo.create({
          ...demo,
          isPublished: true,
          publishedAt: new Date(),
          socialLinks: [],
        }),
      );
      brandIdBySlug.set(demo.slug, saved.id);
      console.log('Created demo brand:', demo.slug);
    } else {
      brandIdBySlug.set(demo.slug, exists.id);
    }
  }

  const menuItemRepo = dataSource.getRepository(MenuItemEntity);
  for (const demo of DEMO_MENU_ITEMS) {
    const brandId = brandIdBySlug.get(demo.brandSlug);
    if (!brandId) continue;
    const exists = await menuItemRepo.findOne({
      where: { brandId, name: demo.name },
    });
    if (!exists) {
      await menuItemRepo.save(
        menuItemRepo.create({
          brandId,
          category: demo.category,
          name: demo.name,
          description: demo.description,
          price: demo.price,
          isAvailable: true,
          isPublished: true,
          sortOrder: demo.sortOrder,
        }),
      );
      console.log('Created demo menu item:', demo.name.en);
    }
  }

  const brandEventRepo = dataSource.getRepository(BrandEventEntity);
  for (const demo of DEMO_BRAND_EVENTS) {
    const brandId = brandIdBySlug.get(demo.brandSlug);
    if (!brandId) continue;
    const exists = await brandEventRepo.findOne({
      where: { brandId, title: demo.title },
    });
    if (!exists) {
      await brandEventRepo.save(
        brandEventRepo.create({
          brandId,
          title: demo.title,
          description: demo.description,
          eventDate: demo.eventDate,
          location: demo.location,
          isPublished: true,
          sortOrder: demo.sortOrder,
        }),
      );
      console.log('Created demo brand event:', demo.title.en);
    }
  }

  const historyRepo = dataSource.getRepository(HistoryEntryEntity);
  for (const demo of DEMO_HISTORY) {
    const exists = await historyRepo.findOne({
      where: { year: demo.year, title: demo.title },
    });
    if (!exists) {
      await historyRepo.save(
        historyRepo.create({ ...demo, isPublished: true }),
      );
      console.log('Created demo history:', demo.year);
    }
  }

  const leadershipRepo = dataSource.getRepository(LeadershipMemberEntity);
  for (const demo of DEMO_LEADERSHIP) {
    const exists = await leadershipRepo.findOne({ where: { name: demo.name } });
    if (!exists) {
      await leadershipRepo.save(
        leadershipRepo.create({
          ...demo,
          socialLinks: [],
          isPublished: true,
        }),
      );
      console.log('Created demo leadership:', demo.name);
    }
  }

  const teamRepo = dataSource.getRepository(TeamMemberEntity);
  for (const demo of DEMO_TEAM) {
    const exists = await teamRepo.findOne({ where: { name: demo.name } });
    if (!exists) {
      await teamRepo.save(
        teamRepo.create({
          ...demo,
          socialLinks: [],
          isPublished: true,
        }),
      );
      console.log('Created demo team member:', demo.name);
    }
  }

  const siteSettingsRepo = dataSource.getRepository(SiteSettingEntity);
  const existingSettings = await siteSettingsRepo.findOne({ where: { id: 1 } });
  if (!existingSettings) {
    await siteSettingsRepo.save(
      siteSettingsRepo.create(buildDemoSiteSettings()),
    );
    console.log('Created default site settings');
  }

  const blogPostRepo = dataSource.getRepository(BlogPostEntity);
  for (const demo of DEMO_BLOG_POSTS) {
    const exists = await blogPostRepo.findOne({ where: { slug: demo.slug } });
    if (!exists) {
      await blogPostRepo.save(
        blogPostRepo.create({
          ...demo,
          publishedAt: demo.isPublished ? new Date() : null,
        }),
      );
      console.log('Created demo news post:', demo.slug);
    }
  }

  const navigationNodeRepo = dataSource.getRepository(NavigationNodeEntity);
  const existingNavCount = await navigationNodeRepo.count();
  if (existingNavCount === 0) {
    const idByKey = new Map<string, number>();
    for (const demo of DEMO_NAVIGATION_NODES) {
      const parentId = demo.parentKey
        ? (idByKey.get(demo.parentKey) ?? null)
        : null;
      const saved = await navigationNodeRepo.save(
        navigationNodeRepo.create({
          scope: demo.scope,
          parentId,
          type: demo.type,
          labels: demo.labels,
          descriptions: demo.descriptions ?? null,
          href: demo.href ?? null,
          icon: null,
          metadata: demo.metadata ?? null,
          sortOrder: demo.sortOrder,
          isPublished: demo.isPublished,
        }),
      );
      idByKey.set(demo.key, saved.id);
    }
    console.log('Created demo navigation nodes:', DEMO_NAVIGATION_NODES.length);
  }

  let viewerRole = await roleRepo.findOne({
    where: { name: E2E_VIEWER_ROLE_NAME },
  });
  if (!viewerRole) {
    viewerRole = await roleRepo.save(
      roleRepo.create({
        name: E2E_VIEWER_ROLE_NAME,
        description: 'E2E limited viewer — no dashboard or audit access',
      }),
    );
    console.log('Created E2E_VIEWER role');
  }

  const viewerPerms = allPerms.filter((p) =>
    (E2E_VIEWER_PERMISSION_CODES as readonly string[]).includes(p.code),
  );
  const existingViewerRp = await rolePermissionRepo.find({
    where: { roleId: viewerRole.id },
  });
  const existingViewerPermIds = new Set(
    existingViewerRp.map((rp) => rp.permissionId),
  );
  for (const p of viewerPerms) {
    if (existingViewerPermIds.has(p.id)) continue;
    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: viewerRole.id,
        permissionId: p.id,
      }),
    );
  }

  let viewerUser = await userRepo.findOne({ where: { email: VIEWER_EMAIL } });
  if (!viewerUser) {
    const passwordHash = await bcrypt.hash(VIEWER_PASSWORD, 12);
    viewerUser = await userRepo.save(
      userRepo.create({ email: VIEWER_EMAIL, passwordHash, isActive: true }),
    );
    console.log('Created viewer user:', VIEWER_EMAIL);
  }

  const existingViewerUr = await userRoleRepo.findOne({
    where: { userId: viewerUser.id, roleId: viewerRole.id },
  });
  if (!existingViewerUr) {
    await userRoleRepo.save(
      userRoleRepo.create({ userId: viewerUser.id, roleId: viewerRole.id }),
    );
  }

  await dataSource.destroy();
  console.log('Seed completed.');
}

runSeed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
