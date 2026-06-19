import { HistoryEntry } from '../entities/history-entry.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateHistoryEntryData {
  year: number;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateHistoryEntryData {
  year?: number;
  title?: LocalizedText;
  description?: LocalizedText;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ListHistoryEntriesQuery {
  page?: number;
  limit?: number;
}

export interface IHistoryEntryRepository {
  create(data: CreateHistoryEntryData): Promise<HistoryEntry>;
  findById(id: number): Promise<HistoryEntry | null>;
  findAll(
    query: ListHistoryEntriesQuery,
  ): Promise<PaginatedResult<HistoryEntry>>;
  findAllPublished(): Promise<HistoryEntry[]>;
  update(id: number, data: UpdateHistoryEntryData): Promise<HistoryEntry>;
  softDelete(id: number): Promise<void>;
}
