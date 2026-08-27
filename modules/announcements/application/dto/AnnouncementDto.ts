export type AnnouncementType =
  | "info"
  | "warning"
  | "success"
  | "error"
  | "feature"
  | "maintenance"
  | "greetings"
  | "greeting"
  | "Greetings";

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  linkUrl?: string;
  linkText?: string;
  isDismissible: boolean;
  startsAt: string;
  endsAt: string;
}
