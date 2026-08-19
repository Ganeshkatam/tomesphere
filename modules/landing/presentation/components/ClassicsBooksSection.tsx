import BookShelfRow from "./BookShelfRow";

interface ClassicsBooksSectionProps {
  items?: any[];
}

export default function ClassicsBooksSection({
  items = [],
}: ClassicsBooksSectionProps) {
  return (
    <BookShelfRow
      title="Timeless Classics"
      description="Essential world literature and enduring masterpieces across centuries."
      viewAllHref="/discover"
      viewAllTitle="All Classics"
      countLabel="Classic Archive"
      items={items}
      onDemand={false}
    />
  );
}
