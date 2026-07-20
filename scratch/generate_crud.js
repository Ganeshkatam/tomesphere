const fs = require('fs');
const path = require('path');

function generate(domain, domainPlural) {
  const Domain = domain.charAt(0).toUpperCase() + domain.slice(1);
  const DomainPlural = domainPlural.charAt(0).toUpperCase() + domainPlural.slice(1);
  
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
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}
`);

  // Repository
  fs.writeFileSync(`${basePath}/domain/repositories/${Domain}Repository.ts`, `import { ${Domain} } from "../entities/${Domain}";

export interface ${Domain}Repository {
  findById(id: string): Promise<${Domain} | null>;
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
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
      ${domain === 'genre' ? 'icon: data.icon ?? undefined,' : ''}
    };
  }

  async save(entity: ${Domain}): Promise<void> {
    const payload: any = {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      updated_at: new Date().toISOString(),
    };
    ${domain === 'genre' ? 'payload.icon = entity.icon;' : ''}
    
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
import { v4 as uuidv4 } from "uuid";

export interface Create${Domain}Command {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export class Create${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Create${Domain}Command): Promise<string> {
    const id = uuidv4();
    await this.repository.save({
      id,
      name: command.name,
      slug: command.slug,
      description: command.description,
      icon: command.icon,
    });
    return id;
  }
}
`);

  fs.writeFileSync(`${basePath}/application/commands/Update${Domain}Command.ts`, `import { ${Domain}Repository } from "../../domain/repositories/${Domain}Repository";

export interface Update${Domain}Command {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export class Update${Domain}Handler {
  constructor(private readonly repository: ${Domain}Repository) {}

  async execute(command: Update${Domain}Command): Promise<void> {
    const entity = await this.repository.findById(command.id);
    if (!entity) throw new Error(\`${Domain} with id \${command.id} not found\`);

    if (command.name !== undefined) entity.name = command.name;
    if (command.slug !== undefined) entity.slug = command.slug;
    if (command.description !== undefined) entity.description = command.description;
    if (command.icon !== undefined) entity.icon = command.icon;

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

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;

  if (!name || !slug) throw new Error("Name and Slug are required");

  await handler.execute({
    name,
    slug,
    description: description || undefined,
    icon: icon || undefined,
  });

  revalidatePath("/${domainPlural}");
  return { success: true };
}

export async function update${Domain}Action(formData: FormData) {
  const repository = await getRepository();
  const handler = new Update${Domain}Handler(repository);

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;

  if (!id) throw new Error("ID is required");

  await handler.execute({
    id,
    name: name || undefined,
    slug: slug || undefined,
    description: description || undefined,
    icon: icon || undefined,
  });

  revalidatePath("/${domainPlural}");
  revalidatePath(\`/${domainPlural}/\${id}\`);
  return { success: true };
}

export async function delete${Domain}Action(id: string) {
  const repository = await getRepository();
  const handler = new Delete${Domain}Handler(repository);

  await handler.execute({ id });

  revalidatePath("/${domainPlural}");
  return { success: true };
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

  const { data: items } = await supabase.from("${domainPlural}").select("*").order("name");

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
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Name</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Slug</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">{item.slug}</td>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={item?.name} 
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

        ${domain === 'genre' ? '<div><label className="block text-sm font-medium text-slate-700 mb-1">Icon</label><input type="text" name="icon" defaultValue={item?.icon || ""} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" /></div>' : ''}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            name="description" 
            defaultValue={item?.description || ""} 
            rows={4}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
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

generate('genre', 'genres');
generate('subject', 'subjects');
