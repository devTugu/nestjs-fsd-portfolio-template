import type { LocalizedText } from '@shared/domain/localized-content';

export class Skill {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly category: LocalizedText,
    public readonly proficiency: number,
    public readonly icon: string | null,
    public readonly isPublished: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
