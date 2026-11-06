const KEY = /^[A-Za-z0-9_.\-]+$/;

/** Split a logfmt line into tokens, keeping quoted values intact. */
function tokenize(line) {
  const tokens = [];
  let current = "";
  let quote = null;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === " ") {
      if (current !== "") tokens.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current !== "") tokens.push(current);
  return tokens;
}

/** Parse one logfmt line into key/value pairs; malformed tokens are reported. */
export function parseLine(line) {
  const pairs = {};
  const errors = [];
  for (const token of tokenize(line)) {
    const eq = token.indexOf("=");
    if (eq < 1) {
      errors.push({ token, reason: "not a key=value pair" });
      continue;
    }
    const key = token.slice(0, eq);
    if (!KEY.test(key)) {
      errors.push({ token, reason: "invalid key" });
      continue;
    }
    pairs[key] = token.slice(eq + 1);
  }
  return { pairs, errors };
}

/** Check a whole text; reports the line number for every malformed token. */
export function checkText(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  const malformed = [];
  for (const [index, line] of lines.entries()) {
    const { errors } = parseLine(line);
    for (const error of errors) malformed.push({ line: index + 1, ...error });
  }
  return { lines: lines.length, malformed };
}
