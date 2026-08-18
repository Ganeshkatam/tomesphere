import { CollectionCard } from "./CollectionCard";
import { CollectionSummaryDto } from "../../application/dto/CollectionSummaryDto";

interface CollectionGridProps {
  items: readonly CollectionSummaryDto[];
}

export function CollectionGrid({ items }: CollectionGridProps) {
  if (!items || items.length === 0) {
    return null; // Silently omit if empty
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 min-w-0">
      {items.map((item) => (
        <CollectionCard key={item.id || item.slug} collection={item} />
      ))}
    </div>
  );
}
