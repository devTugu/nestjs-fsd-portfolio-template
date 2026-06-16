export class Experience {
  constructor(
    public readonly id: number,
    public readonly company: string,
    public readonly role: string,
    public readonly location: string | null,
    public readonly description: string | null,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly isCurrent: boolean,
    public readonly isPublished: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
