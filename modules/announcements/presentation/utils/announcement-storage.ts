import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

export const ANNOUNCEMENT_SEEN_STORAGE_PREFIX = "tomesphere_announcement_seen_";

/**
 * Priority values for announcement entry presentation:
 * - Critical non-dismissible: 4
 * - Warning: 3
 * - Error (dismissible): 2
 * - Feature: 1
 * - Info / Success: 0 (never eligible for entry card)
 */
export function getAnnouncementPriority(announcement: AnnouncementDto): number {
  if (announcement.type === "error" && !announcement.isDismissible) {
    return 4;
  }
  if (announcement.type === "warning") {
    return 3;
  }
  if (announcement.type === "error") {
    return 2;
  }
  if (announcement.type === "feature") {
    return 1;
  }
  return 0;
}

/**
 * Checks whether an announcement is eligible for the first-entry queue.
 * Pure informational or success announcements are passive and never trigger an entry card.
 */
export function isEntryEligible(announcement: AnnouncementDto): boolean {
  return getAnnouncementPriority(announcement) > 0;
}

/**
 * Check whether an announcement was previously seen/dismissed on this device.
 * Best-effort client device persistence, never authoritative for business logic.
 */
export function isAnnouncementSeen(id: string): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    return window.localStorage.getItem(`${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${id}`) === "true";
  } catch {
    return false;
  }
}

/**
 * Marks an announcement as seen/dismissed on this device.
 */
export function markAnnouncementSeen(id: string): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(`${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${id}`, "true");
  } catch {
    // Graceful degradation when storage is blocked (e.g. sandbox/incognito quota)
  }
}

/**
 * Selects the single highest-priority eligible announcement that hasn't been seen on this device.
 * Returns null if no eligible announcements exist or all have been seen.
 */
export function selectEntryAnnouncement(
  announcements: AnnouncementDto[],
  seenIds: Set<string>
): AnnouncementDto | null {
  const eligible = announcements.filter(
    (a) => isEntryEligible(a) && !seenIds.has(a.id)
  );

  if (eligible.length === 0) {
    return null;
  }

  // Sort descending by priority, breaking ties by startsAt or order in array
  eligible.sort((a, b) => {
    const priorityDiff = getAnnouncementPriority(b) - getAnnouncementPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
  });

  return eligible[0];
}
