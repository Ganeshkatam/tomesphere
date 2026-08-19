import BookShelfRow from "./BookShelfRow";

interface PhilosophyBooksSectionProps {
  items?: any[];
}

export default function PhilosophyBooksSection({
  items = [],
}: PhilosophyBooksSectionProps) {
  return (
    <BookShelfRow
      title="Philosophy & Great Ideas"
      description="Foundational philosophy, ethics, epistemology, and profound human inquiry."
      viewAllHref="/discover"
      viewAllTitle="All Philosophy Works"
      countLabel="Intellectual Heritage"
      items={items}
      onDemand={true}
    />
  );
}
