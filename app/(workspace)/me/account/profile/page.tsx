import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseProfileRepository } from "@/modules/me/account/profile/infrastructure/repositories/SupabaseProfileRepository";
import { ProfileForm } from "@/modules/me/account/profile/presentation/components/ProfileForm";
import { redirect } from "next/navigation";
import { UserId } from "@/shared/kernel/UserId";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  const profileRepo = new SupabaseProfileRepository(supabase);
  const userId = UserId.create(user.id);
  let profile = await profileRepo.findById(userId);

  if (!profile) {
    profile = {
      id: userId,
      displayName: "",
      bio: "",
      location: "",
      avatarUrl: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const profileDto = {
    displayName: profile.displayName,
    bio: profile.bio,
    location: profile.location,
    avatarUrl: profile.avatarUrl,
    email: user.email || "",
  };

  return (
    <div>
      <ProfileForm initialValues={profileDto} />
    </div>
  );
}
