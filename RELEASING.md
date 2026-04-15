# Releasing chartmogul-node

## Prerequisites

- You must have push access to the repository
- Tags matching `v*` are protected by GitHub tag protection rulesets
- Releases are immutable once published (GitHub repository setting)
- npm [trusted publishing](https://docs.npmjs.com/trusted-publishers/) must be configured for the package (see [Repository Settings](#repository-settings-admin))

## Release Process

1. Ensure all changes are merged to the `main` branch
2. Ensure CI is green on the `main` branch
3. Create a release branch off `main`, bump the version in `package.json`, and open a PR:
   ```sh
   git checkout -b release/vX.Y.Z main
   # bump version in package.json
   git add package.json
   git commit -m "Update version to vX.Y.Z"
   git push -u origin release/vX.Y.Z
   gh pr create --title "Release vX.Y.Z" --body "Bump version to vX.Y.Z"
   ```
4. Merge the PR into `main`
5. Tag the merge commit and push the tag:
   ```sh
   git checkout main && git pull
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
6. The [release workflow](.github/workflows/release.yml) will automatically:
   - Run the full test suite across Node.js 18, 20, 22, and latest
   - Verify that `package.json` version matches the tag
   - Create a GitHub Release with auto-generated release notes
   - Publish to npm via [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers/) with [provenance](https://docs.npmjs.com/generating-provenance-statements)
7. Verify the release appears at https://github.com/chartmogul/chartmogul-node/releases and https://www.npmjs.com/package/chartmogul-node

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

These will be automatically marked as pre-releases on GitHub and published to npm under the `next` dist-tag (not `latest`).

## Security

### Repository Protections

- **Immutable releases**: Once a GitHub Release is published, its tag cannot be moved or deleted, and release assets cannot be modified
- **Tag protection rulesets**: `v*` tags cannot be deleted or force-pushed

### npm Registry

- Publishing uses [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers/) — no long-lived npm tokens are stored in the repository. GitHub Actions authenticates directly with npm via short-lived OIDC tokens.
- Once a package version is published to npm, [it cannot be republished](https://docs.npmjs.com/policies/unpublish) with different contents
- npm records integrity hashes (SHA-512) in `package-lock.json` for all installed packages, ensuring reproducible and tamper-evident installs
- Packages are published with [provenance](https://docs.npmjs.com/generating-provenance-statements), linking each version to the specific GitHub Actions run that built it

### What This Protects Against

- A compromised maintainer account cannot modify or delete existing releases
- No long-lived npm tokens exist that could be leaked or stolen
- Tags cannot be moved to point to different commits after publication
- The npm registry provides an independent immutability layer beyond GitHub
- npm provenance allows anyone to verify a package was built from this repository by GitHub Actions

### Repository Settings (Admin)

These settings must be configured by a repository admin:

1. **Immutable Releases**: Settings > General > Releases > Enable "Immutable releases"
2. **Tag Protection Ruleset**: Settings > Rules > Rulesets > New ruleset targeting tags matching `v*` with deletion, force-push, and update prevention
3. **GitHub Actions Environment**: Settings > Environments > New environment named `npm`
4. **npm Trusted Publishing**: On npmjs.com, go to [chartmogul-node access settings](https://www.npmjs.com/package/chartmogul-node/access) and configure a trusted publisher with: repository `chartmogul/chartmogul-node`, workflow `release.yml`, environment `npm`
