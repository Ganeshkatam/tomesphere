import BookShelfRow from "./BookShelfRow";

interface RecentlyAddedSectionProps {
  items?: any[];
}

export default function RecentlyAddedSection({
  items = [],
}: RecentlyAddedSectionProps) {
  return (
    <BookShelfRow
      title="Recently Added"
      description="Fresh digital additions and newly cataloged public domain editions."
      viewAllHref="/discover/new"
      viewAllTitle="All New Arrivals"
      countLabel="Recently Ingested"
      items={items}
      onDemand={false}
    />
  );
}
