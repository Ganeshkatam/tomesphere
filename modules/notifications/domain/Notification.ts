export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface Notification {
  id: string;
  userId: string;
  
  eventName: string;
  aggregateId: string;
  aggregateType: string;

  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, any>;
  
  readAt: string | null;
  createdAt: string;
}
