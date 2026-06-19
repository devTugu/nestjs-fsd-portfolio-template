import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';
import { LocalizedTextShortDto as LocalizedTextDto } from '../shared/localized-text.dto';

export { LocalizedTextDto };

export class NavigationMetadataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ctaHref?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  ctaLabel?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  badge?: string;
}

export class NavigationScopeQueryDto {
  @ApiProperty({ enum: NavigationScope })
  @IsEnum(NavigationScope)
  scope: NavigationScope;
}

export class CreateNavigationNodeDto {
  @ApiProperty({ enum: NavigationScope })
  @IsEnum(NavigationScope)
  scope: NavigationScope;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @ApiProperty({ enum: NavigationNodeType })
  @IsEnum(NavigationNodeType)
  type: NavigationNodeType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  labels: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  descriptions?: LocalizedTextDto | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  href?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => NavigationMetadataDto)
  metadata?: NavigationMetadataDto | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateNavigationNodeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @ApiPropertyOptional({ enum: NavigationNodeType })
  @IsOptional()
  @IsEnum(NavigationNodeType)
  type?: NavigationNodeType;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  labels?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  descriptions?: LocalizedTextDto | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  href?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => NavigationMetadataDto)
  metadata?: NavigationMetadataDto | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class ReorderNavigationNodeItemDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @ApiProperty()
  @IsInt()
  sortOrder: number;
}

export class ReorderNavigationNodesDto {
  @ApiProperty({ enum: NavigationScope })
  @IsEnum(NavigationScope)
  scope: NavigationScope;

  @ApiProperty({ type: [ReorderNavigationNodeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderNavigationNodeItemDto)
  items: ReorderNavigationNodeItemDto[];
}
