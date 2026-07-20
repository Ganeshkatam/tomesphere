export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  link_url?: string | null;
  link_text?: string | null;
  is_dismissible: boolean;
  is_active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export function getAnnouncementStatus(
  announcement: Announcement,
): "Draft" | "Scheduled" | "Active" | "Expired" {
  if (!announcement.is_active) return "Draft";

  const now = new Date();

  if (announcement.starts_at && new Date(announcement.starts_at) > now) {
    return "Scheduled";
  }

  if (announcement.ends_at && new Date(announcement.ends_at) < now) {
    return "Expired";
  }

  return "Active";
}
