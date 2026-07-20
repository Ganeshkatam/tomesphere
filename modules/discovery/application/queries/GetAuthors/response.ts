export interface GetAuthorsResponseDto {
  readonly items: string[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
