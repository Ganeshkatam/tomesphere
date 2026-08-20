import { getDiscoveryConfiguration } from "@/modules/discovery/presentation/factories/getDiscoveryConfiguration";
import { DiscoveryPage } from "../_components/DiscoveryPage";

export default async function AuthorsPage() {
  const config = await getDiscoveryConfiguration("authors");
  return <DiscoveryPage config={config} />;
}
