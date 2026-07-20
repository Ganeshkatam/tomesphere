const fs = require('fs');

const fileReplacements = [
  {
    path: 'admin/src/app/announcements/[id]/page.tsx',
    search: 'import { Database } from "../../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../../shared/core/types/database";'
  },
  {
    path: 'admin/src/app/announcements/page.tsx',
    search: 'import { Database } from "../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../shared/core/types/database";'
  },
  {
    path: 'admin/src/app/collections/[id]/page.tsx',
    search: 'import { Database } from "../../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../../shared/core/types/database";'
  },
  {
    path: 'admin/src/app/collections/page.tsx',
    search: 'import { Database } from "../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../shared/core/types/database";'
  },
  {
    path: 'admin/src/app/featured_books/page.tsx',
    search: 'import { Database } from "../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../shared/core/types/database";'
  },
  {
    path: 'admin/src/app/languages/[id]/page.tsx',
    search: 'import { Database } from "../../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../../shared/core/types/database";'
  },
  {
    path: 'admin/src/app/languages/page.tsx',
    search: 'import { Database } from "../../../../../shared/core/types/database";',
    replace: 'import { Database } from "../../../../../../shared/core/types/database";'
  },
  {
    path: 'modules/books/infrastructure/SupabaseBookFileRepository.ts',
    search: 'import { Database } from "../../shared/core/types/database";',
    replace: 'import { Database } from "../../../shared/core/types/database";'
  }
];

for (const fr of fileReplacements) {
  if (fs.existsSync(fr.path)) {
    let content = fs.readFileSync(fr.path, 'utf8');
    content = content.replace(fr.search, fr.replace);
    fs.writeFileSync(fr.path, content);
  }
}

// SupabaseAnnouncementRepository.ts
const annRepo = 'modules/announcements/infrastructure/SupabaseAnnouncementRepository.ts';
if (fs.existsSync(annRepo)) {
  let content = fs.readFileSync(annRepo, 'utf8');
  content = content.replace(/is_dismissible: data\.is_dismissible,/g, 'is_dismissible: data.is_dismissible ?? false,');
  content = content.replace(/is_active: data\.is_active,/g, 'is_active: data.is_active ?? false,');
  // Starts_at / ends_at
  content = content.replace(/starts_at: entity\.starts_at,/g, 'starts_at: entity.starts_at || null,');
  content = content.replace(/ends_at: entity\.ends_at,/g, 'ends_at: entity.ends_at || null,');
  fs.writeFileSync(annRepo, content);
}

// SupabaseBookFileRepository.ts language
const fileRepo = 'modules/books/infrastructure/SupabaseBookFileRepository.ts';
if (fs.existsSync(fileRepo)) {
  let content = fs.readFileSync(fileRepo, 'utf8');
  content = content.replace(/language: file\.language \|\| 'en',/g, "language: 'en',");
  fs.writeFileSync(fileRepo, content);
}

// Fix SearchIndexer and BookMapper.spec-ref.ts
const searchIndexer = 'modules/discovery/search/infrastructure/projections/SearchIndexer.ts';
if (fs.existsSync(searchIndexer)) {
  let content = fs.readFileSync(searchIndexer, 'utf8');
  content = content.replace(/language: bookRow.language/g, 'language: null /* removed language from books */');
  fs.writeFileSync(searchIndexer, content);
}

const bookMapperSpec = 'modules/books/infrastructure/mappers/BookMapper.spec-ref.ts';
if (fs.existsSync(bookMapperSpec)) {
  let content = fs.readFileSync(bookMapperSpec, 'utf8');
  content = content.replace(/language: 'English',/g, 'language_id: null,');
  fs.writeFileSync(bookMapperSpec, content);
}
