import { executeReaderFacade } from "@/modules/reader/application/facades";
import { ReaderShell } from "@/modules/reader/components/ReaderShell";

export default async function Page({ params }: { params: { id: string } }) {
  let data: Awaited<ReturnType<typeof executeReaderFacade>> | null = null;
  let hasError = false;

  try {
    data = await executeReaderFacade(params.id);
  } catch {
    hasError = true;
  }

  if (hasError || !data) {
    return (
      <div className="min-h-screen bg-[var(--surface-canvas)] flex flex-col items-center justify-center text-[var(--text-secondary)]">
        <p className="mb-4">Book not found or access denied.</p>
        <a href="/library" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Return to Library
        </a>
      </div>
    );
  }

  return <ReaderShell data={data} />;
}
