import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  LocalizedContentDto,
  LocalizedStringListDto,
  LocalizedTextDto,
} from '../shared/localized-text.dto';

class SocialLinkDto {
  @IsString()
  platform: string;

  @IsUrl()
  url: string;
}

class HeroSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  title?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  subtitle?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  description?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  ctaLabel?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}

class HeaderSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoDarkUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminLogoUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faviconUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  siteName?: LocalizedTextDto;
}

class FooterSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  copyright?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  tagline?: LocalizedTextDto;

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsOptional()
  @IsArray()
  socialLinks?: SocialLinkDto[];
}

class SeoSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  title?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  description?: LocalizedTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImageUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringListDto)
  keywords?: LocalizedStringListDto;
}

class ContactInfoSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  location?: LocalizedTextDto | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showForm?: boolean;
}

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => HeroSectionDto)
  hero?: HeroSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => HeaderSectionDto)
  header?: HeaderSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => FooterSectionDto)
  footer?: FooterSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoSectionDto)
  seo?: SeoSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoSectionDto)
  contactInfo?: ContactInfoSectionDto;
}

export { LocalizedContentDto };
