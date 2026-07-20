const fs = require('fs');
const path = require('path');

const dir = 'd:/websites/tomesphere-app/modules/home/presentation/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Widget.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // The error is because `result = await promise;` is immediately followed by `export function Skeleton()` 
  // It's missing `} catch(e) { isError = true; } return <div>Mock UI</div>; }`
  
  if (content.includes('result = await promise;') && !content.includes('} catch')) {
    content = content.replace(
      'result = await promise;',
      `result = await promise;\n  } catch(e) {\n    isError = true;\n  }\n  return <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)]">Mock UI</div>;\n}`
    );
    fs.writeFileSync(filePath, content);
  }
});
