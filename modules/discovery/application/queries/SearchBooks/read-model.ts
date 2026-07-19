import { BookDto } from "@/modules/library/application/dto/response/BookDto";

export interface SearchResultDto {
  readonly books: BookDto[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
}
