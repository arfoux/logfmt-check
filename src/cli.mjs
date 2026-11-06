#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { checkText } from "./logfmt.mjs";

let input = "";
try {
  input = readFileSync(0, "utf8");
} catch {
  input = "";
}

const { lines, malformed } = checkText(input);

if (malformed.length === 0) {
  console.log(`ok: ${lines} line(s)`);
  process.exit(0);
}

for (const problem of malformed) {
  console.error(`line ${problem.line}: ${problem.reason}: ${problem.token}`);
}
console.error(`${malformed.length} malformed token(s) in ${lines} line(s)`);
process.exit(1);
