# Box Runtime

The sovereign runtime. Your machine, your rules. Zero-trust microVM.

## Private Beta install

The private beta is distributed through npm:

```bash
npm i -g @citadelfoundation/box@beta
box install
```

`box install` is a small Node bootstrap. It downloads the beta release manifest,
verifies the Box artifact checksum through the Box installer bootstrap,
materializes the release under the local Citadel app install directory, and then
runs the existing Box installer from that durable release tree.

Default beta manifest:

```text
https://raw.githubusercontent.com/CitadelFoundation/box/refs/heads/main/releases/box/beta/manifest.json
```

Operators can override the manifest for a cohort or smoke test:

```bash
BOX_INSTALL_MANIFEST_URL=https://example.test/releases/box/beta/manifest.json box install --no-open --verbose
```

The beta package intentionally uses the Box-stage artifact path and skips source
checkout build steps during install. The artifact must already contain the built
Box app, installer runner, local runtime proof runner, app provisioning support,
installed package graph, and artifact-local Kit CLI entrypoint.

## Commands

```bash
box install [options]
box doctor [options]
box uninstall [options]
box --version
box --help
```

Common install options:

- `--no-open` — do not open Box after install.
- `--verbose` — print installer diagnostics.
- `--require-reference-apps` — require Keep and Publishing Studio routes.

## Artifact publication contract

The beta manifest and artifact are produced by the private Box-stage release
machinery, specifically the same self-contained artifact path used by the
installer proof lane, without the GA-only Developer ID/notarization requirement.
Publish the generated manifest and artifact to this repository's beta release
channel before publishing the npm beta:

```text
releases/box/beta/manifest.json
releases/box/<version>/box-<version>-macos-arm64.zip
```

The manifest may point at a relative artifact URL; the installer resolves it
relative to the manifest URL. Do not publish placeholder manifests, fake
artifacts, source-checkout instructions, registry credentials, or local file
paths.

## npm beta publishing

This repository publishes through GitHub Actions OIDC trusted publishing. Do not
publish from a workstation.

Operator sequence after the PR lands:

1. Copy the Box-stage-produced beta manifest and artifact into this repository's
   beta release channel and merge that release-channel update.
2. Create and push a beta tag matching the package version, for example
   `v0.1.0-beta.1`.
3. Let `.github/workflows/npm-publish.yml` run; it executes focused tests,
   validates the packed files, and publishes with `npm publish --access public --tag beta`.

## Public GA install

The signed curl-pipe path remains GA scope:

```bash
curl -fsSL https://citadel.box/install | bash
```

That path requires the signed/notarized public release packet, public domain
handoff, and installer-lab proof before it is advertised as production-ready.

## License

TBD
