const fs = require('fs');

const path = 'modules/reading/reader/actions/reader.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import { ServerActionResult }')) {
  content = content.replace(
    'import { requireAuth }',
    'import { ServerActionResult } from "@/lib/actions/action-result";\nimport { requireAuth }'
  );
}

// Regex for functions that have a defined return type (e.g. Promise<HighlightDto[]>)
const regexWithReturnType = /export async function (\w+)\(([^)]*)\): Promise<([^>]+)>\s*\{\s*try \{([\s\S]*?)return (.*?);\s*\} catch \(error: any\) \{\s*throw new Error\(error\.message \);\s*\}\s*\}/g;
content = content.replace(regexWithReturnType, (match, name, args, returnType, body, retVal) => {
  return `export async function ${name}(${args}): Promise<ServerActionResult<${returnType}>> {
  try {${body}return { success: true, data: ${retVal.trim()} };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}`;
});

// Regex for functions that have NO explicit return type (e.g. export async function getNotesAction(bookId: string) {)
const regexWithoutReturnType = /export async function (\w+)\(([^)]*)\)\s*\{\s*try \{([\s\S]*?)return (.*?);\s*\} catch \(error: any\) \{\s*throw new Error\(error\.message \);\s*\}\s*\}/g;
content = content.replace(regexWithoutReturnType, (match, name, args, body, retVal) => {
  return `export async function ${name}(${args}): Promise<ServerActionResult<any>> {
  try {${body}return { success: true, data: ${retVal.trim()} };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Refactored reader.ts');
