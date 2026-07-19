import { ProfileRepository } from "../../../domain/repositories/ProfileRepository";
import { UserId } from "@/shared/kernel/UserId";
import { ProfileDto } from "./read-model";
import { UserProfile } from "../../../domain/entities/UserProfile";

export async function getProfile(
  profileRepository: ProfileRepository,
  userIdStr: string,
): Promise<ProfileDto> {
  const userId = UserId.create(userIdStr);

  const profile = await profileRepository.findByUserId(userId);
  if (!profile) {
    throw new Error("Profile not found");
  }

  return {
    id: profile.id,
    displayName: profile.displayName.value,
    avatarUrl: profile.avatarUrl.value,
    biography: profile.biography.value,
    location: profile.location.value,
  };
}
