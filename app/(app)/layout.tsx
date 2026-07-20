import { AppHeader } from "@/shared/layout";


export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
      <AppHeader isLoggedIn={false} />
      <div className="flex-1 w-full mx-auto max-w-container-max px-margin-desktop pt-[152px] pb-32">
        {children}
      </div>
    </div>
  );
}
