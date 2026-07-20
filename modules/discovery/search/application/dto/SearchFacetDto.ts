export interface FacetValueDto {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface SearchFacetDto {
  key: string;
  label: string;
  type: "category" | "author" | "language" | "format" | "publisher" | string;
  values: FacetValueDto[];
  children?: SearchFacetDto[];
}
