import { getDiscoveryConfiguration } from "@/modules/discovery/presentation/factories/getDiscoveryConfiguration";
import { DiscoveryPage } from "../_components/DiscoveryPage";

export default async function CollectionsPage() {
  const config = await getDiscoveryConfiguration("collections");
  return <DiscoveryPage config={config} />;
}
