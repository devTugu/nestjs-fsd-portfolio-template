import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BLOG_POST_CATEGORIES } from '@domain/blog/entities/blog-post-category';
import {
  LocalizedContentDto,
  LocalizedTextDto,
} from '../shared/localized-text.dto';

export class CreateBlogPostDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  title: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  excerpt: LocalizedTextDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedContentDto)
  content: LocalizedContentDto;

  @ApiProperty({ enum: BLOG_POST_CATEGORIES })
  @IsEnum(BLOG_POST_CATEGORIES)
  category: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  authorName: LocalizedTextDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  authorRole: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  title?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  excerpt?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedContentDto)
  content?: LocalizedContentDto;

  @ApiPropertyOptional({ enum: BLOG_POST_CATEGORIES })
  @IsOptional()
  @IsEnum(BLOG_POST_CATEGORIES)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  authorName?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  authorRole?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class ListBlogPostsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: BLOG_POST_CATEGORIES })
  @IsOptional()
  @IsEnum(BLOG_POST_CATEGORIES)
  category?: string;
}

export class ListPublicBlogPostsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: BLOG_POST_CATEGORIES })
  @IsOptional()
  @IsEnum(BLOG_POST_CATEGORIES)
  category?: string;
}
