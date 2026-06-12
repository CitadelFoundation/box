import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  DEFAULT_BETA_MANIFEST_URL,
  buildInstallerInvocation,
  parseBoxCommand,
  runCli,
} from "../bin/index.js";

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), "box-cli-test-"));
  writeFileSync(
    join(root, "package.json"),
    `${JSON.stringify({ name: "@citadelfoundation/box", version: "0.1.0-beta.1" }, null, 2)}\n`,
  );
  return root;
}

test("maps box install to the beta manifest installer invocation", () => {
  const root = fixtureRoot();
  const invocation = buildInstallerInvocation({
    argv: ["install", "--no-open", "--verbose"],
    env: { PATH: "/usr/bin:/bin" },
    root,
  });

  assert.equal(invocation.command, "bash");
  assert.deepEqual(invocation.args, [
    join(root, "installer", "install_box.sh"),
    "--skip-private-kit",
    "--skip-build",
    "--no-open",
    "--verbose",
  ]);
  assert.equal(invocation.options.cwd, root);
  assert.equal(
    invocation.options.env.BOX_INSTALL_MANIFEST_URL,
    DEFAULT_BETA_MANIFEST_URL,
  );
  assert.equal(invocation.options.env.BOX_INSTALL_CHANNEL, "private-beta");
});

test("preserves an explicit Box install manifest override", () => {
  const root = fixtureRoot();
  const invocation = buildInstallerInvocation({
    argv: ["install"],
    env: {
      BOX_INSTALL_MANIFEST_URL: "https://example.test/releases/box/beta/manifest.json",
    },
    root,
  });

  assert.equal(
    invocation.options.env.BOX_INSTALL_MANIFEST_URL,
    "https://example.test/releases/box/beta/manifest.json",
  );
});

test("supports a beta manifest override alias", () => {
  const root = fixtureRoot();
  const invocation = buildInstallerInvocation({
    argv: ["install"],
    env: {
      BOX_BETA_MANIFEST_URL: "https://example.test/beta/manifest.json",
    },
    root,
  });

  assert.equal(
    invocation.options.env.BOX_INSTALL_MANIFEST_URL,
    "https://example.test/beta/manifest.json",
  );
});

test("maps doctor and uninstall subcommands to installer flags", () => {
  assert.deepEqual(parseBoxCommand(["doctor", "--verbose"]), {
    action: "installer",
    forwardedArgs: ["--doctor", "--verbose"],
  });
  assert.deepEqual(parseBoxCommand(["uninstall", "--verbose"]), {
    action: "installer",
    forwardedArgs: ["--uninstall", "--verbose"],
  });
});

test("runCli invokes the installer without executing a real install in tests", () => {
  const root = fixtureRoot();
  const calls = [];
  const result = runCli(["install", "--no-open"], {
    root,
    env: { PATH: "/usr/bin:/bin" },
    stdout: { write() {} },
    stderr: { write() {} },
    spawn(command, args, options) {
      calls.push({ command, args, options });
      return { status: 0 };
    },
  });

  assert.equal(result.status, 0);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, "bash");
  assert.deepEqual(calls[0].args.slice(1), [
    "--skip-private-kit",
    "--skip-build",
    "--no-open",
  ]);
});

test("prints package version without invoking the installer", () => {
  const root = fixtureRoot();
  let output = "";
  const result = runCli(["--package-version"], {
    root,
    env: {},
    stdout: { write(value) { output += value; } },
    stderr: { write() {} },
    spawn() {
      throw new Error("spawn should not be called");
    },
  });

  assert.equal(result.status, 0);
  assert.equal(output, "0.1.0-beta.1\n");
});

test("rejects unknown subcommands", () => {
  let error = "";
  const result = runCli(["launch"], {
    root: fixtureRoot(),
    env: {},
    stdout: { write() {} },
    stderr: { write(value) { error += value; } },
    spawn() {
      throw new Error("spawn should not be called");
    },
  });

  assert.equal(result.status, 2);
  assert.match(error, /Unknown Box command: launch/);
});
