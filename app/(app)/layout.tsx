import { AppHeader } from "@/shared/layout";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <AppHeader variant="application" />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
