# Releasing chartmogul-node

## Prerequisites

- You must have push access to the repository
- You must have an authorized account on [npmjs.com](https://www.npmjs.com) with publish access to the `chartmogul-node` package
- Tags matching `v*` are protected by GitHub tag protection rulesets
- Releases are immutable once published (GitHub repository setting)

## Release Process

1. Ensure all changes are merged to the `main` branch
2. Ensure CI is green on the `main` branch
3. Bump the version in `package.json`
4. Commit the version bump:
   ```sh
   git add package.json
   git commit -m "Update version to vX.Y.Z"
   ```
5. Create and push a version tag:
   ```sh
   git tag vX.Y.Z
   git push origin main --tags
   ```
6. The [release workflow](.github/workflows/release.yml) will automatically create a GitHub Release with auto-generated release notes
7. Publish to npm:
   ```sh
   npm publish
   ```
8. Verify the release appears at https://github.com/chartmogul/chartmogul-node/releases and https://www.npmjs.com/package/chartmogul-node

## Changelog

Release notes are auto-generated from merged PR titles by the [release workflow](.github/workflows/release.yml). To ensure useful changelogs:

- Use clear, descriptive PR titles (e.g., "Add External ID field to Contact model")
- Prefix breaking changes with `BREAKING:` so they stand out in release notes
- After the release is created, review and edit the notes on the [Releases page](https://github.com/chartmogul/chartmogul-node/releases) if needed

## Pre-release Versions

For pre-release versions, use a semver pre-release suffix:

```sh
git tag vX.Y.Z-rc1
git push origin vX.Y.Z-rc1
```

These will be automatically marked as pre-releases on GitHub.

## Security

### Repository Protections

- **Immutable releases**: Once a GitHub Release is published, its tag cannot be moved or deleted, and release assets cannot be modified
- **Tag protection rulesets**: `v*` tags cannot be deleted or force-pushed

### npm Registry

- Once a package version is published to npm, [it cannot be republished](https://docs.npmjs.com/policies/unpublish) with different contents
- npm records integrity hashes (SHA-512) in `package-lock.json` for all installed packages, ensuring reproducible and tamper-evident installs

### What This Protects Against

- A compromised maintainer account cannot modify or delete existing releases
- Tags cannot be moved to point to different commits after publication
- The npm registry provides an independent immutability layer beyond GitHub

### Repository Settings (Admin)

These settings must be configured by a repository admin:

1. **Immutable Releases**: Settings > General > Releases > Enable "Immutable releases"
2. **Tag Protection Ruleset**: Settings > Rules > Rulesets > New ruleset targeting tags matching `v*` with deletion and force-push prevention
