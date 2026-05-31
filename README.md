# Box Runtime

The sovereign runtime. Your machine, your rules. Zero-trust microVM.

## Install

Public install target:

```bash
curl -fsSL https://citadel.box/install | bash
```

`https://citadel.box/install` should point to the public bootstrap file in this
repository:

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

Versioned release packets live under:

```text
releases/box/<version>/
```

See [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) for the DNS, hosting, release, and
lab-proof handoff that an external setup agent must follow.

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
