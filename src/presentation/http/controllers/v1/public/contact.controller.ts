import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { Public } from '../../../decorators/public.decorator';
import { SubmitContactMessageUseCase } from '@application/contact/use-cases/contact.use-cases';
import { SubmitContactDto } from '../../../dto/v1/contact.dto';

@ApiTags('Contact (Public) v1')
@Controller({ path: 'contact', version: '1' })
export class ContactPublicV1Controller {
  constructor(private readonly submitContact: SubmitContactMessageUseCase) {}

  @Post()
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact form' })
  submit(@Body() dto: SubmitContactDto, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : req.ip;
    return this.submitContact.execute({ ...dto, ipAddress: ip ?? null });
  }
}
