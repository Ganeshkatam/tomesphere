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

  // Replace interface
  content = content.replace(
    new RegExp(`interface ${widget}WidgetProps {\\s*result: (.*?) \\| null;\\s*}`),
    `interface ${widget}WidgetProps {\n  promise: Promise<$1 | null>;\n}`
  );

  // Replace export function
  content = content.replace(
    new RegExp(`export function ${widget}Widget\\({ result(?:,.*?)? }: ${widget}WidgetProps\\) {`),
    `export async function ${widget}Widget({ promise }: ${widget}WidgetProps) {\n  try {\n    const result = await promise;`
  );

  // Find the last brace and close the try/catch
  const lastBraceIndex = content.lastIndexOf('}');
  
  const errorReturn = `
  } catch (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full">
        <p className="font-semibold">Unable to load.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }
}

export function ${widget}Skeleton() {
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full min-h-[200px] animate-pulse">
      <div className="h-6 bg-[var(--surface-overlay)] rounded w-1/3 mb-6"></div>
      <div className="h-24 bg-[var(--surface-overlay)] rounded w-full"></div>
    </div>
  );
}
`;

  content = content.substring(0, lastBraceIndex) + errorReturn;

  fs.writeFileSync(filePath, content);
});

console.log("Refactored widgets.");
