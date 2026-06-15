import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DeleteContactMessageUseCase,
  ListContactMessagesUseCase,
  UpdateContactMessageStatusUseCase,
} from '@application/contact/use-cases/contact.use-cases';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  ListContactMessagesQueryDto,
  UpdateContactMessageStatusDto,
} from '../../../dto/v1/contact.dto';

@ApiTags('Contact Messages (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/contact-messages', version: '1' })
export class ContactAdminV1Controller {
  constructor(
    private readonly listMessages: ListContactMessagesUseCase,
    private readonly updateStatus: UpdateContactMessageStatusUseCase,
    private readonly deleteMessage: DeleteContactMessageUseCase,
  ) {}

  @Get()
  @Permissions('CONTACT_READ')
  @ApiOperation({ summary: 'List contact messages' })
  findAll(@Query() query: ListContactMessagesQueryDto) {
    return this.listMessages.execute(query);
  }

  @Patch(':id')
  @Permissions('CONTACT_UPDATE')
  @ApiOperation({ summary: 'Update contact message status' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactMessageStatusDto,
  ) {
    return this.updateStatus.execute(id, dto.status);
  }

  @Delete(':id')
  @Permissions('CONTACT_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete contact message' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteMessage.execute(id);
  }
}
