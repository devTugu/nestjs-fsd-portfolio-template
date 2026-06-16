export interface ProjectImage {
  url: string;
  alt?: string;
}

export class Project {
  constructor(
    public readonly id: number,
    public readonly slug: string,
    public readonly title: string,
    public readonly shortDescription: string,
    public readonly description: string,
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
