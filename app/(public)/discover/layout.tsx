import Link from "next/link";
import { Compass, Search, Flame, Sparkles, Clock, List, Users, BookOpen } from "lucide-react";
import Navbar from "@/modules/shared/navigation/components/Navbar";
import { getCurrentUser } from "@/modules/authentication/actions/auth";


import { DiscoverSidebar } from "./_components/DiscoverSidebar";

export default async function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResult = await getCurrentUser();
  const user = userResult || null;

  return (
    <div className="min-h-screen bg-gradient-page w-full flex flex-col">
      <Navbar user={user} />
      <div className="flex flex-col md:flex-row flex-1 w-full">
        <DiscoverSidebar />

        {/* Main Content Area */}
        <main className="flex-1 w-full relative z-10 p-6 md:p-10 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
