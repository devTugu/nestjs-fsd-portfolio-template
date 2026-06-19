import { HistoryEntry } from '@domain/history/entities/history-entry.entity';

export interface HistoryEntryOutput {
  id: number;
  year: number;
  title: HistoryEntry['title'];
  description: HistoryEntry['description'];
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toHistoryEntryOutput(entry: HistoryEntry): HistoryEntryOutput {
  return {
    id: entry.id,
    year: entry.year,
    title: entry.title,
    description: entry.description,
    imageUrl: entry.imageUrl,
    sortOrder: entry.sortOrder,
    isPublished: entry.isPublished,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
