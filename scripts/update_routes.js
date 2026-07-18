const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirs = [path.join(process.cwd(), 'app'), path.join(process.cwd(), 'modules')];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walk(dir, (filePath) => {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('/explore')) {
          content = content.replace(/'\/explore'/g, "'/discover'");
          content = content.replace(/"\/explore"/g, '"/discover"');
          content = content.replace(/`\/explore`/g, '`/discover`');
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated ${filePath}`);
        }
      }
    });
  }
});
