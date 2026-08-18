import { DiscoveryHero } from "@/modules/discovery/presentation/components/DiscoveryHero";
import { DiscoverySection } from "@/modules/discovery/presentation/components/DiscoverySection";
import { FeaturedBooks } from "@/modules/discovery/presentation/components/FeaturedBooks";
import { BookGrid } from "@/modules/discovery/presentation/components/BookGrid";
import { CollectionGrid } from "@/modules/discovery/presentation/components/CollectionGrid";
import { AuthorGrid } from "@/modules/discovery/presentation/components/AuthorGrid";
import { SubjectGrid } from "@/modules/discovery/presentation/components/SubjectGrid";
import {
  tortureBooks,
  tortureAuthors,
  tortureCollections,
  tortureSubjects,
} from "@/tests/fixtures/discovery-edge-cases";

// This is a development-only sandbox route for the missing-data torture tests.
export const dynamic = "force-dynamic";

export default function DiscoveryTortureTestPage() {
  return (
    <div className="w-full flex flex-col gap-12 pb-24">
      <DiscoveryHero />

      <div className="flex flex-col gap-16">
        <DiscoverySection
          title="Featured Edge Cases"
          description="Testing missing covers and long names."
        >
          {/* Need at least 2 items for primary and secondary featured presentation */}
          <FeaturedBooks items={[tortureBooks[0], tortureBooks[1]]} />
        </DiscoverySection>

        <DiscoverySection title="BookGrid Torture Test">
          <BookGrid items={tortureBooks} />
        </DiscoverySection>

        <DiscoverySection title="SubjectGrid Torture Test">
          <SubjectGrid items={tortureSubjects} />
        </DiscoverySection>

        <DiscoverySection title="CollectionGrid Torture Test">
          <CollectionGrid items={tortureCollections} />
        </DiscoverySection>

        <DiscoverySection title="AuthorGrid Torture Test">
          <AuthorGrid items={tortureAuthors} />
        </DiscoverySection>
      </div>
    </div>
  );
}
