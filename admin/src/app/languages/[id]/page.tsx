import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/shared/core/types/database";
import {
  createLanguageAction,
  updateLanguageAction,
} from "../../../features/languages/actions";
import { notFound } from "next/navigation";

export default async function LanguageEditPage({
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
      .from("languages")
      .select("*")
      .eq("id", params.id)
      .single();
    if (!data) notFound();
    item = data;
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {isNew ? "New Language" : "Edit Language"}
      </h1>

      <form
        action={isNew ? createLanguageAction : updateLanguageAction}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        {!isNew && <input type="hidden" name="id" value={item?.id} />}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Code (BCP 47)
          </label>
          <input
            type="text"
            name="code"
            defaultValue={item?.code}
            placeholder="e.g. en, en-US, pt-BR"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={item?.name}
            placeholder="e.g. English"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Native Name
          </label>
          <input
            type="text"
            name="native_name"
            defaultValue={item?.native_name}
            placeholder="e.g. English"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            defaultChecked={isNew ? true : item?.is_active}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-slate-700"
          >
            Active
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            {isNew ? "Create Language" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
