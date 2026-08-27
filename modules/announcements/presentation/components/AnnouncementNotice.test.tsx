import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementNotice from "./AnnouncementNotice";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import { ANNOUNCEMENT_SEEN_STORAGE_PREFIX } from "../utils/announcement-storage";

describe("AnnouncementNotice behavioral & regression tests", () => {
  const mockFeature: AnnouncementDto = {
    id: "ann-feat",
    title: "New Shelves Customization",
    content: "Organize custom reading shelves easily.",
    type: "feature",
    linkUrl: "/me/shelves",
    linkText: "Explore Shelves",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  const mockWarning: AnnouncementDto = {
    id: "ann-warn",
    title: "Scheduled Maintenance",
    content: "Database optimization tonight.",
    type: "warning",
    linkUrl: "/status",
    linkText: "Check Status",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  const mockInfo: AnnouncementDto = {
    id: "ann-info",
    title: "Library Tip",
    content: "Double tap in reader to toggle full screen.",
    type: "info",
    isDismissible: true,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  const mockCritical: AnnouncementDto = {
    id: "ann-crit",
    title: "Security Migration in Progress",
    content: "Please re-verify your active sessions.",
    type: "error",
    isDismissible: false,
    startsAt: "2026-08-27T00:00:00.000Z",
    endsAt: "2026-09-01T00:00:00.000Z",
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("1. returns null when announcements list is empty", () => {
    const { container } = render(<AnnouncementNotice announcements={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("2. returns null when only informational announcement exists (banner/center only)", () => {
    const { container } = render(
      <AnnouncementNotice announcements={[mockInfo]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("3. returns null if the announcement is already seen in localStorage", () => {
    window.localStorage.setItem(
      `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`,
      "true"
    );

    const { container } = render(
      <AnnouncementNotice announcements={[mockFeature]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("4 & 5. renders exactly one announcement (highest priority wins when multiple eligible)", () => {
    render(
      <AnnouncementNotice announcements={[mockFeature, mockWarning]} />
    );

    // Warning (Priority 3) wins over Feature (Priority 1)
    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
  });

  it("6. close button marks announcement seen and unmounts notice", () => {
    render(<AnnouncementNotice announcements={[mockFeature]} />);

    expect(
      screen.getByRole("heading", { name: "New Shelves Customization" })
    ).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", {
      name: `Dismiss announcement: ${mockFeature.title}`,
    });
    fireEvent.click(closeBtn);

    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`
      )
    ).toBe("true");
  });

  it("7 & 8. CTA marks announcement seen and contains valid navigation href", () => {
    render(<AnnouncementNotice announcements={[mockFeature]} />);

    const ctaLink = screen.getByRole("link", { name: /Explore Shelves/i });
    expect(ctaLink).toHaveAttribute("href", "/me/shelves");

    fireEvent.click(ctaLink);

    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`
      )
    ).toBe("true");
  });

  it("9. critical non-dismissible announcement uses the blocking Dialog path", () => {
    render(<AnnouncementNotice announcements={[mockCritical]} />);

    expect(
      screen.getByRole("heading", { name: "Security Migration in Progress" })
    ).toBeInTheDocument();
    expect(screen.getByText("Critical Notice")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const understandBtn = screen.getByRole("button", { name: "I Understand" });
    fireEvent.click(understandBtn);

    expect(
      screen.queryByRole("heading", { name: "Security Migration in Progress" })
    ).not.toBeInTheDocument();
    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockCritical.id}`
      )
    ).toBe("true");
  });

  it("10. REGRESSION TEST: ordinary announcements NEVER render as a modal Dialog", () => {
    render(<AnnouncementNotice announcements={[mockFeature]} />);

    // Must render as non-blocking aside card, NEVER a dialog or focus trap
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument(); // <aside>
  });
});
