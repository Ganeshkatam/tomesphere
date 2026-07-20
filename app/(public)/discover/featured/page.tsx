import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { BookGrid } from "@/modules/discovery/presentation/components/BookGrid";
import { DiscoveryPage, DiscoveryConfiguration } from "../_components/DiscoveryPage";

export const dynamic = "force-dynamic";

export default async function FeaturedPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getFeatured({ limit: 24, page: 1 });

  const config: DiscoveryConfiguration = {
    mode: "featured",
    title: "Editor's Picks",
    description: `Explore ${data.total} items in this category.`,
    gridContent: <BookGrid items={data.items} />,
  };

  return <DiscoveryPage config={config} />;
}
