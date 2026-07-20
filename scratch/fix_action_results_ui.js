const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Pattern: if (!res.success) throw new Error(...)
  content = content.replace(/if\s*\(\!?([A-Za-z0-9_]+)\.success\)\s*\{\s*throw\s+new\s+Error\([^)]*\);\s*\}/g, '');
  content = content.replace(/if\s*\(\!([A-Za-z0-9_]+)\.success\)\s*throw\s+new\s+Error\([^)]*\);/g, '');
  
  // Pattern: const X = res.data;
  content = content.replace(/const\s+([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+)\.data;/g, 'const $1 = $2;');
  content = content.replace(/([A-Za-z0-9_]+)\.data/g, '$1');

  // Fix: Property 'success' does not exist
  content = content.replace(/([A-Za-z0-9_]+)\.success\s*\?\s*\1\.data\s*:\s*null/g, '$1');
  content = content.replace(/([A-Za-z0-9_]+)\.success\s*\?\s*\1\.data\s*:\s*\[\]/g, '$1');
  
  // Fix imports missing
  content = content.replace(/import\s*\{\s*ActionResult\s*\}\s*from\s*['"](.*)['"];?\r?\n?/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed UI unwrapping in ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'modules'));
walk(path.join(__dirname, 'app'));
