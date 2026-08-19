import BookShelfRow from "./BookShelfRow";

interface FeaturedBooksSectionProps {
  items: any[];
}

export default function FeaturedBooksSection({
  items,
}: FeaturedBooksSectionProps) {
  return (
    <BookShelfRow
      title="Featured Books"
      description="Editor-picked selections curated for you."
      viewAllHref="/discover/featured"
      viewAllTitle="All Featured Books"
      countLabel="Curated Spotlight"
      items={items}
    />
  );
}
