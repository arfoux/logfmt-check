import test from "node:test";
import assert from "node:assert/strict";
import { checkText, parseLine } from "../src/logfmt.mjs";

test("parses simple pairs", () => {
  assert.deepEqual(parseLine("level=info msg=ready").pairs, { level: "info", msg: "ready" });
});

test("keeps quoted values with spaces", () => {
  assert.deepEqual(parseLine('msg="hello world" level=warn').pairs, { msg: "hello world", level: "warn" });
});

test("reports tokens without a key", () => {
  const { errors } = parseLine("level=info bare-token");
  assert.equal(errors.length, 1);
  assert.equal(errors[0].reason, "not a key=value pair");
});

test("reports invalid keys", () => {
  const { errors } = parseLine("bad$key=1");
  assert.equal(errors[0].reason, "invalid key");
});

test("counts lines and skips blanks", () => {
  const { lines, malformed } = checkText("a=1\n\n  \nb=\n");
  assert.equal(lines, 2);
  assert.deepEqual(malformed, []);
});
