import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const tab = resolvedParams?.tab || "profile";

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-display font-bold text-on-surface mb-8">
        Account Settings
      </h1>

      <div className="border-b border-outline-variant mb-8">
        <nav className="flex gap-8">
          <Link
            href="/account?tab=profile"
            className={`pb-4 text-label-lg font-medium border-b-2 transition-colors ${
              tab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Profile
          </Link>
          <Link
            href="/account?tab=preferences"
            className={`pb-4 text-label-lg font-medium border-b-2 transition-colors ${
              tab === "preferences"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Preferences
          </Link>
          <Link
            href="/account?tab=security"
            className={`pb-4 text-label-lg font-medium border-b-2 transition-colors ${
              tab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Security
          </Link>
        </nav>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8">
        {tab === "profile" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Public Profile</h2>
            <p className="text-on-surface-variant mb-6">Manage how you appear to others on TomeSphere.</p>
            <div className="text-sm text-outline">Form fields will go here...</div>
          </div>
        )}
        {tab === "preferences" && (
          <div>
            <h2 className="text-xl font-bold mb-4">App Preferences</h2>
            <p className="text-on-surface-variant mb-6">Customize your reading experience and notifications.</p>
            <div className="text-sm text-outline">Form fields will go here...</div>
          </div>
        )}
        {tab === "security" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Security</h2>
            <p className="text-on-surface-variant mb-6">Manage your password and authentication methods.</p>
            <div className="text-sm text-outline">Form fields will go here...</div>
          </div>
        )}
      </div>
    </div>
  );
}
