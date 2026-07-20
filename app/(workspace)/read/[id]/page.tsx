import { executeReaderFacade } from "@/modules/reader/application/facades";
import { ReaderShell } from "@/modules/reader/components/ReaderShell";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const data = await executeReaderFacade(params.id);
    return <ReaderShell data={data} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <p className="mb-4">Book not found or access denied.</p>
        <a href="/library" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Return to Library
        </a>
      </div>
    );
  }
}
