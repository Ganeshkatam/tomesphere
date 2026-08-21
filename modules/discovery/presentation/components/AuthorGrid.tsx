import { AuthorCardDto } from "../../application/dto/AuthorCardDto";
import { AuthorCard } from "./AuthorCard";

interface AuthorGridProps {
  items: readonly AuthorCardDto[];
}

export function AuthorGrid({ items }: AuthorGridProps) {
  if (!items || items.length === 0) {
    return null; // Silently omit if empty
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 md:gap-6 min-w-0">
      {items.map((item) => (
        <AuthorCard key={item.id} author={item} />
      ))}
    </div>
  );
}
