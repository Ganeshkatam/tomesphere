import { HighlightDto } from "../dto/response/HighlightDto";
import { HighlightRepository } from "../../domain/repositories/HighlightRepository";

export interface GetHighlightsRequest {
  userId: string;
  bookId: string;
}

export async function executeGetHighlights(
  repository: HighlightRepository,
  request: GetHighlightsRequest,
): Promise<HighlightDto[]> {
  try {
    const highlights = await repository.getHighlights(
      request.userId,
      request.bookId,
    );
    return highlights;
  } catch (error: any) {
    console.error("Failed to fetch highlights:", error);
    throw new Error("Failed to fetch highlights");
  }
}
