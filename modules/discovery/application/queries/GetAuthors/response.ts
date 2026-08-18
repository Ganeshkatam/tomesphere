import { AuthorCardDto } from "../../dto/AuthorCardDto";

export interface GetAuthorsResponseDto {
  readonly items: readonly AuthorCardDto[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
