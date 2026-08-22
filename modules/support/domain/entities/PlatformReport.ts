export type ReportType = "BUG" | "ABUSE" | "SECURITY";
export type ReportStatus = "PENDING" | "IN_REVIEW" | "RESOLVED" | "CLOSED";

export class PlatformReport {
  constructor(
    public readonly id: string,
    public readonly type: ReportType,
    public readonly title: string,
    public readonly description: string,
    public readonly status: ReportStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly email: string | null = null,
    public readonly userId: string | null = null
  ) {}

  public static create(params: {
    id: string;
    type: ReportType;
    title: string;
    description: string;
    email?: string | null;
    userId?: string | null;
  }): PlatformReport {
    const now = new Date();
    return new PlatformReport(
      params.id,
      params.type,
      params.title,
      params.description,
      "PENDING",
      now,
      now,
      params.email || null,
      params.userId || null
    );
  }
}
