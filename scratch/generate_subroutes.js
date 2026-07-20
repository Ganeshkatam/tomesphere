const fs = require('fs');
const path = require('path');

const routes = [
  { pathName: 'trending', methodName: 'getTrending', gridComponent: 'BookGrid', title: 'Trending Books' },
  { pathName: 'featured', methodName: 'getFeatured', gridComponent: 'BookGrid', title: 'Featured Books' },
  { pathName: 'new', methodName: 'getNewArrivals', gridComponent: 'BookGrid', title: 'New Arrivals' },
  { pathName: 'collections', methodName: 'getCollections', gridComponent: 'CollectionGrid', title: 'Curated Collections' },
  { pathName: 'authors', methodName: 'getAuthors', gridComponent: 'AuthorGrid', title: 'Popular Authors' },
  { pathName: 'genres', methodName: 'getGenres', gridComponent: 'GenreGrid', title: 'Browse by Genre' },
  { pathName: 'languages', methodName: 'getLanguages', gridComponent: 'LanguageGrid', title: 'Browse by Language' },
  { pathName: 'subjects', methodName: 'getSubjects', gridComponent: 'SubjectGrid', title: 'Browse by Subject' },
];

const basePath = path.join(__dirname, '..', 'app', '(public)', 'discover');

routes.forEach(route => {
  const dir = path.join(basePath, route.pathName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let params = "{ limit: 24, page: 1 }";
  if (route.methodName === "getTrending") {
    params = '{ period: "weekly", limit: 24, page: 1 }';
  }

  const content = `import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { ${route.gridComponent} } from "@/modules/discovery/presentation/components/${route.gridComponent}";

export const dynamic = "force-dynamic";

export default async function ${route.methodName}Page() {
  const facade = await getDiscoveryFacade();
  const data = await facade.${route.methodName}(${params});

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          ${route.title}
        </h1>
        <p className="text-[var(--text-secondary)]">
          Explore {data.total} items in this category.
        </p>
      </div>
      
      <${route.gridComponent} items={data.items} />
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});

console.log("Sub-routes generated.");
