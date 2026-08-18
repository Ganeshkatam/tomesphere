import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DiscoverySectionProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}

export function DiscoverySection({
  title,
  description,
  actionHref,
  actionLabel = "See all",
  children,
}: DiscoverySectionProps) {
  return (
    <section className="w-full flex flex-col gap-6 py-8">
      <header className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-headline-sm md:text-headline-md text-on-surface">
            {title}
          </h2>
          {description && (
            <p className="text-body-md text-on-surface-variant max-w-3xl">
              {description}
            </p>
          )}
        </div>
        
        {actionHref && (
          <Link
            href={actionHref}
            className="flex items-center gap-1.5 text-label-md font-medium text-primary hover:text-primary-fixed-dim transition-colors group whitespace-nowrap mb-1"
          >
            {actionLabel} 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </header>
      
      <div className="w-full min-w-0">
        {children}
      </div>
    </section>
  );
}
