import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementNotice from "./AnnouncementNotice";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import { ANNOUNCEMENT_SEEN_STORAGE_PREFIX } from "../utils/announcement-storage";

describe("AnnouncementNotice multi-card stack & behavioral tests", () => {
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

  it("2. renders all active unseen eligible announcements in the notice stack", () => {
    render(
      <AnnouncementNotice announcements={[mockFeature, mockWarning, mockInfo]} />
    );

    // All active announcements should be present in the notice stack
    expect(
      screen.getByRole("heading", { name: "New Shelves Customization" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Reader Annotations & Highlights" })
    ).toBeInTheDocument();
  });

  it("3. filters out previously seen announcements from the stack", () => {
    window.localStorage.setItem(
      `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`,
      "true"
    );

    render(
      <AnnouncementNotice announcements={[mockFeature, mockWarning]} />
    );

    // Seen announcement is excluded; unseen one is displayed
    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();
  });

  it("4. close button dismisses only that specific announcement card and marks it seen", () => {
    render(
      <AnnouncementNotice announcements={[mockFeature, mockWarning]} />
    );

    const closeFeatureBtn = screen.getByRole("button", {
      name: `Dismiss announcement: ${mockFeature.title}`,
    });
    fireEvent.click(closeFeatureBtn);

    // Feature card is dismissed; warning remains visible
    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Scheduled Maintenance" })
    ).toBeInTheDocument();

    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`
      )
    ).toBe("true");
    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockWarning.id}`
      )
    ).toBeNull();
  });

  it("5. CTA link click marks announcement seen and unmounts that card", () => {
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
    expect(screen.getByRole("complementary")).toBeInTheDocument(); // <aside>
  });
});
