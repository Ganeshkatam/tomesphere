const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove import
  content = content.replace(/import\s*\{\s*ActionResult\s*\}\s*from\s*['"]@\/modules\/shared\/core\/types\/ActionResult['"];?\r?\n?/g, '');

  // 2. Replace Promise<ActionResult<T>> with Promise<T>
  // This might be tricky because T can be complex.
  // We can use a regex that matches Promise<ActionResult< (anything) >>
  // But nested brackets are hard. Let's do a simple replace first.
  content = content.replace(/Promise<ActionResult<([^>]+)>>/g, 'Promise<$1>');
  content = content.replace(/Promise<ActionResult<([^>]+>\s*)>>/g, 'Promise<$1>');
  content = content.replace(/ActionResult<([^>]+)>/g, '$1');

  // 3. Replace return { success: true, data: X } with return X
  content = content.replace(/return\s*\{\s*success:\s*true,\s*data:\s*([^}]+)\s*\};/g, 'return $1;');
  // Just `data`
  content = content.replace(/return\s*\{\s*success:\s*true,\s*data\s*\};/g, 'return data;');
  
  // 4. Replace return { success: true } with return;
  content = content.replace(/return\s*\{\s*success:\s*true\s*\};/g, 'return;');

  // 5. Replace return { success: false, error: X } with throw new Error(X)
  content = content.replace(/return\s*\{\s*success:\s*false,\s*error:\s*([^}]+)\s*\};/g, 'throw new Error($1);');

  // 6. Sometimes it's return { error: X }
  content = content.replace(/return\s*\{\s*error:\s*([^}]+)\s*\};/g, 'throw new Error($1);');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
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
      processFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'modules'));
walk(path.join(__dirname, 'app'));
