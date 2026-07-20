import {
  Home,
  Compass,
  Book,
  User,
  Sparkles,
  HelpCircle,
  Info,
  LucideIcon,
  Flame,
} from "lucide-react";
import { AppRoutes } from "@/shared/kernel/navigation/AppRoutes";

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

export const GLOBAL_NAVIGATION: NavigationItem[] = [
  { href: AppRoutes.home, label: "Home", icon: Home, color: "text-indigo-400" },
  {
    href: AppRoutes.discover,
    label: "Discover",
    icon: Compass,
    color: "text-purple-400",
  },
  {
    href: "/discover/trending",
    label: "Trending",
    icon: Flame,
    color: "text-orange-500",
  },
  {
    href: "/support",
    label: "Support",
    icon: HelpCircle,
    color: "text-emerald-400",
  },
  { href: "/about", label: "About", icon: Info, color: "text-cyan-400" },
  {
    href: AppRoutes.library,
    label: "Library",
    icon: Book,
    color: "text-orange-400",
  },
  { href: AppRoutes.me, label: "Me", icon: User, color: "text-cyan-400" },
];
