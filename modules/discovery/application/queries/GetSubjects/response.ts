export interface GetSubjectsResponseDto {
  readonly items: string[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
