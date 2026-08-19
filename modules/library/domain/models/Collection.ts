export interface CollectionRecord {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}
