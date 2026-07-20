import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/shared/core/types/database";

export default async function FeaturedBooksPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { data: items } = await supabase
    .from("featured_books")
    .select("*, books(title)")
    .order("position");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Featured Books</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Book
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Starts At
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Ends At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items?.map((item: any) => (
              <tr key={item.book_id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{item.position}</td>
                <td className="px-6 py-4 font-medium">{item.books?.title}</td>
                <td className="px-6 py-4 text-slate-500">
                  {item.starts_at || "Immediately"}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {item.ends_at || "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Note: API for reordering via Drag-and-Drop would be hooked into the
        server action.
      </p>
    </div>
  );
}
