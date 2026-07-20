import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { CollectionGrid } from "@/modules/discovery/presentation/components/CollectionGrid";
import { DiscoveryPage, DiscoveryConfiguration } from "../_components/DiscoveryPage";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getCollections({ limit: 24, page: 1 });

  const config: DiscoveryConfiguration = {
    mode: "collections",
    title: "Curated Collections",
    description: `Explore ${data.total} items in this category.`,
    gridContent: <CollectionGrid items={data.items} />,
  };

  return <DiscoveryPage config={config} />;
}
