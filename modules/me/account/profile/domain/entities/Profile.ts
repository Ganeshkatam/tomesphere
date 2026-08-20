import { UserId } from "@/shared/kernel/UserId";

export interface Profile {
  id: UserId;
  displayName: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
