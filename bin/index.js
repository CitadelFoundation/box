#!/usr/bin/env node
// @citadelfoundation/box - private beta bootstrap

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const DEFAULT_BETA_MANIFEST_URL =
  "https://raw.githubusercontent.com/CitadelFoundation/box/refs/heads/main/releases/box/beta/manifest.json";

const INSTALLER_DEFAULT_ARGS = ["--skip-private-kit", "--skip-build"];
const SUPPORTED_COMMANDS = new Set(["install", "doctor", "uninstall"]);

function packageRoot() {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..");
}

function installerScriptPath(root = packageRoot()) {
  return resolve(root, "installer", "install_box.sh");
}

function readPackageVersion(root = packageRoot()) {
  const manifest = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
  return manifest.version;
}

export function usage() {
  return `Citadel Box private beta bootstrap

Usage:
  box install [options]
  box doctor [options]
  box uninstall [options]
  box --version
  box --help

Installs Box from the beta release manifest, materializes the verified artifact
under the local Citadel app directory, and runs the Box installer from that
durable release tree.

Options are forwarded to the Box installer. Common options:
  --no-open                    Do not open Box after install.
  --verbose                    Print installer diagnostics.
  --require-reference-apps     Require Keep and Publishing Studio routes.

Environment:
  BOX_INSTALL_MANIFEST_URL     Override the beta manifest URL.
  BOX_BETA_MANIFEST_URL        Alternate beta manifest URL override.

Default beta manifest:
  ${DEFAULT_BETA_MANIFEST_URL}
`;
}

export function parseBoxCommand(argv) {
  const args = [...argv];
  const first = args[0];

  if (!first || first === "--help" || first === "-h" || first === "help") {
    return { action: "help", forwardedArgs: [] };
  }

  if (first === "--package-version") {
    return { action: "package-version", forwardedArgs: [] };
  }

  if (first === "--version" || first === "version") {
    return { action: "installer", forwardedArgs: ["--version"] };
  }

  if (first.startsWith("-")) {
    return { action: "installer", forwardedArgs: args };
  }

  if (!SUPPORTED_COMMANDS.has(first)) {
    return {
      action: "error",
      message: `Unknown Box command: ${first}`,
    };
  }

  const rest = args.slice(1);
  if (first === "doctor") {
    return { action: "installer", forwardedArgs: ["--doctor", ...rest] };
  }
  if (first === "uninstall") {
    return { action: "installer", forwardedArgs: ["--uninstall", ...rest] };
  }
  return { action: "installer", forwardedArgs: rest };
}

export function buildInstallerInvocation({
  argv,
  env = process.env,
  root = packageRoot(),
} = {}) {
  const parsed = parseBoxCommand(argv ?? []);
  if (parsed.action !== "installer") return { parsed };

  const manifestUrl =
    env.BOX_INSTALL_MANIFEST_URL ||
    env.BOX_BETA_MANIFEST_URL ||
    DEFAULT_BETA_MANIFEST_URL;

  return {
    parsed,
    command: "bash",
    args: [
      installerScriptPath(root),
      ...INSTALLER_DEFAULT_ARGS,
      ...parsed.forwardedArgs,
    ],
    options: {
      cwd: root,
      env: {
        ...env,
        BOX_INSTALL_MANIFEST_URL: manifestUrl,
        BOX_INSTALL_CHANNEL: env.BOX_INSTALL_CHANNEL || "private-beta",
      },
      stdio: "inherit",
    },
  };
}

export function runCli(argv, dependencies = {}) {
  const root = dependencies.root ?? packageRoot();
  const env = dependencies.env ?? process.env;
  const stdout = dependencies.stdout ?? process.stdout;
  const stderr = dependencies.stderr ?? process.stderr;
  const spawn = dependencies.spawn ?? spawnSync;
  const invocation = buildInstallerInvocation({ argv, env, root });

  if (invocation.parsed.action === "help") {
    stdout.write(usage());
    return { status: 0, invocation };
  }

  if (invocation.parsed.action === "package-version") {
    stdout.write(`${readPackageVersion(root)}\n`);
    return { status: 0, invocation };
  }

  if (invocation.parsed.action === "error") {
    stderr.write(`${invocation.parsed.message}\n\n${usage()}`);
    return { status: 2, invocation };
  }

  const result = spawn(invocation.command, invocation.args, invocation.options);
  if (result.error) {
    stderr.write(`Unable to start Box installer: ${result.error.message}\n`);
    return { status: 1, invocation, result };
  }
  return { status: result.status ?? 1, invocation, result };
}

function isMainModule() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isMainModule()) {
  const { status } = runCli(process.argv.slice(2));
  process.exit(status);
}
