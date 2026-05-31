# Box Package

This repository is reserved for the public `@citadelfoundation/box` npm/Bun
package shim.

The public curl installer site and release distribution payload live in
[CitadelFoundation/citadel.box](https://github.com/CitadelFoundation/citadel.box).
Installer files such as `install`, `CNAME`, `.nojekyll`, and `releases/box/**`
do not belong in this package repository.

## Status

The package command is a placeholder while the public installer and release
pipeline are finalized.

Future intent:

```bash
bunx @citadelfoundation/box install
```

That command should consume the same signed public release manifest used by:

```bash
curl -fsSL https://citadel.box/install | bash
```

## Package

Current package entrypoint:

```bash
box
```

At this stage it only prints a placeholder message.

## Release Boundary

- `CitadelFoundation/box`: npm/Bun package shim.
- `CitadelFoundation/citadel.box`: GitHub Pages installer distribution.
- `CitadelFoundation/box-stage`: private Box source, release automation, and
  product proof workflows.

Do not publish generated installer artifacts from this repository.

## License

TBD
