import BookShelfRow from "./BookShelfRow";

interface TrendingBooksSectionProps {
  items?: any[];
}

export default function TrendingBooksSection({
  items = [],
}: TrendingBooksSectionProps) {
  return (
    <BookShelfRow
      title="Trending Books"
      description="The most popular and actively read books across Tomesphere right now."
      viewAllHref="/discover/trending"
      viewAllTitle="All Trending Books"
      countLabel="Trending Now"
      items={items}
      onDemand={false}
    />
  );
}
