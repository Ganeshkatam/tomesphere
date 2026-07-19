const fs = require("fs");
const path = require("path");

const IGNORE = new Set([
  "node_modules",
  ".git",
  ".next",
  "out",
  "dist",
  "build",
  ".swc",
]);

function getTree(dir, prefix = "") {
  let output = "";
  const items = fs
    .readdirSync(dir)
    .filter((i) => !IGNORE.has(i))
    .sort();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    output += `${prefix}${isLast ? "└── " : "├── "}${item}\n`;

    if (stats.isDirectory()) {
      output += getTree(fullPath, prefix + (isLast ? "    " : "│   "));
    }
  }
  return output;
}

const tree = getTree(process.cwd());
const content = `# Project Structure\n\n\`\`\`ext\ntomesphere-app\n${tree}\`\`\`\n`;
fs.writeFileSync("project_structure.md", content);
console.log("project_structure.md updated");
