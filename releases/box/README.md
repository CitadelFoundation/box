# Box Release Packets

This directory is the public release lane consumed by the root `install`
bootstrap.

Expected layout:

```text
releases/box/stable/manifest.json
releases/box/<version>/<artifact>
```

`stable/manifest.json` must describe a real Box release artifact and include at
least:

- `version`
- `artifact.url`
- `artifact.sha256`

Do not add fake release manifests, fake artifacts, local tarballs, private
registry credentials, or source checkout instructions here. The public bootstrap
must install from verified release artifacts only.
