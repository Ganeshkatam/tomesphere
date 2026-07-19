const fs = require("fs");
const path = require("path");

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".swc",
  "dist",
  "build",
  "coverage",
  "scratch",
]);

function buildTree(dir, prefix = "") {
  let result = "";

  let items;
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return "";
  }

  // Sort items: directories first, then files, both alphabetically
  items.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  // Filter ignored items
  items = items.filter((item) => !IGNORED_DIRS.has(item.name));

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;
    const pointer = isLast ? "└── " : "├── ";

    result += `${prefix}${pointer}${item.name}\n`;

    if (item.isDirectory()) {
      const extension = isLast ? "    " : "│   ";
      result += buildTree(path.join(dir, item.name), prefix + extension);
    }
  }

  return result;
}

function generateStructure() {
  const rootDir = process.cwd();
  const tree = buildTree(rootDir);

  const content = `# Project Structure

\`\`\`text
tomesphere-app
${tree}\`\`\`
`;

  // Generate timestamp in format YYYYMMDD_HHMMSS
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const timestamp = `${yyyy}${mm}${dd}_${hh}${min}${ss}`;

  const filename = `docs/tree/project_structure_${timestamp}.md`;

  // Write to timestamped file
  fs.writeFileSync(filename, content);

  // Also update the main project_structure.md so it's always the latest
  fs.writeFileSync("project_structure.md", content);

  console.log(
    `Successfully generated ${filename} and updated project_structure.md`,
  );
}

generateStructure();
