# Box Public Installer Domain Setup

Status: bootstrap target seeded; public release packet pending.

This public repository is the distribution home for the Box macOS installer.
The supported command is:

```sh
curl -fsSL https://citadel.box/install | bash
```

## Domain Target

Preferred setup: enable GitHub Pages for this repository from `main` at `/`,
then point `citadel.box` at the GitHub Pages target. The checked-in `CNAME`
file binds the Pages site to:

```text
citadel.box
```

With Pages enabled, `https://citadel.box/install` serves the root `install` file
from this repository. If the primary `citadel.box` site must remain hosted by a
separate app, configure that app or edge router to redirect only `/install` to
the public raw GitHub URL:

```text
https://raw.githubusercontent.com/CitadelFoundation/box/refs/heads/main/install
```

This mirrors the public raw-GitHub bootstrap pattern used by installers such as
opencode, while keeping Box release artifacts and manifests in this repository.

Raw GitHub URL format:

```text
https://raw.githubusercontent.com/CitadelFoundation/box/<branch_name>/<file_name>.<extension_name>
```

## GitHub Pages Setup

Required repository setup:

1. Enable GitHub Pages for `CitadelFoundation/box`.
2. Set the Pages source to branch `main`, path `/`.
3. Keep `.nojekyll` committed so installer and release files are served
   verbatim.
4. Keep `CNAME` committed with `citadel.box`.

DNS target:

```text
citadel.box -> CitadelFoundation.github.io
```

If the DNS provider cannot CNAME the zone apex directly, use ALIAS/ANAME/CNAME
flattening or GitHub Pages A/AAAA records for the zone apex.

## Public Release Paths

Publish real release files at these paths:

```text
releases/box/stable/manifest.json
releases/box/<version>/manifest.json
releases/box/<version>/box-<version>-macos-arm64.tar.gz
releases/box/<version>/apple-distribution/developer-id-evidence
releases/box/<version>/apple-distribution/notarization-evidence
```

Do not add placeholder manifests or fake artifacts. The public stable manifest
must point at a self-contained macOS arm64 release bundle, include the matching
SHA-256 digest, include Apple Developer ID and notarization evidence, and carry a
manifest signature trusted by the source-owned bootstrap.

## External Setup Rules

- Do not rebuild Box from this public repository.
- Do not add GitHub Packages, registry flags, private tokens, or source checkout
  requirements.
- Do not use `BOX_INSTALL_MANIFEST_URL`, `BOX_INSTALL_SOURCE_URL`,
  `BOX_KIT_REGISTRY_URL`, or `BOX_KIT_REGISTRY_TOKEN` for public closure proof.
- Do not accept raw `127.0.0.1`, visible `:8443`, host-machine browser proof, or
  certificate-warning bypass.
- Do not report success unless the installer proves
  `https://app.citadel.localhost` inside `macos-installer-lab`.

## Required Checks

Run these from a clean shell:

```sh
env -u BOX_INSTALL_CHANNEL \
  -u BOX_INSTALL_MANIFEST_URL \
  -u BOX_INSTALL_SOURCE_URL \
  -u BOX_KIT_REGISTRY_URL \
  -u BOX_KIT_REGISTRY_TOKEN \
  curl -fsSLI https://citadel.box/install
```

```sh
env -u BOX_INSTALL_CHANNEL \
  -u BOX_INSTALL_MANIFEST_URL \
  -u BOX_INSTALL_SOURCE_URL \
  -u BOX_KIT_REGISTRY_URL \
  -u BOX_KIT_REGISTRY_TOKEN \
  bash -lc 'curl -fsSL https://citadel.box/install | bash -s -- --help'
```

```sh
env -u BOX_INSTALL_CHANNEL \
  -u BOX_INSTALL_MANIFEST_URL \
  -u BOX_INSTALL_SOURCE_URL \
  -u BOX_KIT_REGISTRY_URL \
  -u BOX_KIT_REGISTRY_TOKEN \
  bash -lc 'curl -fsSL https://citadel.box/install | bash -s -- --version'
```

Final closure requires a restored `macos-installer-lab` VM and the literal
public command:

```sh
env -u BOX_INSTALL_CHANNEL \
  -u BOX_INSTALL_MANIFEST_URL \
  -u BOX_INSTALL_SOURCE_URL \
  -u BOX_KIT_REGISTRY_URL \
  -u BOX_KIT_REGISTRY_TOKEN \
  bash -lc 'curl -fsSL https://citadel.box/install | bash'
```

## Return Evidence

Return all of this evidence to the Box source owner:

- `https://citadel.box/install` response headers
- stable manifest body
- immutable versioned manifest URL
- public artifact URL and downloaded artifact SHA-256
- Developer ID signing evidence
- notarization evidence
- `macos-installer-lab` installer transcript from a clean shell
- `launchctl` status for `com.citadelfoundation.box`
- local runtime proof output
- Safari or VNC proof for `https://app.citadel.localhost` with no certificate
  warning and no visible port

If any requirement needs private package access, a registry flag, a manifest
environment variable, a source checkout, a visible local port, or host-machine
browser proof, stop and return to the Box source owner.
