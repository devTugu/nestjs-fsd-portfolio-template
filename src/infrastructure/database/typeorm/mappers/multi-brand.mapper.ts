import { Brand } from '@domain/brand/entities/brand.entity';
import { MenuItem } from '@domain/brand/entities/menu-item.entity';
import { BrandEvent } from '@domain/brand/entities/brand-event.entity';
import { HistoryEntry } from '@domain/history/entities/history-entry.entity';
import { LeadershipMember } from '@domain/leadership/entities/leadership-member.entity';
import { TeamMember } from '@domain/team/entities/team-member.entity';
import {
  BrandEntity,
  BrandEventEntity,
  MenuItemEntity,
  HistoryEntryEntity,
  LeadershipMemberEntity,
  TeamMemberEntity,
} from '../entities/multi-brand.entity';
import { coerceLocalizedText } from '@shared/domain/localized-content.mapper';

export class BrandMapper {
  static toDomain(entity: BrandEntity): Brand {
    return new Brand(
      entity.id,
      entity.slug,
      entity.type,
      coerceLocalizedText(entity.name),
      coerceLocalizedText(entity.description),
      entity.logoUrl,
      entity.coverImageUrl,
      entity.address ? coerceLocalizedText(entity.address) : null,
      entity.phone,
      entity.mapEmbed,
      entity.socialLinks ?? [],
      entity.workHours ? coerceLocalizedText(entity.workHours) : null,
      entity.sortOrder,
      entity.isPublished,
      entity.publishedAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

export class MenuItemMapper {
  static toDomain(entity: MenuItemEntity): MenuItem {
    return new MenuItem(
      entity.id,
      entity.brandId,
      coerceLocalizedText(entity.category),
      coerceLocalizedText(entity.name),
      coerceLocalizedText(entity.description),
      Number(entity.price),
      entity.imageUrl,
      entity.isAvailable,
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

export class BrandEventMapper {
  static toDomain(entity: BrandEventEntity): BrandEvent {
    return new BrandEvent(
      entity.id,
      entity.brandId,
      coerceLocalizedText(entity.title),
      coerceLocalizedText(entity.description),
      entity.eventDate,
      coerceLocalizedText(entity.location),
      entity.imageUrl,
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

export class HistoryEntryMapper {
  static toDomain(entity: HistoryEntryEntity): HistoryEntry {
    return new HistoryEntry(
      entity.id,
      entity.year,
      coerceLocalizedText(entity.title),
      coerceLocalizedText(entity.description),
      entity.imageUrl,
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

export class LeadershipMemberMapper {
  static toDomain(entity: LeadershipMemberEntity): LeadershipMember {
    return new LeadershipMember(
      entity.id,
      entity.name,
      coerceLocalizedText(entity.title),
      coerceLocalizedText(entity.quote),
      entity.imageUrl,
      entity.socialLinks ?? [],
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

export class TeamMemberMapper {
  static toDomain(entity: TeamMemberEntity): TeamMember {
    return new TeamMember(
      entity.id,
      entity.name,
      coerceLocalizedText(entity.role),
      entity.imageUrl,
      entity.socialLinks ?? [],
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
