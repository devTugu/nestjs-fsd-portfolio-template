import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

class NavLinkDto {
  @IsString()
  label: string;

  @IsString()
  href: string;
}

class SocialLinkDto {
  @IsString()
  platform: string;

  @IsUrl()
  url: string;
}

class HeroSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaLabel?: string;

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
  siteName?: string;

  @ApiPropertyOptional({ type: [NavLinkDto] })
  @IsOptional()
  @IsArray()
  navLinks?: NavLinkDto[];
}

class FooterSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  copyright?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsOptional()
  @IsArray()
  socialLinks?: SocialLinkDto[];
}

class SeoSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImageUrl?: string | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
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
  @IsString()
  location?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showForm?: boolean;
}

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  hero?: HeroSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  header?: HeaderSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  footer?: FooterSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  seo?: SeoSectionDto;

  @ApiPropertyOptional()
  @IsOptional()
  contactInfo?: ContactInfoSectionDto;
}
