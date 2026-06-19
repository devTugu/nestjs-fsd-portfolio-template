import type { LocalizedText } from '@shared/domain/localized-content';

export interface ProjectImage {
  url: string;
  alt?: LocalizedText;
}

export class Project {
  constructor(
    public readonly id: number,
    public readonly slug: string,
    public readonly title: LocalizedText,
    public readonly shortDescription: LocalizedText,
    public readonly description: LocalizedText,
    public readonly thumbnailUrl: string | null,
    public readonly images: ProjectImage[],
    public readonly techStack: string[],
    public readonly liveUrl: string | null,
    public readonly repoUrl: string | null,
    public readonly isFeatured: boolean,
    public readonly isPublished: boolean,
    public readonly sortOrder: number,
    public readonly publishedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
