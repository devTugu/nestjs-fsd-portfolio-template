import type { LocalizedText } from '@shared/domain/localized-content';

export class Experience {
  constructor(
    public readonly id: number,
    public readonly company: string,
    public readonly role: LocalizedText,
    public readonly location: LocalizedText | null,
    public readonly description: LocalizedText | null,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly isCurrent: boolean,
    public readonly isPublished: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
