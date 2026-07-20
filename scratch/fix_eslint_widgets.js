const fs = require('fs');
const path = require('path');

const widgets = [
  'ContinueReading',
  'Goal',
  'Streak',
  'CurrentReading',
  'Library',
  'SuggestedReads',
  'Statistics',
  'Activity',
  'ReadingCalendar'
];

const componentsDir = path.join(__dirname, '..', 'modules', 'home', 'presentation', 'components');

widgets.forEach(widget => {
  const filePath = path.join(componentsDir, `${widget}Widget.tsx`);
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to transform:
  // try {
  //   const result = await promise;
  //   if (!result) { return <Empty/> }
  //   return <Success/>
  // } catch (e) {
  //   return <Error/>
  // }
  
  // to:
  // let result = null;
  // let error = false;
  // try { result = await promise; } catch (e) { error = true; }
  // if (error) return <Error/>
  // if (!result) return <Empty/>
  // return <Success/>

  content = content.replace(/try {\s*const result = await promise;/g, "let result: any = null;\n  let isError = false;\n  try {\n    result = await promise;\n  } catch (error) {\n    isError = true;\n  }\n\n  if (isError) {\n    return (\n      <div className=\"p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full\">\n        <p className=\"font-semibold\">Unable to load.</p>\n        <p className=\"text-sm opacity-80\">{\"Error\"}</p>\n      </div>\n    );\n  }\n");

  // Now remove the trailing catch block that was there
  content = content.replace(/} catch \(error\) {[\s\S]*?\}[\s\S]*?export function/, "export function");

  fs.writeFileSync(filePath, content);
});

console.log("Fixed JSX in try/catch for widgets.");
