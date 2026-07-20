const fs = require('fs');
const path = require('path');

function generateAnnouncement() {
  const Domain = 'Announcement';
  const DomainPlural = 'Announcements';
  const domain = 'announcement';
  const domainPlural = 'announcements';
  
  const basePath = `d:/websites/tomesphere-app/modules/${domainPlural}`;
  const adminPath = `d:/websites/tomesphere-app/admin/src`;
  
  fs.mkdirSync(`${basePath}/domain/entities`, { recursive: true });
  fs.mkdirSync(`${basePath}/domain/repositories`, { recursive: true });
  fs.mkdirSync(`${basePath}/infrastructure`, { recursive: true });
  fs.mkdirSync(`${basePath}/application/commands`, { recursive: true });
  fs.mkdirSync(`${adminPath}/features/${domainPlural}`, { recursive: true });
  fs.mkdirSync(`${adminPath}/app/${domainPlural}/[id]`, { recursive: true });

  // Entity
  fs.writeFileSync(`${basePath}/domain/entities/${Domain}.ts`, `export interface ${Domain} {
  id: string;
  title: string;
  content: string;
  type: string;
  link_url?: string | null;
  link_text?: string | null;
  is_dismissible: boolean;
  is_active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export function getAnnouncementStatus(announcement: ${Domain}): 'Draft' | 'Scheduled' | 'Active' | 'Expired' {
  if (!announcement.is_active) return 'Draft';
  
  const now = new Date();
  
  if (announcement.starts_at && new Date(announcement.starts_at) > now) {
    return 'Scheduled';
  }
  
  if (announcement.ends_at && new Date(announcement.ends_at) < now) {
    return 'Expired';
  }
  
  return 'Active';
}
`);

  // Repository
  fs.writeFileSync(`${basePath}/domain/repositories/${Domain}Repository.ts`, `import { ${Domain} } from "../entities/${Domain}";

export interface ${Domain}Repository {
  findById(id: string): Promise<${Domain} | null>;
  list(): Promise<${Domain}[]>;
  save(entity: ${Domain}): Promise<void>;
  delete(id: string): Promise<void>;
}
`);

  // Supabase Repo
  fs.writeFileSync(`${basePath}/infrastructure/Supabase${Domain}Repository.ts`, `import { SupabaseClient } from "@supabase/supabase-js";
import { ${Domain} } from "../domain/entities/${Domain}";
import { ${Domain}Repository } from "../domain/repositories/${Domain}Repository";
import { Database } from "../../../shared/core/types/database";

export class Supabase${Domain}Repository implements ${Domain}Repository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<${Domain} | null> {
    const { data, error } = await this.client
      .from("${domainPlural}")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      link_url: data.link_url,
      link_text: data.link_text,
      is_dismissible: data.is_dismissible,
      is_active: data.is_active,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
    };
  }

  async list(): Promise<${Domain}[]> {
    const { data, error } = await this.client
      .from("${domainPlural}")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    
    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      type: d.type,
      link_url: d.link_url,
      link_text: d.link_text,
      is_dismissible: d.is_dismissible,
      is_active: d.is_active,
      starts_at: d.starts_at,
      ends_at: d.ends_at,
    }));
  }

  async save(entity: ${Domain}): Promise<void> {
    const payload = {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      type: entity.type,
      link_url: entity.link_url,
      link_text: entity.link_text,
      is_dismissible: entity.is_dismissible,
      is_active: entity.is_active,
      starts_at: entity.starts_at,
      ends_at: entity.ends_at,
      updated_at: new Date().toISOString(),
    };
    
    const { error } = await this.client
      .from("${domainPlural}")
      .upsert(payload);

    if (error) throw new Error(\`Failed to save ${domain}: \${error.message}\`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("${domainPlural}")
      .delete()
      .eq("id", id);

    if (error) throw new Error(\`Failed to delete ${domain}: \${error.message}\`);
  }
}
`);

  // Commands
  fs.writeFileSync(`${basePath}/application/commands/Create${Domain}Command.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Create${Domain}Command {
  title: string;
  content: string;
  type: string;
  link_url?: string | null;
  link_text?: string | null;
  is_dismissible?: boolean;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export class Create${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Create${Domain}Command): Promise<string> {
    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      title: command.title,
      content: command.content,
      type: command.type,
      link_url: command.link_url,
      link_text: command.link_text,
      is_dismissible: command.is_dismissible ?? false,
      is_active: command.is_active ?? false,
      starts_at: command.starts_at,
      ends_at: command.ends_at,
    });
    return id;
  }
}
`);

  fs.writeFileSync(`${basePath}/application/commands/Update${Domain}Command.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Update${Domain}Command {
  id: string;
  title?: string;
  content?: string;
  type?: string;
  link_url?: string | null;
  link_text?: string | null;
  is_dismissible?: boolean;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export class Update${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Update${Domain}Command): Promise<void> {
    const entity = await this.repository.findById(command.id);
    if (!entity) throw new Error(\`${Domain} with id \${command.id} not found\`);

    if (command.title !== undefined) entity.title = command.title;
    if (command.content !== undefined) entity.content = command.content;
    if (command.type !== undefined) entity.type = command.type;
    if (command.link_url !== undefined) entity.link_url = command.link_url;
    if (command.link_text !== undefined) entity.link_text = command.link_text;
    if (command.is_dismissible !== undefined) entity.is_dismissible = command.is_dismissible;
    if (command.is_active !== undefined) entity.is_active = command.is_active;
    if (command.starts_at !== undefined) entity.starts_at = command.starts_at;
    if (command.ends_at !== undefined) entity.ends_at = command.ends_at;

    await this.repository.save(entity);
  }
}
`);

  fs.writeFileSync(`${basePath}/application/commands/Delete${Domain}Command.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Delete${Domain}Command {
  id: string;
}

export class Delete${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Delete${Domain}Command): Promise<void> {
    await this.repository.delete(command.id);
  }
}
`);

  fs.writeFileSync(`${basePath}/application/commands/index.ts`, `export * from "./Create${Domain}Command";
export * from "./Update${Domain}Command";
export * from "./Delete${Domain}Command";
`);

  // Adapter
  fs.writeFileSync(`${adminPath}/lib/domain/${domainPlural}.ts`, `export {
  Create${Domain}Handler,
  Update${Domain}Handler,
  Delete${Domain}Handler,
} from "../../../../modules/${domainPlural}/application/commands";

export type {
  Create${Domain}Command,
  Update${Domain}Command,
  Delete${Domain}Command,
} from "../../../../modules/${domainPlural}/application/commands";

export { Supabase${Domain}Repository } from "../../../../modules/${domainPlural}/infrastructure/Supabase${Domain}Repository";
export type { ${Domain}Repository } from "../../../../modules/${domainPlural}/domain/repositories/${Domain}Repository";
export type { ${Domain} } from "../../../../modules/${domainPlural}/domain/entities/${Domain}";
export { getAnnouncementStatus } from "../../../../modules/${domainPlural}/domain/entities/${Domain}";
`);

  // Actions
  fs.writeFileSync(`${adminPath}/features/${domainPlural}/actions.ts`, `"use server";

import { revalidatePath } from "next/cache";
import { 
  Create${Domain}Handler, 
  Update${Domain}Handler, 
  Delete${Domain}Handler,
  Supabase${Domain}Repository 
} from "../../lib/domain/${domainPlural}";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../shared/core/types/database";

async function getRepository() {
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
    }
  );
  
  return new Supabase${Domain}Repository(supabase);
}

export async function create${Domain}Action(formData: FormData) {
  const repository = await getRepository();
  const handler = new Create${Domain}Handler(repository);

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;
  const link_url = formData.get("link_url") as string;
  const link_text = formData.get("link_text") as string;
  const starts_at = formData.get("starts_at") as string;
  const ends_at = formData.get("ends_at") as string;
  const is_active = formData.get("is_active") === "on";
  const is_dismissible = formData.get("is_dismissible") === "on";

  if (!title || !content || !type) throw new Error("Title, Content, and Type are required");

  await handler.execute({
    title,
    content,
    type,
    link_url: link_url || null,
    link_text: link_text || null,
    is_active,
    is_dismissible,
    starts_at: starts_at ? new Date(starts_at).toISOString() : null,
    ends_at: ends_at ? new Date(ends_at).toISOString() : null,
  });

  revalidatePath("/${domainPlural}");
  return;
}

export async function update${Domain}Action(formData: FormData) {
  const repository = await getRepository();
  const handler = new Update${Domain}Handler(repository);

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;
  const link_url = formData.get("link_url") as string;
  const link_text = formData.get("link_text") as string;
  const starts_at = formData.get("starts_at") as string;
  const ends_at = formData.get("ends_at") as string;
  const is_active = formData.get("is_active") === "on";
  const is_dismissible = formData.get("is_dismissible") === "on";

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    title: title || undefined,
    content: content || undefined,
    type: type || undefined,
    link_url: link_url || null,
    link_text: link_text || null,
    is_active,
    is_dismissible,
    starts_at: starts_at ? new Date(starts_at).toISOString() : null,
    ends_at: ends_at ? new Date(ends_at).toISOString() : null,
  });

  revalidatePath("/${domainPlural}");
  revalidatePath(\`/${domainPlural}/\${id}\`);
  return;
}

export async function delete${Domain}Action(id: string) {
  const repository = await getRepository();
  const handler = new Delete${Domain}Handler(repository);

  await handler.execute({ id });

  revalidatePath("/${domainPlural}");
  return;
}
`);

  // UI - List
  fs.writeFileSync(`${adminPath}/app/${domainPlural}/page.tsx`, `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../../shared/core/types/database";
import Link from "next/link";
import { delete${Domain}Action } from "../../features/${domainPlural}/actions";
import { getAnnouncementStatus } from "../../lib/domain/${domainPlural}";

export default async function ${DomainPlural}Page() {
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
    }
  );

  const { data: items } = await supabase.from("${domainPlural}").select("*").order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">${DomainPlural}</h1>
        <Link 
          href="/${domainPlural}/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add ${Domain}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Title</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Type</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Status</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(items as any)?.map((item: any) => {
              const status = getAnnouncementStatus(item);
              const statusColors = {
                Draft: 'bg-slate-100 text-slate-800',
                Scheduled: 'bg-yellow-100 text-yellow-800',
                Active: 'bg-green-100 text-green-800',
                Expired: 'bg-red-100 text-red-800',
              };

              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{item.type}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-2 py-1 text-xs rounded-full \${statusColors[status]}\`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4">
                    <Link href={\`/${domainPlural}/\${item.id}\`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <form action={delete${Domain}Action.bind(null, item.id)}>
                      <button type="submit" className="text-red-600 hover:underline">Delete</button>
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
`);

  // UI - Edit
  fs.writeFileSync(`${adminPath}/app/${domainPlural}/[id]/page.tsx`, `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../../../shared/core/types/database";
import { create${Domain}Action, update${Domain}Action } from "../../../features/${domainPlural}/actions";
import { notFound } from "next/navigation";

export default async function ${Domain}EditPage({ params }: { params: { id: string } }) {
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
      }
    );

    const { data } = await supabase.from("${domainPlural}").select("*").eq("id", params.id).single();
    if (!data) notFound();
    item = data;
  }

  const formatDateTimeLocal = (isoStr: string) => {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {isNew ? "New ${Domain}" : "Edit ${Domain}"}
      </h1>

      <form action={isNew ? create${Domain}Action : update${Domain}Action} className="bg-white p-6 rounded-lg shadow space-y-6">
        {!isNew && <input type="hidden" name="id" value={item?.id} />}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input 
            type="text" 
            name="title" 
            defaultValue={item?.title} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type (e.g. info, warning, promotion)</label>
          <input 
            type="text" 
            name="type" 
            defaultValue={item?.type} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Link URL</label>
            <input 
              type="url" 
              name="link_url" 
              defaultValue={item?.link_url || ""} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link Text</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Starts At</label>
            <input 
              type="datetime-local" 
              name="starts_at" 
              defaultValue={item?.starts_at ? formatDateTimeLocal(item.starts_at) : ""} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ends At</label>
            <input 
              type="datetime-local" 
              name="ends_at" 
              defaultValue={item?.ends_at ? formatDateTimeLocal(item.ends_at) : ""} 
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
              defaultChecked={isNew ? false : item?.is_active} 
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Published (Active)</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="is_dismissible" 
              id="is_dismissible"
              defaultChecked={isNew ? true : item?.is_dismissible} 
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_dismissible" className="text-sm font-medium text-slate-700">Dismissible</label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            {isNew ? "Create ${Domain}" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
`);
}

generateAnnouncement();
