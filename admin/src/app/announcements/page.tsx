import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/shared/core/types/database";
import Link from "next/link";
import { deleteAnnouncementAction } from "../../features/announcements/actions";
import { getAnnouncementStatus } from "../../lib/domain/announcements";

export default async function AnnouncementsPage() {
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
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
        <Link
          href="/announcements/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Announcement
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(items as any)?.map((item: any) => {
              const status = getAnnouncementStatus(item);
              const statusColors = {
                Draft: "bg-slate-100 text-slate-800",
                Scheduled: "bg-yellow-100 text-yellow-800",
                Active: "bg-green-100 text-green-800",
                Expired: "bg-red-100 text-red-800",
              };

              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">
                    {item.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColors[status]}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4">
                    <Link
                      href={`/announcements/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteAnnouncementAction.bind(null, item.id)}>
                      <button
                        type="submit"
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
