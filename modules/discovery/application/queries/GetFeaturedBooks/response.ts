export interface GetFeaturedBooksResponseDto {
  readonly items: Partial<
    import("@/modules/library/application/dto/response/BookDto").BookDto
  >[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
