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

  // Replace occurrences of ReadRepository with ReadModel
  content = content.replace(/ReadRepository/g, 'ReadModel');
  content = content.replace(/QueryRepository/g, 'ReadModel');

  // Also need to fix imports because paths changed:
  // domain/repositories/LibraryReadModel -> application/ports/read-models/LibraryReadModel
  content = content.replace(/domain\/repositories\/(\w+)ReadModel/g, 'application/ports/read-models/$1ReadModel');
  content = content.replace(/application\/repositories\/(\w+)ReadModel/g, 'application/ports/read-models/$1ReadModel');
  
  // infrastructure/repositories/Supabase...ReadModel -> infrastructure/read-models/Supabase...ReadModel
  content = content.replace(/infrastructure\/repositories\/Supabase(\w+)ReadModel/g, 'infrastructure/read-models/Supabase$1ReadModel');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
