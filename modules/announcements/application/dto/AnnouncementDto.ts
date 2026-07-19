export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  linkUrl?: string;
  linkText?: string;
  isDismissible: boolean;
  startsAt: string;
  endsAt: string;
}
