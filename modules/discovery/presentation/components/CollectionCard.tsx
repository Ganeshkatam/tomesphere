import Link from "next/link";
import { CollectionSummaryDto } from "../../application/dto/CollectionSummaryDto";

interface CollectionCardProps {
  collection: CollectionSummaryDto;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/discover/collections/${collection.slug || collection.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-xl"
    >
      <div className="flex flex-col h-full bg-surface-variant/20 border border-outline-variant/30 rounded-xl p-5 md:p-6 transition-all duration-200 ease-in-out group-hover:-translate-y-[2px] group-hover:shadow-md group-hover:border-primary/30 group-hover:bg-surface-variant/30">
        <h3 className="font-serif text-title-lg md:text-headline-sm text-on-surface uppercase tracking-widest mb-3 transition-colors duration-200 group-hover:text-primary">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-body-md text-on-surface-variant line-clamp-3 mb-6">
            {collection.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-label-md text-on-surface-variant/70">
          <span>{collection.bookCount} books</span>
          <span className="opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary font-medium">
            Explore &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
