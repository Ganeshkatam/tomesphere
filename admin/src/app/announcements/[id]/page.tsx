import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/shared/core/types/database";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from "../../../features/announcements/actions";
import { notFound } from "next/navigation";

export default async function AnnouncementEditPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "new";
  let item = null;

  if (!isNew) {
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

    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", params.id)
      .single();
    if (!data) notFound();
    item = data;
  }

  const formatDateTimeLocal = (isoStr: string) => {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {isNew ? "New Announcement" : "Edit Announcement"}
      </h1>

      <form
        action={isNew ? createAnnouncementAction : updateAnnouncementAction}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        {!isNew && <input type="hidden" name="id" value={item?.id} />}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={item?.title}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type (e.g. info, warning, promotion)
          </label>
          <input
            type="text"
            name="type"
            defaultValue={item?.type}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            defaultValue={item?.content || ""}
            rows={4}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Link URL
            </label>
            <input
              type="url"
              name="link_url"
              defaultValue={item?.link_url || ""}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Link Text
            </label>
            <input
              type="text"
              name="link_text"
              defaultValue={item?.link_text || ""}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Starts At
            </label>
            <input
              type="datetime-local"
              name="starts_at"
              defaultValue={
                item?.starts_at ? formatDateTimeLocal(item.starts_at) : ""
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ends At
            </label>
            <input
              type="datetime-local"
              name="ends_at"
              defaultValue={
                item?.ends_at ? formatDateTimeLocal(item.ends_at) : ""
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              defaultChecked={isNew ? false : item?.is_active ?? false}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-slate-700"
            >
              Published (Active)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_dismissible"
              id="is_dismissible"
              defaultChecked={isNew ? true : item?.is_dismissible ?? false}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is_dismissible"
              className="text-sm font-medium text-slate-700"
            >
              Dismissible
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            {isNew ? "Create Announcement" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
