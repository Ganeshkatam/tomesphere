const fs = require('fs');

const globFiles = [
  'admin/src/app/announcements/[id]/page.tsx',
  'admin/src/app/announcements/page.tsx',
  'admin/src/app/collections/[id]/page.tsx',
  'admin/src/app/collections/page.tsx',
  'admin/src/app/featured_books/page.tsx',
  'admin/src/app/languages/[id]/page.tsx',
  'admin/src/app/languages/page.tsx',
  'admin/src/features/languages/actions.ts',
  'admin/src/features/collections/actions.ts',
  'admin/src/features/featured_books/actions.ts',
  'admin/src/features/announcements/actions.ts',
  'admin/src/features/books/file-actions.ts'
];

globFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import \{ Database \} from ".*?shared\/core\/types\/database";/g, 'import { Database } from "@/shared/core/types/database";');
    fs.writeFileSync(f, content);
  }
});

let annRepo = 'modules/announcements/infrastructure/SupabaseAnnouncementRepository.ts';
if (fs.existsSync(annRepo)) {
  let content = fs.readFileSync(annRepo, 'utf8');
  content = content.replace(/updated_at: new Date\(\)\.toISOString\(\),\s*\};/s, 'updated_at: new Date().toISOString(),\n    } as any;');
  fs.writeFileSync(annRepo, content);
}

let bookRepo = 'modules/books/infrastructure/SupabaseBookFileRepository.ts';
if (fs.existsSync(bookRepo)) {
  let content = fs.readFileSync(bookRepo, 'utf8');
  content = content.replace(/language: 'en',/g, ''); // delete language entirely
  content = content.replace(/import \{ Database \} from ".*?shared\/core\/types\/database";/g, 'import { Database } from "../../../shared/core/types/database";');
  fs.writeFileSync(bookRepo, content);
}

let bookMapper = 'modules/books/infrastructure/mappers/BookMapper.spec-ref.ts';
if (fs.existsSync(bookMapper)) {
  let content = fs.readFileSync(bookMapper, 'utf8');
  content = content.replace(/language_id: null,/g, '');
  fs.writeFileSync(bookMapper, content);
}

let searchIndexer = 'modules/discovery/search/infrastructure/projections/SearchIndexer.ts';
if (fs.existsSync(searchIndexer)) {
  let content = fs.readFileSync(searchIndexer, 'utf8');
  content = content.replace(/language: null \/\* removed language from books \*\//g, 'language_id: null');
  fs.writeFileSync(searchIndexer, content);
}
