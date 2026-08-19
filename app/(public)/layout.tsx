import { AppHeader } from "@/shared/layout";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)] font-sans">
      <AppHeader variant="marketing" />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
