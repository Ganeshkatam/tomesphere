import { Tables } from "@/shared/core/types/supabase";
import { UserProfile } from "../../domain/entities/UserProfile";

type ProfileRow = Tables<"profiles">;

export class ProfileMapper {
  static toDomain(row: ProfileRow): UserProfile {
    return UserProfile.fromPersistence(
      row.id,
      row.id, // Assuming id and user_id are the same for profiles, which is standard in Supabase auth linking
      row.display_name,
      row.avatar_url,
      row.bio,
      row.location,
      row.updated_at ? new Date(row.updated_at) : new Date(),
    );
  }

  static toPersistence(entity: UserProfile): ProfileRow {
    return {
      id: entity.id,
      display_name: entity.displayName.value,
      avatar_url: entity.avatarUrl.value,
      bio: entity.biography.value,
      location: entity.location.value,
      updated_at: entity.updatedAt.toISOString(),
      // Other fields aren't managed by this aggregate (e.g. email, created_at)
      // They will be handled by the update query partial
      created_at: null,
    };
  }
}
