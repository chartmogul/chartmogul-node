# Releasing chartmogul-node

## Prerequisites

- You must have push access to the repository
- `git`, `gh`, `jq`, `node`, and `npm` must be installed
- Tags matching `v*` are protected by GitHub tag protection rulesets
- Releases are immutable once published (GitHub repository setting)
- npm [trusted publishing](https://docs.npmjs.com/trusted-publishers/) must be configured for the package (see [Repository Settings](#repository-settings-admin))

## Release Process

Run the release script from the repository root:

```sh
bin/release.sh <patch|minor|major>
```

The script will:

1. Verify prerequisites and that CI is green on `main`
2. Show any open PRs targeting `main` and ask for confirmation
3. Bump the version in `package.json` and `package-lock.json`
4. Create a release branch, commit, push, and open a PR
5. Wait for the PR to be merged (poll every 10s)
6. Tag the merge commit and push the tag
7. Wait for the [release workflow](.github/workflows/release.yml) to complete, which will:
   - Run the full test suite across Node.js 18, 20, 22, and latest
   - Verify that `package.json` version matches the tag
   - Create a GitHub Release with auto-generated release notes
   - Publish to npm via [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers/) with [provenance](https://docs.npmjs.com/generating-provenance-statements)
8. Print links to the GitHub Release and npm package

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
