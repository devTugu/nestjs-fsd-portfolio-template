import type { LocalizedText } from '@shared/domain/localized-content';

export class BrandEvent {
  constructor(
    public readonly id: number,
    public readonly brandId: number,
    public readonly title: LocalizedText,
    public readonly description: LocalizedText,
    public readonly eventDate: Date,
    public readonly location: LocalizedText,
    public readonly imageUrl: string | null,
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
