const fs = require('fs');

const path = 'd:\\websites\\tomesphere-app\\modules\\platform\\profile\\actions\\profile.ts';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// 1-indexed. Lines 101 to 260 are duplicated.
// We keep lines 1 to 100, and lines 261 onwards.
const newLines = [...lines.slice(0, 100), ...lines.slice(260)];

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log('Fixed profile.ts');
