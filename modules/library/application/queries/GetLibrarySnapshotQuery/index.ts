import { LibrarySnapshotDto } from "./dto";

export interface LibrarySnapshotReadModel {
  getLibrarySnapshot(userId: string): Promise<LibrarySnapshotDto | null>;
}

export class GetLibrarySnapshotQuery {
  constructor(private readonly repository: LibrarySnapshotReadModel) {}

  async execute(userId: string): Promise<LibrarySnapshotDto | null> {
    try {
      const data = await this.repository.getLibrarySnapshot(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch library snapshot.");
    }
  }
}
