import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementEntryCard from "./AnnouncementEntryCard";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import { ANNOUNCEMENT_SEEN_STORAGE_PREFIX } from "../utils/announcement-storage";

describe("AnnouncementEntryCard behavioral tests", () => {
  const mockFeature: AnnouncementDto = {
    id: "ann-feat",
    title: "New Shelves Customization",
    content: "Organize custom reading shelves easily.",
    type: "feature" as any,
    linkUrl: "/me/shelves",
    linkText: "Explore Shelves",
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

  it("returns null when announcements list is empty", () => {
    const { container } = render(<AnnouncementEntryCard announcements={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when only info announcements exist (never interrupts user)", () => {
    const { container } = render(
      <AnnouncementEntryCard announcements={[mockInfo]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null if the announcement is already seen in localStorage", () => {
    window.localStorage.setItem(
      `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`,
      "true"
    );

    const { container } = render(
      <AnnouncementEntryCard announcements={[mockFeature]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders centered Card for unseen feature announcement and dismisses upon clicking Don't show again", () => {
    render(<AnnouncementEntryCard announcements={[mockFeature]} />);

    expect(
      screen.getByRole("heading", { name: "New Shelves Customization" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Organize custom reading shelves easily.")
    ).toBeInTheDocument();
    expect(screen.getByText("New Feature")).toBeInTheDocument();

    const ctaLink = screen.getByRole("link", { name: /Explore Shelves/i });
    expect(ctaLink).toHaveAttribute("href", "/me/shelves");

    const dismissBtn = screen.getByRole("button", {
      name: "Don't show again",
    });
    fireEvent.click(dismissBtn);

    // After dismissal, card unmounts and ID is saved to localStorage
    expect(
      screen.queryByRole("heading", { name: "New Shelves Customization" })
    ).not.toBeInTheDocument();
    expect(
      window.localStorage.getItem(
        `${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}${mockFeature.id}`
      )
    ).toBe("true");
  });

  it("renders non-dismissible Dialog for critical error announcement requiring acknowledgment", () => {
    render(<AnnouncementEntryCard announcements={[mockCritical]} />);

    expect(
      screen.getByRole("heading", { name: "Security Migration in Progress" })
    ).toBeInTheDocument();
    expect(screen.getByText("Critical Notice")).toBeInTheDocument();

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
});
