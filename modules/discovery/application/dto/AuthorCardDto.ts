export interface AuthorCardDto {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly imageUrl: string | null;
  readonly bookCount: number;
}
