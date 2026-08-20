import { getDiscoveryConfiguration } from "@/modules/discovery/presentation/factories/getDiscoveryConfiguration";
import { DiscoveryPage } from "../_components/DiscoveryPage";

export default async function NewArrivalsPage() {
  const config = await getDiscoveryConfiguration("new");
  return <DiscoveryPage config={config} />;
}
