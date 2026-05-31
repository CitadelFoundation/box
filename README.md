# Box Runtime

The sovereign runtime. Your machine, your rules. Zero-trust microVM.

## Install

Public install target:

```bash
curl -fsSL https://citadel.box/install | bash
```

`https://citadel.box/install` should be served from this repository through
GitHub Pages. If the primary site remains hosted elsewhere, the `/install` path
may instead redirect to the public raw GitHub bootstrap:

```text
https://raw.githubusercontent.com/CitadelFoundation/box/refs/heads/main/install
```

That bootstrap discovers the Box release manifest, verifies the downloaded
artifact checksum, materializes the release under the local Citadel app install
directory, and then runs the Box installer from that durable location.

## Release Channel

The stable public channel is expected at:

```text
https://raw.githubusercontent.com/CitadelFoundation/box/refs/heads/main/releases/box/stable/manifest.json
```

Versioned release files live under:

```text
releases/box/<version>/
```

Release operations, DNS handoff, and lab proof instructions live in the private
Box source release packet. They are not published in this public distribution
repository.

Do not publish a placeholder manifest or artifact. A public install is ready
only when the manifest points at a real release artifact with a matching SHA-256
digest. Signed manifests and notarized macOS artifacts are still required before
this should be advertised as a public production installer.

## Private Beta

Private beta installs may still use the private Box source workflow, GitHub
Packages, or an explicit release source override. Those are not the public
`citadel.box/install` contract.

## Status

Bootstrap target seeded. Stable public release packet pending.

## License

TBD
