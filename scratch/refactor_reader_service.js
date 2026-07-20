const fs = require('fs');

const path = 'modules/reading/reader/application/ReaderService.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace `const res = await ...Action(...); if (res) {` patterns
content = content.replace(/const res = await (getHighlightsAction|getBookmarksAction|getNotesAction|createHighlightAction|createNoteAction|createBookmarkAction)\((.*?)\);\s*if\s*\(res\)\s*\{([\s\S]*?)\}/g, (match, fnName, args, body) => {
  // Inside body, replace `res` with `res.data` (being careful not to replace `res` if it's a substring)
  let updatedBody = body.replace(/\bres\b/g, 'res.data');
  return `const res = await ${fnName}(${args});\n      if (res.success) {${updatedBody}} else {\n        console.error("Action failed:", res.error.message);\n      }`;
});

content = content.replace(/await (deleteHighlightAction|updateNoteAction|deleteNoteAction|deleteBookmarkAction|updateReaderPositionAction|completeReadingSessionAction)\((.*?)\);/g, (match, fnName, args) => {
  return `const res = await ${fnName}(${args});\n      if (!res.success) throw new Error(res.error.message);`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Refactored ReaderService.ts');
