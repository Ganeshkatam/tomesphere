import {
  getAnnouncementPriority,
  isEntryEligible,
  isAnnouncementSeen,
  markAnnouncementSeen,
  selectEntryAnnouncement,
  ANNOUNCEMENT_SEEN_STORAGE_PREFIX,
} from "./announcement-storage";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

describe("announcement-storage policy & persistence tests", () => {
  const mockCritical: AnnouncementDto = {
    id: "a-crit",
    title: "Critical Outage Notice",
    content: "Database migration in progress.",
    type: "error",
    isDismissible: false,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-08-28T00:00:00.000Z",
  };

  const mockWarning: AnnouncementDto = {
    id: "a-warn",
    title: "Scheduled Maintenance",
    content: "Tonight at midnight.",
    type: "warning",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-08-28T00:00:00.000Z",
  };

  const mockErrorDismissible: AnnouncementDto = {
    id: "a-err",
    title: "Payment Gateway Degradation",
    content: "Check status page.",
    type: "error",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-08-28T00:00:00.000Z",
  };

  const mockFeature: AnnouncementDto = {
    id: "a-feat",
    title: "Custom Shelves Released",
    content: "Organize your personal library with custom shelves.",
    type: "feature" as any,
    isDismissible: true,
    startsAt: "2026-08-26T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  const mockInfo: AnnouncementDto = {
    id: "a-info",
    title: "Did You Know?",
    content: "Use keyboard shortcuts in reader.",
    type: "info",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  const mockSuccess: AnnouncementDto = {
    id: "a-succ",
    title: "Monthly Goal Completed",
    content: "Great progress this month.",
    type: "success",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("calculates correct priorities according to policy matrix", () => {
    expect(getAnnouncementPriority(mockCritical)).toBe(4);
    expect(getAnnouncementPriority(mockWarning)).toBe(3);
    expect(getAnnouncementPriority(mockErrorDismissible)).toBe(2);
    expect(getAnnouncementPriority(mockFeature)).toBe(1);
    expect(getAnnouncementPriority(mockInfo)).toBe(0);
    expect(getAnnouncementPriority(mockSuccess)).toBe(0);
  });

  it("classifies entry eligibility: info and success never interrupt", () => {
    expect(isEntryEligible(mockCritical)).toBe(true);
    expect(isEntryEligible(mockWarning)).toBe(true);
    expect(isEntryEligible(mockErrorDismissible)).toBe(true);
    expect(isEntryEligible(mockFeature)).toBe(true);
    expect(isEntryEligible(mockInfo)).toBe(false);
    expect(isEntryEligible(mockSuccess)).toBe(false);
  });

  it("persists seen state to localStorage and detects seen announcements", () => {
    expect(isAnnouncementSeen("test-1")).toBe(false);

    markAnnouncementSeen("test-1");
    expect(isAnnouncementSeen("test-1")).toBe(true);
    expect(
      window.localStorage.getItem(`${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}test-1`)
    ).toBe("true");
  });

  it("handles storage exceptions gracefully without crashing", () => {
    const originalSetItem = window.localStorage.setItem;
    window.localStorage.setItem = jest.fn(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => markAnnouncementSeen("test-err")).not.toThrow();

    window.localStorage.setItem = originalSetItem;
  });

  it("selects the single highest priority announcement and excludes seen or ineligible ones", () => {
    const all = [mockInfo, mockFeature, mockWarning, mockCritical, mockSuccess];
    const seen = new Set<string>();

    // 1. Critical should win over all others
    expect(selectEntryAnnouncement(all, seen)?.id).toBe("a-crit");

    // 2. If critical is seen, warning should win
    seen.add("a-crit");
    expect(selectEntryAnnouncement(all, seen)?.id).toBe("a-warn");

    // 3. If warning is seen, feature should win
    seen.add("a-warn");
    expect(selectEntryAnnouncement(all, seen)?.id).toBe("a-feat");

    // 4. If feature is seen, only info & success remain -> should return null
    seen.add("a-feat");
    expect(selectEntryAnnouncement(all, seen)).toBeNull();
  });
});
