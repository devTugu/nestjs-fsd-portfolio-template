import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitContactDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  message: string;

  @ApiPropertyOptional({ description: 'Honeypot field — must be empty' })
  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateContactMessageStatusDto {
  @ApiProperty({ enum: ['NEW', 'READ', 'ARCHIVED'] })
  @IsEnum(['NEW', 'READ', 'ARCHIVED'])
  status: 'NEW' | 'READ' | 'ARCHIVED';
}

export class ListContactMessagesQueryDto {
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

  @ApiPropertyOptional({ enum: ['NEW', 'READ', 'ARCHIVED'] })
  @IsOptional()
  @IsEnum(['NEW', 'READ', 'ARCHIVED'])
  status?: 'NEW' | 'READ' | 'ARCHIVED';
}
