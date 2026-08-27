import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

/**
 * Storage keys:
 * - ANNOUNCEMENT_SEEN_STORAGE_PREFIX: Tracks entry card acknowledgment/dismissal.
 * - ANNOUNCEMENT_BANNER_DISMISSED_PREFIX: Tracks passive top banner dismissal independently.
 */
export const ANNOUNCEMENT_SEEN_STORAGE_PREFIX = "tomesphere_announcement_seen_";
export const ANNOUNCEMENT_BANNER_DISMISSED_PREFIX = "tomesphere_announcement_banner_dismissed_";

/**
 * Priority matrix for announcement entry presentation:
 * - Priority 4: Critical Non-Dismissible Error (type="error", isDismissible=false) -> Requires blocking Dialog
 * - Priority 3: Warning (type="warning") -> Important notice Card
 * - Priority 2: Dismissible Error (type="error", isDismissible=true) -> Important error Card
 * - Priority 1: Feature (type="feature") -> New capability Card
 * - Priority 0: Passive (type="info" | "success") -> Banner/Center only, never eligible for entry Card
 */
export function getAnnouncementPriority(announcement: AnnouncementDto): number {
  if (announcement.type === "error" && !announcement.isDismissible) {
    return 4;
  }
  if (announcement.type === "warning") {
    return 3;
  }
  if (announcement.type === "error" && announcement.isDismissible) {
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
 * Check whether an announcement was acknowledged/seen on this device.
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
 * Marks an announcement as acknowledged/seen on this device.
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
 * Check whether the passive banner for an announcement is dismissed on this device.
 * A banner is hidden if either the banner was explicitly closed OR the announcement was acknowledged.
 */
export function isBannerDismissed(id: string): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const bannerDismissed =
      window.localStorage.getItem(`${ANNOUNCEMENT_BANNER_DISMISSED_PREFIX}${id}`) === "true";
    const entrySeen =
      window.localStorage.getItem(`${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${id}`) === "true";
    return bannerDismissed || entrySeen;
  } catch {
    return false;
  }
}

/**
 * Marks the passive banner as dismissed on this device without suppressing the entry card.
 */
export function markBannerDismissed(id: string): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(`${ANNOUNCEMENT_BANNER_DISMISSED_PREFIX}${id}`, "true");
  } catch {
    // Graceful degradation
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

  // Sort descending by priority, breaking ties by startsAt
  eligible.sort((a, b) => {
    const priorityDiff = getAnnouncementPriority(b) - getAnnouncementPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
  });

  return eligible[0];
}
