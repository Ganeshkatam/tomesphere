import { ReaderPositionDto } from "../../application/dto/response/ReaderPositionDto";
import { LocationAnchor } from "@/shared/core/events/types";

export interface ReaderPositionRepository {
  getPosition(userId: string, bookId: string): Promise<ReaderPositionDto | null>;
  upsertPosition(userId: string, bookId: string, locationAnchor: LocationAnchor): Promise<void>;
}
