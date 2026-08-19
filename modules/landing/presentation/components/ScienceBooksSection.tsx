import BookShelfRow from "./BookShelfRow";

interface ScienceBooksSectionProps {
  items?: any[];
}

export default function ScienceBooksSection({
  items = [],
}: ScienceBooksSectionProps) {
  return (
    <BookShelfRow
      title="Science & Mathematics"
      description="Groundbreaking scientific treatises, computing foundations, and mathematical sciences."
      viewAllHref="/discover"
      viewAllTitle="All Science & Math"
      countLabel="STEM Corpus"
      items={items}
      onDemand={false}
    />
  );
}
