import { AppHeader, AppPage } from "@/shared/layout";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
      <AppHeader variant="application" />
      <div className="pt-[var(--app-header-height)] flex-1 w-full flex flex-col">
        <AppPage>
          {children}
        </AppPage>
      </div>
    </div>
  );
}
