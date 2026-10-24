import HomeOverviewClient from '../components/HomeOverviewClient';
import { apiClient } from '../lib/api-client.js';

export const revalidate = 1800; // revalidate every 30 minutes

export default async function Page() {
  let projects = [];
  let profile = null;
  let updates = [];
  let offers = [];

  try {
    const [p, prof, u, o] = await Promise.all([
      apiClient.projects.list().catch(() => []),
      apiClient.profile.get().catch(() => null),
      apiClient.updates.list({ limit: 3 }).catch(() => []),
      apiClient.offers.list({ limit: 2, onlyActive: true }).catch(() => [])
    ]);

    projects = p || [];
    profile = prof || null;
    updates = u || [];
    offers = o || [];
  } catch (err) {
    console.error('[Frontend SSR]: Failed to retrieve initial data from backend server:', err.message);
  }

  return (
    <HomeOverviewClient
      projects={projects}
      profile={profile}
      updates={updates}
      offers={offers}
    />
  );
}
