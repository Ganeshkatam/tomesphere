const fs = require('fs');
const path = require('path');

function replaceFile(path, replacements) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replacements) {
    if (search instanceof RegExp) {
      content = content.replace(search, replace);
    } else {
      content = content.split(search).join(replace);
    }
  }
  fs.writeFileSync(path, content);
  console.log('Fixed', path);
}

// Global UI fixes for .success and .data
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let orig = content;
      
      // We want to replace `var.success` with nothing, but only in logical checks like `if (var.success)` -> `if (var)`
      // Or `if (!var.success)` -> `if (!var)`
      content = content.replace(/if\s*\(\!([A-Za-z0-9_]+)\.success\)/g, 'if (!$1)');
      content = content.replace(/if\s*\(([A-Za-z0-9_]+)\.success\)/g, 'if ($1)');
      
      // `var.success ? var.data : null` -> `var`
      content = content.replace(/([A-Za-z0-9_]+)\.success\s*\?\s*\1\.data\s*:\s*([^;\n]+)/g, '($1 || $2)');
      
      // `var.data` -> `var` when used as property access, but be careful not to break legitimate data (like supabase data).
      // We know which ones were ActionResult unwraps. Let's just do it for specific ones:
      // result, res, bookRes, userRes, sessionRes, collectionsRes, notesRes, bookmarksRes, highlightsRes, syncRes, initialResults
      const vars = ['result', 'res', 'bookRes', 'userRes', 'sessionRes', 'collectionsRes', 'notesRes', 'bookmarksRes', 'highlightsRes', 'syncRes', 'initialResults', 'continueReadingResult', 'readingStreakResult'];
      
      for (const v of vars) {
        // e.g. `result.data` -> `result`
        const regex = new RegExp(`\\b${v}\\.data\\b`, 'g');
        content = content.replace(regex, v);
        
        // e.g. `result.success` -> `true` (if not caught by if-statements)
        const regex2 = new RegExp(`\\b${v}\\.success\\b`, 'g');
        content = content.replace(regex2, 'true');
        
        // e.g. `result.error` -> `"Error"`
        const regex3 = new RegExp(`\\b${v}\\.error\\b`, 'g');
        content = content.replace(regex3, '"Error"');
      }

      if (content !== orig) {
        fs.writeFileSync(fullPath, content);
        console.log(`Cleaned up ${fullPath}`);
      }
    }
  }
}

walk(path.join(__dirname, 'modules'));
walk(path.join(__dirname, 'app'));

// Manual precision fixes for handler outputs
replaceFile('modules/reading/reader/application/commands/FinishReadingSession/handler.ts', [
  ['return {\r\n        success: true,\r\n        data: {\r\n          sessionId: session.id,\r\n          durationSeconds: session.totalDurationSeconds,\r\n        },\r\n      };', 'return { sessionId: session.id, durationSeconds: session.totalDurationSeconds };'],
  ['return {\n        success: true,\n        data: {\n          sessionId: session.id,\n          durationSeconds: session.totalDurationSeconds,\n        },\n      };', 'return { sessionId: session.id, durationSeconds: session.totalDurationSeconds };']
]);

replaceFile('modules/reading/reader/application/commands/LogHighlight/handler.ts', [
  ['return {\r\n        success: true,\r\n        data: { highlightId: highlight.id },\r\n      };', 'return { highlightId: highlight.id };'],
  ['return {\n        success: true,\n        data: { highlightId: highlight.id },\n      };', 'return { highlightId: highlight.id };']
]);

replaceFile('modules/reading/search/actions/search.ts', [
  ['import { ActionResult } from "@/modules/shared/core/types/ActionResult";\n', ''],
  ['import { ActionResult } from "@/modules/shared/core/types/ActionResult";\r\n', ''],
  ['return {\r\n      success: true,\r\n      data: result,\r\n    };', 'return result;'],
  ['return {\n      success: true,\n      data: result,\n    };', 'return result;'],
  ['return {\r\n      success: true,\r\n      data: {\r\n        books: result.books,\r\n        count: result.count,\r\n        page: result.page,\r\n        pageSize: result.pageSize,\r\n        hasMore: result.hasMore,\r\n      },\r\n    };', 'return result;'],
  ['return {\n      success: true,\n      data: {\n        books: result.books,\n        count: result.count,\n        page: result.page,\n        pageSize: result.pageSize,\n        hasMore: result.hasMore,\n      },\n    };', 'return result;']
]);

