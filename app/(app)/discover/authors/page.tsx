import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { AuthorGrid } from "@/modules/discovery/presentation/components/AuthorGrid";
import { DiscoveryPage, DiscoveryConfiguration } from "../_components/DiscoveryPage";

export const dynamic = "force-dynamic";

export default async function AuthorsPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getAuthors({ limit: 24, page: 1 });

  const config: DiscoveryConfiguration = {
    mode: "authors",
    title: "Popular Authors",
    description: `Explore ${data.total} items in this category.`,
    gridContent: <AuthorGrid items={data.items} />,
  };

  return <DiscoveryPage config={config} />;
}
