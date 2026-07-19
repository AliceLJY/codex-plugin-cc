import test from "node:test";
import assert from "node:assert/strict";

import { splitRawArgumentString } from "../plugins/codex/scripts/lib/args.mjs";

test("splitRawArgumentString preserves Windows and regular-expression backslashes", () => {
  assert.deepEqual(splitRawArgumentString(String.raw`--cwd C:\Users\Alice\repo`), [
    "--cwd",
    String.raw`C:\Users\Alice\repo`
  ]);
  assert.deepEqual(splitRawArgumentString(String.raw`--cwd \\server\share\repo`), [
    "--cwd",
    String.raw`\\server\share\repo`
  ]);
  assert.deepEqual(splitRawArgumentString(String.raw`--focus \d+\s+\w+`), [
    "--focus",
    String.raw`\d+\s+\w+`
  ]);
});

test("splitRawArgumentString still supports quoted and escaped spaces", () => {
  assert.deepEqual(splitRawArgumentString(String.raw`--focus "quoted phrase" escaped\ phrase`), [
    "--focus",
    "quoted phrase",
    "escaped phrase"
  ]);
  assert.deepEqual(splitRawArgumentString(String.raw`--focus "say \"hello\""`), [
    "--focus",
    'say "hello"'
  ]);
});
