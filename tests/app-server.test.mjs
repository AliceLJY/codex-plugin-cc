import process from "node:process";
import test from "node:test";
import assert from "node:assert/strict";

import { CodexAppServerClient } from "../plugins/codex/scripts/lib/app-server.mjs";
import { buildEnv, installFakeCodex } from "./fake-codex-fixture.mjs";
import { makeTempDir } from "./helpers.mjs";

test("direct app-server close escalates from SIGTERM to SIGKILL", { skip: process.platform === "win32" }, async () => {
  const repo = makeTempDir();
  const binDir = makeTempDir();
  installFakeCodex(binDir, "ignore-shutdown");

  const client = await CodexAppServerClient.connect(repo, {
    disableBroker: true,
    env: buildEnv(binDir),
    shutdownGraceMs: 20,
    terminateGraceMs: 20,
    killGraceMs: 1000
  });
  const child = client.proc;

  await client.close();

  assert.equal(child.signalCode, "SIGKILL");
});
