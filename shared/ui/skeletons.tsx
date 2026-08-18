import { cn } from "@/lib/utils";

// Shimmer effect utility
const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-[var(--surface-raised)] rounded-lg", className)} />
);

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[var(--surface-default)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      {/* Cover Image Skeleton */}
      <div className="aspect-[2/3] w-full relative bg-[var(--surface-raised)]/20">
        <Shimmer className="absolute inset-0 w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex-1 flex flex-col gap-2">
        {/* Title */}
        <Shimmer className="h-4 w-3/4 mb-1" />

        {/* Author */}
        <Shimmer className="h-3 w-1/2" />

        <div className="mt-auto pt-2 flex items-center justify-between">
          {/* Rating placeholder */}
          <Shimmer className="h-3 w-12 rounded-full" />
          {/* Button placeholder */}
          <Shimmer className="h-6 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full">
          <BookCardSkeleton />
        </div>
      ))}
    </div>
  );
}
