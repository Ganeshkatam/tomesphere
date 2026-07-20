import { createSupabaseServerClient } from "@/shared/core/database/server";
import { AuthenticatedUser } from "@/shared/application/dto/AuthenticatedUser";

export interface NavigationDto {
  authenticated: boolean;
  displayName: string | null;
  avatar: string | null;
  unreadNotifications: number;
  currentWorkspace: string | null;
  quickLinks: Array<{ label: string; href: string }>;
}

export class NavigationFacade {
  async get(): Promise<NavigationDto> {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        authenticated: false,
        displayName: null,
        avatar: null,
        unreadNotifications: 0,
        currentWorkspace: null,
        quickLinks: [
          { label: "Sign In", href: "/login" },
          { label: "Sign Up", href: "/signup" },
        ],
      };
    }

    // You can expand this with a real profile/notifications query
    const displayName =
      user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const avatar = user.user_metadata?.avatar_url || null;

    return {
      authenticated: true,
      displayName,
      avatar,
      unreadNotifications: 0, // Placeholder
      currentWorkspace: "Personal", // Placeholder
      quickLinks: [
        { label: "Library", href: "/library" },
        { label: "Settings", href: "/me/preferences" },
      ],
    };
  }
}

let instance: NavigationFacade | null = null;
export function getNavigationFacade() {
  if (!instance) {
    instance = new NavigationFacade();
  }
  return instance;
}
