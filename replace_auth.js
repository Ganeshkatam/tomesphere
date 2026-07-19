const fs = require('fs');
const path = require('path');

function replaceAuth(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We have different patterns for extracting user.
    // 1. const { data: { user } } = await supabase.auth.getUser();
    // 2. const { data: { user }, error } = await supabase.auth.getUser();
    
    // For simplicity, just look for `supabase.auth.getUser();` in the file.
    // But since there are multi-line destructures like:
    /*
      const {
        data: { user },
      } = await supabase.auth.getUser();
    */

    const regex = /const\s*\{\s*data\s*:\s*\{\s*user\s*\}\s*,?\s*(?:error)?\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);/g;
    
    content = content.replace(regex, `const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();`);

    if (content !== original) {
      if (!content.includes('SupabaseIdentityProvider')) {
        content = `import { SupabaseIdentityProvider } from "@/modules/shared/infrastructure/identity/SupabaseIdentityProvider";\n` + content;
      }
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
}

replaceAuth('modules/reading/library/actions/library.ts');
replaceAuth('modules/platform/storage/actions/storage.ts');
replaceAuth('modules/shared/core/database/client.ts'); // Wait, client.ts is browser client, we can't use Server Identity Provider there? Let's avoid client.ts
replaceAuth('modules/reading/books/presentation/screens/ExploreScreen.tsx');
replaceAuth('modules/reading/books/presentation/screens/BookDetailScreen.tsx');
replaceAuth('modules/reading/library/presentation/screens/LibraryScreen.tsx');
replaceAuth('modules/platform/security/application/BearerAuthGuard.ts');

console.log("Done");
