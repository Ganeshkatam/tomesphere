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
      description="Foundational philosophical dialogues, ethical inquiries, and epistemology."
      viewAllHref="/discover"
      viewAllTitle="All Philosophy Works"
      countLabel="Philosophical Corpus"
      items={items}
      onDemand={false}
    />
  );
}
