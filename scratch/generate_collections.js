const fs = require('fs');
const path = require('path');

function generateCollection() {
  const Domain = 'Collection';
  const DomainPlural = 'Collections';
  const domain = 'collection';
  const domainPlural = 'collections';
  
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
  slug: string;
  description?: string | null;
  cover_url?: string | null;
  is_active: boolean;
}
`);

  // Repository
  fs.writeFileSync(`${basePath}/domain/repositories/${Domain}Repository.ts`, `import { ${Domain} } from "../entities/${Domain}";

export interface ${Domain}Repository {
  findById(id: string): Promise<${Domain} | null>;
  list(): Promise<${Domain}[]>;
  save(entity: ${Domain}): Promise<void>;
  delete(id: string): Promise<void>;
  updateBooks(collectionId: string, bookIds: string[]): Promise<void>;
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
      slug: data.slug,
      description: data.description,
      cover_url: data.cover_url,
      is_active: data.is_active,
    };
  }

  async list(): Promise<${Domain}[]> {
    const { data, error } = await this.client
      .from("${domainPlural}")
      .select("*")
      .order("title");

    if (error || !data) return [];
    
    return data.map(d => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      description: d.description,
      cover_url: d.cover_url,
      is_active: d.is_active,
    }));
  }

  async save(entity: ${Domain}): Promise<void> {
    const payload = {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      cover_url: entity.cover_url,
      is_active: entity.is_active,
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

  async updateBooks(collectionId: string, bookIds: string[]): Promise<void> {
    // Delete existing
    await this.client
      .from("collection_books")
      .delete()
      .eq("collection_id", collectionId);
      
    // Insert new
    if (bookIds.length > 0) {
      const payload = bookIds.map((book_id, index) => ({
        collection_id: collectionId,
        book_id,
        position: index,
      }));
      await this.client
        .from("collection_books")
        .insert(payload);
    }
  }
}
`);

  // Commands
  fs.writeFileSync(`${basePath}/application/commands/Create${Domain}Command.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Create${Domain}Command {
  title: string;
  slug: string;
  description?: string | null;
  cover_url?: string | null;
  is_active?: boolean;
}

export class Create${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Create${Domain}Command): Promise<string> {
    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      title: command.title,
      slug: command.slug,
      description: command.description,
      cover_url: command.cover_url,
      is_active: command.is_active ?? true,
    });
    return id;
  }
}
`);

  fs.writeFileSync(`${basePath}/application/commands/Update${Domain}Command.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Update${Domain}Command {
  id: string;
  title?: string;
  slug?: string;
  description?: string | null;
  cover_url?: string | null;
  is_active?: boolean;
}

export class Update${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Update${Domain}Command): Promise<void> {
    const entity = await this.repository.findById(command.id);
    if (!entity) throw new Error(\`${Domain} with id \${command.id} not found\`);

    if (command.title !== undefined) entity.title = command.title;
    if (command.slug !== undefined) entity.slug = command.slug;
    if (command.description !== undefined) entity.description = command.description;
    if (command.cover_url !== undefined) entity.cover_url = command.cover_url;
    if (command.is_active !== undefined) entity.is_active = command.is_active;

    await this.repository.save(entity);
  }
}
`);

  fs.writeFileSync(`${basePath}/application/commands/Update${Domain}BooksCommand.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Update${Domain}BooksCommand {
  collectionId: string;
  bookIds: string[];
}

export class Update${Domain}BooksHandler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Update${Domain}BooksCommand): Promise<void> {
    await this.repository.updateBooks(command.collectionId, command.bookIds);
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
export * from "./Update${Domain}BooksCommand";
export * from "./Delete${Domain}Command";
`);

  // Adapter
  fs.writeFileSync(`${adminPath}/lib/domain/${domainPlural}.ts`, `export {
  Create${Domain}Handler,
  Update${Domain}Handler,
  Update${Domain}BooksHandler,
  Delete${Domain}Handler,
} from "../../../../modules/${domainPlural}/application/commands";

export type {
  Create${Domain}Command,
  Update${Domain}Command,
  Update${Domain}BooksCommand,
  Delete${Domain}Command,
} from "../../../../modules/${domainPlural}/application/commands";

export { Supabase${Domain}Repository } from "../../../../modules/${domainPlural}/infrastructure/Supabase${Domain}Repository";
export type { ${Domain}Repository } from "../../../../modules/${domainPlural}/domain/repositories/${Domain}Repository";
export type { ${Domain} } from "../../../../modules/${domainPlural}/domain/entities/${Domain}";
`);

  // Actions
  fs.writeFileSync(`${adminPath}/features/${domainPlural}/actions.ts`, `"use server";

import { revalidatePath } from "next/cache";
import { 
  Create${Domain}Handler, 
  Update${Domain}Handler, 
  Update${Domain}BooksHandler,
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
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const cover_url = formData.get("cover_url") as string;
  const is_active = formData.get("is_active") === "on";

  if (!title || !slug) throw new Error("Title and Slug are required");

  await handler.execute({
    title,
    slug,
    description: description || null,
    cover_url: cover_url || null,
    is_active,
  });

  revalidatePath("/${domainPlural}");
  return;
}

export async function update${Domain}Action(formData: FormData) {
  const repository = await getRepository();
  const handler = new Update${Domain}Handler(repository);

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const cover_url = formData.get("cover_url") as string;
  const is_active = formData.get("is_active") === "on";

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    title: title || undefined,
    slug: slug || undefined,
    description: description || null,
    cover_url: cover_url || null,
    is_active,
  });

  revalidatePath("/${domainPlural}");
  revalidatePath(\`/${domainPlural}/\${id}\`);
  return;
}

export async function update${Domain}BooksAction(collectionId: string, bookIds: string[]) {
  const repository = await getRepository();
  const handler = new Update${Domain}BooksHandler(repository);

  await handler.execute({ collectionId, bookIds });

  revalidatePath("/${domainPlural}");
  revalidatePath(\`/${domainPlural}/\${collectionId}\`);
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

  const { data: items } = await supabase.from("${domainPlural}").select("*").order("title");

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
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Slug</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Status</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">{item.slug}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2 py-1 text-xs rounded-full \${item.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}\`}>
                    {item.is_active ? 'Active' : 'Inactive'}
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
            ))}
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input 
            type="text" 
            name="slug" 
            defaultValue={item?.slug} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cover URL</label>
          <input 
            type="url" 
            name="cover_url" 
            defaultValue={item?.cover_url || ""} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            name="description" 
            defaultValue={item?.description || ""} 
            rows={4}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
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
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active</label>
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

generateCollection();
