/**
 * Architectural Regression Checker
 * 
 * Verifies TomeSphere V1 architecture rules:
 * 1. ZERO active runtime usages of SUPABASE_SERVICE_ROLE_KEY.
 * 2. ZERO runtime callers of legacy search RPCs (search_books_fts, search_catalog).
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const SEARCH_DIRS = ["app", "modules", "shared", "admin"];
const ALLOWED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function searchFiles(dir, matchRegex, ignoreFiles = []) {
  let matches = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        matches = matches.concat(searchFiles(fullPath, matchRegex, ignoreFiles));
      }
    } else if (ALLOWED_EXTENSIONS.includes(path.extname(entry.name))) {
      if (ignoreFiles.some((ig) => fullPath.includes(ig))) continue;
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (matchRegex.test(line)) {
          // Exclude comments/types that document the prohibition or generated DB schema types
          if (
            !line.includes("Does NOT use") &&
            !line.includes("forbidden in TomeSphere") &&
            !line.includes("No runtime path may depend") &&
            !fullPath.endsWith("database.ts")
          ) {
            matches.push({ file: fullPath, line: index + 1, text: line.trim() });
          }
        }
      });
    }
  }

  return matches;
}

console.log("🔍 Checking Architectural Constraints...");

let errors = 0;

// Check 1: SUPABASE_SERVICE_ROLE_KEY
SEARCH_DIRS.forEach((dirName) => {
  const targetDir = path.join(ROOT_DIR, dirName);
  if (fs.existsSync(targetDir)) {
    const matches = searchFiles(targetDir, /SUPABASE_SERVICE_ROLE_KEY/);
    if (matches.length > 0) {
      console.error(`❌ Violation: SUPABASE_SERVICE_ROLE_KEY found in ${dirName}:`);
      matches.forEach((m) => console.error(`   ${m.file}:${m.line} -> ${m.text}`));
      errors++;
    }
  }
});

// Check 2: Legacy Search RPCs
const legacyMatches = [];
SEARCH_DIRS.forEach((dirName) => {
  const targetDir = path.join(ROOT_DIR, dirName);
  if (fs.existsSync(targetDir)) {
    const matches = searchFiles(targetDir, /search_books_fts|search_catalog/);
    legacyMatches.push(...matches);
  }
});

if (legacyMatches.length > 0) {
  console.error("❌ Violation: Legacy search RPCs called in runtime code:");
  legacyMatches.forEach((m) => console.error(`   ${m.file}:${m.line} -> ${m.text}`));
  errors++;
}

if (errors === 0) {
  console.log("✅ Architecture Verification Passed: 0 service_role dependencies, 0 legacy search callers.");
  process.exit(0);
} else {
  console.error(`❌ Architecture Verification Failed with ${errors} error(s).`);
  process.exit(1);
}
