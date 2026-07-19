import { LocationAnchor } from "@/shared/core/events/types";

export interface ReaderPositionDto {
  bookId: string;
  locationAnchor: LocationAnchor;
  lastReadAt: string;
}
