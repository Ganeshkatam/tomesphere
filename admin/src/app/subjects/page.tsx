import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../shared/core/types/database";
import Link from "next/link";
import { deleteSubjectAction } from "../../features/subjects/actions";

export default async function SubjectsPage() {
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
    .from("subjects")
    .select("*")
    .order("name");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Subjects</h1>
        <Link
          href="/subjects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Subject
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">
                  {item.slug}
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <Link
                    href={`/subjects/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={deleteSubjectAction.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
