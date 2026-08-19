import { ReaderPositionRecord } from "../models/ReaderTypes";
import { LocationAnchor } from "@/shared/core/events/types";

export interface ReaderPositionRepository {
  getPosition(
    userId: string,
    bookId: string,
  ): Promise<ReaderPositionRecord | null>;
  upsertPosition(
    userId: string,
    bookId: string,
    locationAnchor: LocationAnchor,
  ): Promise<void>;
}
