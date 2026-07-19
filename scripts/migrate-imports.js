const fs = require("fs");
const path = require("path");

const DIRECTORIES = [
  path.join(__dirname, "../app"),
  path.join(__dirname, "../modules"),
  path.join(__dirname, "../lib"),
];

function walk(dir, callback) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

let modifiedCount = 0;

DIRECTORIES.forEach((dir) => {
  if (fs.existsSync(dir)) {
    walk(dir, (filePath) => {
      if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
        let content = fs.readFileSync(filePath, "utf-8");
        let modified = false;

        if (content.includes("@/components/ui/")) {
          content = content.replace(
            /@\/components\/ui\//g,
            "@/shared/ui/",
          );
          modified = true;
        }

        if (content.includes("@/components/providers/")) {
          content = content.replace(
            /@\/components\/providers\//g,
            "@/shared/providers/",
          );
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(filePath, content, "utf-8");
          console.log(`Updated imports in: ${filePath}`);
          modifiedCount++;
        }
      }
    });
  }
});

console.log(`Successfully migrated imports in ${modifiedCount} files.`);
