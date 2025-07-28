# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html

## [3.7.1] - 2025-07-24
- Update packages due to security vulnerability in form-data 4.0.0

## [3.7.0] - 2025-04-25
- Adds support for Tasks (https://dev.chartmogul.com/reference/tasks)

## [3.6.0] - 2025-03-18
- Adds support for disconnecting subscriptions

## [3.5.0] - 2024-10-24
- Adds support for unmerging customers

## Unreleased
- Improve all tests that always return true (https://github.com/chartmogul/chartmogul-node/pull/100)

## [3.4.0] - 2024-03-25
- Adds support for Opportunities (https://dev.chartmogul.com/reference/opportunities)

## [3.3.2] - 2024-02-28
- Fix query string not passed after replacing `request` library with `superagent`

## [3.2.3] - 2024-01-19
- Actually remove the `requests` library from `package.json`

## [3.2.2] - 2024-01-18
- Remove the `requests` library and use `superagent` instead

## [3.2.1] - 2023-12-20
- Fix missing `customer_uuid` when creating a note or retrieving all notes from a customer

## [3.2.0] - 2023-12-20
- Support customer notes

## [3.1.0] - 2023-11-29
- Update project dependencies to address CVE-2023-45133.

## [3.0.0] - 2023-11-01

### Removed
- Remove support for old pagination using `page` parameter.
- Remove support for Node v14.x.

## [2.1.2] - 2023-10-05

### Added
- Support for cursor based pagination to `.all()` endpoints.
