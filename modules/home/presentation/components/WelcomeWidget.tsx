import {
  LucideIcon,
  BookOpen,
  Compass,
  Flame,
  CheckCircle,
  Target,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface WelcomeWidgetProps {
  user: {
    user_metadata?: {
      full_name?: string;
    };
    email?: string;
  };
}

export function WelcomeWidget({ user }: WelcomeWidgetProps) {
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "Reader";

  // Determine time of day
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
        {greeting}, {name}.
      </h1>
      <p className="text-[var(--text-secondary)] mt-2">
        Continue your reading journey.
      </p>
    </div>
  );
}
