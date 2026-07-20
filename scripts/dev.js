const { spawn } = require("child_process");

const child = spawn("npx", ["next", "dev"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
});

function prependTimestamp(data) {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  const lines = data.toString().split("\n");
  return lines
    .map((line) => (line.trim() ? `[${timestamp}] ${line}` : line))
    .join("\n");
}

child.stdout.on("data", (data) => {
  process.stdout.write(prependTimestamp(data));
});

child.stderr.on("data", (data) => {
  process.stderr.write(prependTimestamp(data));
});

child.on("close", (code) => {
  process.exit(code);
});
