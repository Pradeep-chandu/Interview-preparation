import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;
const text = readFileSync(join(root, "interview-prep-2026.md"), "utf8");
const part = text.slice(text.indexOf("# Part VII"), text.indexOf("# Appendix"));
const questions = part.split(/(?=^### \d+\. )/m).filter((chunk) => /^### \d+\. /.test(chunk));
const tsc = join(root, "node_modules/typescript/bin/tsc");

let passed = 0;
let failed = 0;
const failures = [];

for (const chunk of questions) {
  const id = chunk.match(/^### (\d+)\. /)[1];
  const blocks = [...chunk.matchAll(/```ts\n([\s\S]*?)```/g)].map((match) => match[1]);
  if (blocks.length === 0) continue;
  const dir = mkdtempSync(join(tmpdir(), `ts-ex-${id}-`));
  const named = blocks.every((block) => block.startsWith("// file: "));
  let args;
  if (named) {
    for (const block of blocks) {
      const name = block.match(/^\/\/ file: (\S+)/)[1];
      const body = block.replace(/^\/\/ file: \S+\n/, "");
      writeFileSync(join(dir, name), body);
    }
    writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module" }));
    writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        strict: true,
        target: "ES2022",
        module: "Node16",
        moduleResolution: "Node16",
        noEmit: true,
        skipLibCheck: true,
        types: [],
      },
      include: ["**/*.ts", "**/*.d.ts"],
    }));
    args = ["-p", dir];
  } else {
    writeFileSync(join(dir, "snippet.ts"), blocks.join("\n"));
    writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        strict: true,
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "bundler",
        lib: ["ES2022", "DOM"],
        noEmit: true,
        skipLibCheck: true,
        types: [],
      },
      files: ["snippet.ts"],
    }));
    args = ["-p", dir];
  }
  const result = spawnSync(tsc, args, { encoding: "utf8" });
  const errors = `${result.stdout}\n${result.stderr}`.split("\n").filter((line) => line.includes("error TS"));
  if (result.status === 0 && errors.length === 0) passed += 1;
  else {
    failed += 1;
    failures.push({ id, errors: errors.slice(0, 6) });
  }
  rmSync(dir, { recursive: true, force: true });
}

const playbook = readFileSync(join(root, "senior-nodejs-mnc-playbook-2026.md"), "utf8");
const playbookBlocks = [...playbook.matchAll(/```ts\n([\s\S]*?)```/g)].map((match) => match[1]);
let playbookPassed = 0;
for (const [index, block] of playbookBlocks.entries()) {
  const id = `playbook-${index + 1}`;
  const dir = mkdtempSync(join(tmpdir(), `ts-pb-${index}-`));
  writeFileSync(join(dir, "snippet.ts"), block);
  writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      strict: true,
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      lib: ["ES2022"],
      noEmit: true,
      skipLibCheck: true,
      types: [],
    },
    files: ["snippet.ts"],
  }));
  const result = spawnSync(tsc, ["-p", dir], { encoding: "utf8" });
  const errors = `${result.stdout}\n${result.stderr}`.split("\n").filter((line) => line.includes("error TS"));
  if (result.status === 0 && errors.length === 0) playbookPassed += 1;
  else failures.push({ id, errors: errors.slice(0, 6) });
  rmSync(dir, { recursive: true, force: true });
}

const playbookFailed = playbookBlocks.length - playbookPassed;
console.log(`questions_with_ts ${passed + failed} passed ${passed} failed ${failed}`);
console.log(`playbook_ts ${playbookBlocks.length} passed ${playbookPassed} failed ${playbookFailed}`);
for (const failure of failures) {
  console.log(`FAIL ${failure.id}`);
  for (const line of failure.errors) console.log(`  ${line}`);
}
process.exit(failed === 0 && playbookFailed === 0 ? 0 : 1);
