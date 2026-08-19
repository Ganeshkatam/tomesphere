import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputFile = path.join(rootDir, "project_structure.md");

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "node_modules",
  ".swc",
  "coverage",
  "dist",
  "build",
  ".gemini",
  ".turbo",
]);

const IGNORED_FILES = new Set([
  "project_structure.md",
  ".DS_Store",
  "Thumbs.db",
]);

function buildTree(dirPath, prefix = "") {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  // Filter ignored items
  const filtered = entries.filter((entry) => {
    if (entry.isDirectory()) {
      return !IGNORED_DIRECTORIES.has(entry.name);
    }
    return !IGNORED_FILES.has(entry.name);
  });

  // Sort directories first, then alphabetical
  filtered.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });

  const lines = [];

  for (let i = 0; i < filtered.length; i++) {
    const entry = filtered[i];
    const isLast = i === filtered.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";

    lines.push(`${prefix}${pointer}${entry.name}`);

    if (entry.isDirectory()) {
      const subLines = buildTree(path.join(dirPath, entry.name), prefix + childPrefix);
      lines.push(...subLines);
    }
  }

  return lines;
}

function generateTree() {
  const rootName = path.basename(rootDir);
  const treeLines = buildTree(rootDir);
  const content = `# Project Structure\n\n\`\`\`text\n${rootName}\n${treeLines.join("\n")}\n\`\`\`\n`;

  fs.writeFileSync(outputFile, content, "utf8");
  console.log(`Successfully updated ${outputFile}`);
}

generateTree();
