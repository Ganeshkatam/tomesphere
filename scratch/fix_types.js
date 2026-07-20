const fs = require('fs');
const files = [
  'd:/websites/tomesphere-app/admin/src/app/authors/[id]/page.tsx',
  'd:/websites/tomesphere-app/admin/src/app/genres/[id]/page.tsx',
  'd:/websites/tomesphere-app/admin/src/app/subjects/[id]/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/shared\/core\/types\/database/g, '../../../../../shared/core/types/database');
  fs.writeFileSync(file, content);
}
