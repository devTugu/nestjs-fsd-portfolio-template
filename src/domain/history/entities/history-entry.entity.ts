import type { LocalizedText } from '@shared/domain/localized-content';

export class HistoryEntry {
  constructor(
    public readonly id: number,
    public readonly year: number,
    public readonly title: LocalizedText,
    public readonly description: LocalizedText,
    public readonly imageUrl: string | null,
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
