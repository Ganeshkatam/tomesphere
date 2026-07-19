import { ReaderPositionDto } from "../dto/response/ReaderPositionDto";
import { ReaderPositionRepository } from "../../domain/repositories/ReaderPositionRepository";

export interface GetReaderPositionRequest {
  userId: string;
  bookId: string;
}

export async function executeGetReaderPosition(
  repository: ReaderPositionRepository,
  request: GetReaderPositionRequest,
): Promise<ReaderPositionDto | null> {
  try {
    const position = await repository.getPosition(request.userId, request.bookId);
    return position ;
  } catch (error: any) {
    console.error("Failed to fetch reading position:", error);
    throw new Error("Failed to fetch reading position" );
  }
}
