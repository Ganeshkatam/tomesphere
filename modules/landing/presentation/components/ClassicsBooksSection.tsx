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
      description="Essential literature and foundational works across history."
      viewAllHref="/discover"
      viewAllTitle="All Classics"
      countLabel="Timeless Heritage"
      items={items}
    />
  );
}
