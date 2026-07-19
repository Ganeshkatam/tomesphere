const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'modules')).concat(walk(path.join(__dirname, 'app')));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Since some interfaces moved from `domain/repositories/` to `application/ports/read-models/`
  // and some from `application/repositories/` to `application/ports/read-models/`
  // We should globally search for imports that refer to them and fix the path.
  
  // Any import ending with ReadModel or ReadModel' should have its path updated if it still points to repositories
  content = content.replace(/(from\s+['"].*?)repositories(.*?ReadModel['"])/g, '$1ports/read-models$2');
  
  // Also fix imports like `import { ... } from '../../repositories/DiscoveryReadModel'` -> `import { ... } from '../../ports/read-models/DiscoveryReadModel'`
  // Wait, if it's relative like `../../repositories/DiscoveryReadModel`, it becomes `../../ports/read-models/DiscoveryReadModel`.
  content = content.replace(/(\/|\.\.)repositories(\/.*ReadModel)/g, '$1ports/read-models$2');
  content = content.replace(/infrastructure\/repositories\/Supabase(\w+)ReadModel/g, 'infrastructure/read-models/Supabase$1ReadModel');
  
  // DashboardReadModelRepository was missed. It should be DashboardReadModel
  content = content.replace(/DashboardReadModelRepository/g, 'DashboardReadModel');
  
  // If we changed application/repositories to application/ports/read-models, some relative paths need `ports/` inserted.
  content = content.replace(/\.\.\/\.\.\/repositories\/DiscoveryReadModel/g, '../../ports/read-models/DiscoveryReadModel');
  content = content.replace(/\.\.\/\.\.\/application\/ports\/read-models\/AnnouncementReadModel/g, '../../../application/ports/read-models/AnnouncementReadModel');
  content = content.replace(/\.\.\/\.\.\/application\/ports\/read-models\/PlatformStatisticsReadModel/g, '../../../application/ports/read-models/PlatformStatisticsReadModel');

  // Fix SupabaseAnnouncementReadRepository.ts which didn't get renamed?
  // Let me rename files that have 'Repository' instead of 'Model'
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated imports in ${file}`);
  }
});
