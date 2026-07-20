export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover_url?: string | null;
  is_active: boolean;
}
