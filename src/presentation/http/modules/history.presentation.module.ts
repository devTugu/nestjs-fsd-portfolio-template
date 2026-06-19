import { Module } from '@nestjs/common';
import { HistoryPublicV1Controller } from '../controllers/v1/public/history.controller';
import { HistoryAdminV1Controller } from '../controllers/v1/admin/history.controller';
import {
  CreateHistoryEntryUseCase,
  DeleteHistoryEntryUseCase,
  GetHistoryEntryUseCase,
  ListHistoryEntriesUseCase,
  ListPublicHistoryUseCase,
  UpdateHistoryEntryUseCase,
} from '@application/history/use-cases/history.use-cases';

@Module({
  controllers: [HistoryPublicV1Controller, HistoryAdminV1Controller],
  providers: [
    CreateHistoryEntryUseCase,
    UpdateHistoryEntryUseCase,
    GetHistoryEntryUseCase,
    ListHistoryEntriesUseCase,
    DeleteHistoryEntryUseCase,
    ListPublicHistoryUseCase,
  ],
})
export class HistoryPresentationModule {}
