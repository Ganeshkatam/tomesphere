import BookShelfRow from "./BookShelfRow";

interface FeaturedBooksSectionProps {
  items?: any[];
}

export default function FeaturedBooksSection({
  items = [],
}: FeaturedBooksSectionProps) {
  return (
    <BookShelfRow
      title="Featured Books"
      description="Handpicked discoveries from the TomeSphere collection."
      viewAllHref="/discover"
      viewAllTitle="All Featured Selections"
      countLabel="Featured Catalog"
      items={items}
      onDemand={false}
    />
  );
}
