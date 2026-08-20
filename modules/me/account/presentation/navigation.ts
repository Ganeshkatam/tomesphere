import { User, Settings, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AccountNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export const ACCOUNT_NAVIGATION: readonly AccountNavigationItem[] = [
  { id: "profile", label: "Profile", href: "/me/account/profile", icon: User },
  {
    id: "preferences",
    label: "Preferences",
    href: "/me/account/preferences",
    icon: Settings,
  },
  {
    id: "security",
    label: "Security",
    href: "/me/account/security",
    icon: Shield,
  },
] as const;

/**
 * Resolves the active navigation item based on the current pathname.
 */
export function getActiveNavigationId(pathname: string): string {
  const match = ACCOUNT_NAVIGATION.find((item) =>
    pathname.startsWith(item.href),
  );
  return match?.id ?? "profile";
}
