import { UserId } from "@/shared/kernel/UserId";
import { Profile } from "../entities/Profile";

export interface ProfileRepository {
  findById(id: UserId): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
}
