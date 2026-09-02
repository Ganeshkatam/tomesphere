import BookCard from "@/modules/books/components/BookCard";

interface FeaturedItemCardProps {
  item: any;
}

export default function FeaturedItemCard({ item }: FeaturedItemCardProps) {
  // In V1, all featured items are books.
  // In V2, this can switch based on item.type to render DocumentCard, PaperCard, etc.
  return <BookCard book={item} showShelves={false} />;
}
