const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'modules', 'discovery', 'presentation', 'components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

const generateCard = (name, dtoArray, imageKey, titleKey, subtitleKey, linkPrefix) => `import Link from "next/link";
import { Card, CardImage, CardContent, CardTitle, CardSubtitle } from "@/shared/ui/components/Card";

interface ${name}CardProps {
  data: any;
}

export function ${name}Card({ data }: ${name}CardProps) {
  return (
    <Link href={"${linkPrefix}" + (data.id || data.slug || data)}>
      <Card>
        <CardImage src={${imageKey}} alt={${titleKey}} aspectRatio="${name === 'Author' ? 'aspect-square rounded-full' : 'aspect-[2/3]'}" />
        <CardContent>
          <CardTitle>{${titleKey}}</CardTitle>
          {${subtitleKey} && <CardSubtitle>{${subtitleKey}}</CardSubtitle>}
        </CardContent>
      </Card>
    </Link>
  );
}
`;

const generateGrid = (name) => `import { ${name}Card } from "./${name}Card";

interface ${name}GridProps {
  items: any[];
}

export function ${name}Grid({ items }: ${name}GridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--border-default)] rounded-2xl">
        <p className="text-[var(--text-secondary)]">No items found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map((item, i) => (
        <div key={item.id || item.slug || item || i} className="animate-fade-in-up" style={{ animationDelay: (i * 50) + "ms" }}>
          <${name}Card data={item} />
        </div>
      ))}
    </div>
  );
}
`;

const cards = [
  { name: 'Book', imageKey: 'data.coverUrl || "/covers/default.png"', titleKey: 'data.title', subtitleKey: 'data.author', linkPrefix: '/books/' },
  { name: 'Collection', imageKey: 'data.imageUrl || "/covers/collection.png"', titleKey: 'data.title || data.name', subtitleKey: 'data.description', linkPrefix: '/discover/collections/' },
  { name: 'Author', imageKey: 'data.avatarUrl || "/covers/author.png"', titleKey: 'data.name || data', subtitleKey: 'null', linkPrefix: '/discover/authors/' },
  { name: 'Genre', imageKey: '"/covers/genre.png"', titleKey: 'data', subtitleKey: 'null', linkPrefix: '/discover/genres/' },
  { name: 'Language', imageKey: '"/covers/language.png"', titleKey: 'data', subtitleKey: 'null', linkPrefix: '/discover/languages/' },
  { name: 'Subject', imageKey: '"/covers/subject.png"', titleKey: 'data', subtitleKey: 'null', linkPrefix: '/discover/subjects/' },
];

cards.forEach(c => {
  fs.writeFileSync(path.join(componentsDir, c.name + 'Card.tsx'), generateCard(c.name, c.dtoArray, c.imageKey, c.titleKey, c.subtitleKey, c.linkPrefix));
  fs.writeFileSync(path.join(componentsDir, c.name + 'Grid.tsx'), generateGrid(c.name));
});

console.log("Domain cards and grids created.");
