import Link from "next/link";
import { CollectionCard } from "./CollectionCard";
import { CollectionSummaryDto } from "../../application/dto/CollectionSummaryDto";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Layers, ArrowRight } from "lucide-react";

interface CollectionGridProps {
  items: readonly CollectionSummaryDto[];
}

export function CollectionGrid({ items }: CollectionGridProps) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={28} className="text-indigo-500" />}
        title="No Curated Collections Yet"
        description="Our editorial board is actively preparing curated reading tracks, anthologies, and subject guides. Discover all featured volumes in the catalog."
        action={
          <Link
            href="/discover/featured"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Explore Editor's Picks</span>
            <ArrowRight size={14} />
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 min-w-0">
      {items.map((item) => (
        <CollectionCard key={item.id || item.slug} collection={item} />
      ))}
    </div>
  );
}
