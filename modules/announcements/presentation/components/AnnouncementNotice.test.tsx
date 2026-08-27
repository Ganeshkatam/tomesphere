import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementNotice from "./AnnouncementNotice";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import { ANNOUNCEMENT_SEEN_STORAGE_PREFIX } from "../utils/announcement-storage";

describe("AnnouncementNotice hover stack queue & behavioral tests", () => {
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
    title: "Reader Annotations & Highlights",
    content: "Capture thoughts and quotes directly while reading.",
    type: "info",
    linkUrl: "/me/annotations",
    linkText: "View Notes",
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

  it("2. displays top announcement in queue when NOT hovered and collapses others", () => {
    render(
      <AnnouncementNotice announcements={[mockWarning, mockFeature, mockInfo]} />
    );

    // Warning (Priority 3) is on top of the queue
    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();

    // Other announcements remain collapsed in the queue
    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
  });

  it("3. expands all announcement cards when user hovers on container and collapses on leave", () => {
    render(
      <AnnouncementNotice announcements={[mockWarning, mockFeature, mockInfo]} />
    );

    const asideContainer = screen.getByRole("complementary");

    // Mouse enters -> Expands all cards in the stack
    fireEvent.mouseEnter(asideContainer);

    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "New Shelves Customization" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Reader Annotations & Highlights" })
    ).toBeInTheDocument();

    // Mouse leaves -> Collapses back to top card
    fireEvent.mouseLeave(asideContainer);

    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
  });

  it("4. close button dismisses only that specific announcement card and marks it seen", () => {
    render(
      <AnnouncementNotice announcements={[mockWarning, mockFeature]} />
    );

    const closeWarningBtn = screen.getByRole("button", {
      name: `Dismiss announcement: ${mockWarning.title}`,
    });
    fireEvent.click(closeWarningBtn);

    // Warning is dismissed, next announcement (Feature) now becomes active top of queue
    expect(
      screen.queryByRole("heading", { name: "Scheduled Maintenance" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "New Shelves Customization" })
    ).toBeInTheDocument();

    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockWarning.id}`
      )
    ).toBe("true");
    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`
      )
    ).toBeNull();
  });

  it("5. CTA link click marks announcement seen and navigates", () => {
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

  it("6. critical non-dismissible announcement uses the blocking Dialog path", () => {
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

  it("7. REGRESSION TEST: ordinary announcements NEVER render as a modal Dialog", () => {
    render(<AnnouncementNotice announcements={[mockFeature, mockWarning]} />);

    // Must render as non-blocking aside container, NEVER a modal dialog or focus trap
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});
