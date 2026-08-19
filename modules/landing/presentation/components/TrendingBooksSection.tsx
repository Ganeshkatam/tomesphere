import BookShelfRow from "./BookShelfRow";

interface TrendingBooksSectionProps {
  items: any[];
}

export default function TrendingBooksSection({
  items,
}: TrendingBooksSectionProps) {
  return (
    <BookShelfRow
      title="Trending Now"
      description="The most popular books being read across TomeSphere right now."
      viewAllHref="/discover/trending"
      viewAllTitle="All Trending Books"
      countLabel="Reader Favorites"
      items={items}
    />
  );
}
