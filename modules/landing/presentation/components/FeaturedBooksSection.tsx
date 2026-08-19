import BookShelfRow from "./BookShelfRow";

interface FeaturedBooksSectionProps {
  items?: any[];
}

export default function FeaturedBooksSection({
  items = [],
}: FeaturedBooksSectionProps) {
  return (
    <BookShelfRow
      title="Featured"
      description="Curated books worth discovering."
      viewAllHref="/discover"
      viewAllTitle="All Featured Selections"
      countLabel="Featured Catalog"
      items={items}
      onDemand={false}
    />
  );
}
