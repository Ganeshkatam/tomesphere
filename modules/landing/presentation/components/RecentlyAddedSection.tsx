import BookShelfRow from "./BookShelfRow";

interface RecentlyAddedSectionProps {
  items?: any[];
}

export default function RecentlyAddedSection({
  items = [],
}: RecentlyAddedSectionProps) {
  return (
    <BookShelfRow
      title="New Arrivals"
      description="Recently added to the collection."
      viewAllHref="/discover/new"
      viewAllTitle="All New Arrivals"
      countLabel="Recently Added"
      items={items}
      onDemand={false}
    />
  );
}
