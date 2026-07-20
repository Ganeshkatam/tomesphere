const fs = require('fs');

const files = [
  'modules/platform/security/application/BearerAuthGuard.ts',
  'modules/platform/storage/actions/storage.ts',
  'modules/reading/books/presentation/screens/BookDetailScreen.tsx',
  'modules/reading/books/presentation/screens/ExploreScreen.tsx',
  'modules/reading/library/actions/library.ts',
  'modules/reading/library/presentation/screens/LibraryScreen.tsx'
];

const importStmt = 'import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";';

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('@/shared/infrastructure/identity/SupabaseIdentityProvider')) {
    if (content.startsWith('"use server";') || content.startsWith("'use server';")) {
      content = content.replace(/^(["']use server["'];?)/, `$1\n${importStmt}`);
    } else {
      content = `${importStmt}\n${content}`;
    }
    fs.writeFileSync(file, content);
    console.log(`Fixed imports in ${file}`);
  }
});
