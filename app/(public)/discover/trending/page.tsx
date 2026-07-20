import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { BookGrid } from "@/modules/discovery/presentation/components/BookGrid";
import { DiscoveryPage, DiscoveryConfiguration } from "../_components/DiscoveryPage";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getTrending({ period: "daily", limit: 24, page: 1 });

  const config: DiscoveryConfiguration = {
    mode: "trending",
    title: "Popular Now",
    description: `Explore ${data.totalCount} items in this category.`,
    gridContent: <BookGrid items={data.books} />,
  };

  return <DiscoveryPage config={config} />;
}
