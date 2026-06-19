import type { LocalizedText } from '@shared/domain/localized-content';

export class MenuItem {
  constructor(
    public readonly id: number,
    public readonly brandId: number,
    public readonly category: LocalizedText,
    public readonly name: LocalizedText,
    public readonly description: LocalizedText,
    public readonly price: number,
    public readonly imageUrl: string | null,
    public readonly isAvailable: boolean,
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
