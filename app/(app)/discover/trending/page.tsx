import { getDiscoveryConfiguration } from "@/modules/discovery/presentation/factories/getDiscoveryConfiguration";
import { DiscoveryPage } from "../_components/DiscoveryPage";

export default async function TrendingPage() {
  const config = await getDiscoveryConfiguration("trending");
  return <DiscoveryPage config={config} />;
}
