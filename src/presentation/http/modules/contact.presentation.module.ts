import { Module } from '@nestjs/common';
import { ContactPublicV1Controller } from '../controllers/v1/public/contact.controller';
import { ContactAdminV1Controller } from '../controllers/v1/admin/contact.controller';
import {
  DeleteContactMessageUseCase,
  ListContactMessagesUseCase,
  SubmitContactMessageUseCase,
  UpdateContactMessageStatusUseCase,
} from '@application/contact/use-cases/contact.use-cases';

@Module({
  controllers: [ContactPublicV1Controller, ContactAdminV1Controller],
  providers: [
    SubmitContactMessageUseCase,
    ListContactMessagesUseCase,
    UpdateContactMessageStatusUseCase,
    DeleteContactMessageUseCase,
  ],
})
export class ContactPresentationModule {}
