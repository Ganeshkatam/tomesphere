import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const emojiRegex = /\p{Extended_Pictographic}/u;
const scanDirs = ["app", "modules", "shared", "lib", "styles", "supabase", "docs", "architecture", "tests", "scripts"];

function sanitizeText(text) {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/🚨/g, "[CRITICAL]")
    .replace(/❌/g, "[FORBIDDEN]")
    .replace(/✅/g, "[ALLOWED]")
    .replace(/★/g, "*");
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|json|md|sql|css)$/.test(entry.name)) {
      if (entry.name === "package-lock.json") continue;
      const original = fs.readFileSync(fullPath, "utf8");
      if (emojiRegex.test(original)) {
        const sanitized = sanitizeText(original);
        fs.writeFileSync(fullPath, sanitized, "utf8");
        console.log(`Sanitized: ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

for (const dir of scanDirs) {
  processDirectory(path.join(rootDir, dir));
}

console.log("Sanitization complete.");
