import { getDiscoveryConfiguration } from "@/modules/discovery/presentation/factories/getDiscoveryConfiguration";
import { DiscoveryPage } from "../_components/DiscoveryPage";

export default async function FeaturedPage() {
  const config = await getDiscoveryConfiguration("featured");
  return <DiscoveryPage config={config} />;
}
