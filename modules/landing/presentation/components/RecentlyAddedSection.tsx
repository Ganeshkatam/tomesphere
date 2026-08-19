import BookShelfRow from "./BookShelfRow";

interface RecentlyAddedSectionProps {
  items: any[];
}

export default function RecentlyAddedSection({
  items,
}: RecentlyAddedSectionProps) {
  return (
    <BookShelfRow
      title="Recently Added"
      description="The newest editions and fresh additions to our public digital archives."
      viewAllHref="/discover/new"
      viewAllTitle="All New Additions"
      countLabel="Fresh Catalog"
      items={items}
    />
  );
}
