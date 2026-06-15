import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadMediaUseCase } from '@application/media/use-cases/upload-media.use-case';
import { Permissions } from '../../../decorators/permissions.decorator';
import { AppErrors } from '@application/exceptions/application.exception';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@ApiTags('Media (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/media', version: '1' })
export class MediaAdminV1Controller {
  constructor(private readonly uploadMedia: UploadMediaUseCase) {}

  @Post('upload')
  @Permissions('PROJECT_UPDATE')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media file (requires S3 config)' })
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw AppErrors.BAD_REQUEST('File is required.');
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw AppErrors.BAD_REQUEST('Unsupported file type.');
    }
    return this.uploadMedia.execute({
      buffer: file.buffer,
      mimeType: file.mimetype,
      filename: file.originalname,
    });
  }
}
