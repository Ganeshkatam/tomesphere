import { DiscoverSidebar } from "./_components/DiscoverSidebar";

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-page w-full flex flex-col">
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
