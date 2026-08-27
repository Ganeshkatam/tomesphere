import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementCenter from "./AnnouncementCenter";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import { ANNOUNCEMENT_SEEN_STORAGE_PREFIX } from "../utils/announcement-storage";

describe("AnnouncementCenter behavioral tests", () => {
  const mockAnnouncements: AnnouncementDto[] = [
    {
      id: "ac-1",
      title: "Reader Engine 2.0 Released",
      content: "Continuous scrolling and font controls now live.",
      type: "feature" as any,
      linkUrl: "/read/demo",
      linkText: "Try Reader",
      isDismissible: true,
      startsAt: "2026-08-26T00:00:00.000Z",
      endsAt: "2026-09-01T00:00:00.000Z",
    },
    {
      id: "ac-2",
      title: "Scheduled Maintenance Window",
      content: "System will pause for 15 minutes tonight.",
      type: "warning",
      isDismissible: true,
      startsAt: "2026-08-27T00:00:00.000Z",
      endsAt: "2026-08-28T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders trigger and opens dialog on click", () => {
    render(<AnnouncementCenter announcements={mockAnnouncements} />);

    const trigger = screen.getByRole("button", { name: "Open Announcement Center" });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(
      screen.getByRole("heading", { name: "Announcement Center" })
    ).toBeInTheDocument();
    expect(screen.getByText("Reader Engine 2.0 Released")).toBeInTheDocument();
    expect(screen.getByText("Scheduled Maintenance Window")).toBeInTheDocument();
  });

  it("renders empty state when no announcements are available", () => {
    render(<AnnouncementCenter announcements={[]} />);

    const trigger = screen.getByRole("button", { name: "Open Announcement Center" });
    fireEvent.click(trigger);

    expect(
      screen.getByText("No active announcements at this time.")
    ).toBeInTheDocument();
  });

  it("marks all announcements as read and saves them to localStorage", () => {
    render(<AnnouncementCenter announcements={mockAnnouncements} />);

    fireEvent.click(screen.getByRole("button", { name: "Open Announcement Center" }));

    const markAllBtn = screen.getByRole("button", { name: /Mark all read/i });
    fireEvent.click(markAllBtn);

    expect(
      window.localStorage.getItem(`${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}ac-1`)
    ).toBe("true");
    expect(
      window.localStorage.getItem(`${ANNOUNCEMENT_SEEN_STORAGE_PREFIX}ac-2`)
    ).toBe("true");
  });
});
