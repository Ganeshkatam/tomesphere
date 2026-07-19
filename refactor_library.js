const fs = require('fs');

const path = 'modules/reading/library/actions/library.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import { ServerActionResult }')) {
  content = content.replace(
    'import { SupabaseIdentityProvider }',
    'import { ServerActionResult } from "@/lib/actions/action-result";\nimport { SupabaseIdentityProvider }'
  );
}

const regex = /export async function (\w+)\(([^)]*)\): Promise<([^>]+)>\s*\{\s*try \{([\s\S]*?)return (.*?);\s*\} catch \(error: any\) \{\s*throw new Error\(error\.message \);\s*\}\s*\}/g;

content = content.replace(regex, (match, name, args, returnType, body, retVal) => {
  return `export async function ${name}(${args}): Promise<ServerActionResult<${returnType}>> {
  try {${body}return { success: true, data: ${retVal.trim()} };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Refactored library.ts');
