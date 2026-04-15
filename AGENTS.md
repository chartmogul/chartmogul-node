# ChartMogul Node.js SDK

Node.js SDK wrapping the ChartMogul API. Requires Node.js >= 18. Uses superagent for HTTP with automatic retry and exponential backoff.

## Commands

```bash
npm install                                        # install dependencies
npm test                                           # run full test suite (mocha)
npm run lint                                       # eslint --fix
npm run cover                                      # tests with nyc coverage
```

Version is in `package.json`.

## Architecture

### Resource base class

All API resources extend `Resource` (`lib/chartmogul/resource.js`). It provides:

- `Resource.request(config, method, uri, data, callback)` - core HTTP method, returns a promise (callback also supported)
- `Resource._method(verb, pathOverride)` - factory that generates static methods from an HTTP verb

Standard actions are auto-generated from a verb mapping:

| Method name | HTTP verb |
|-------------|-----------|
| `all` | GET |
| `create` | POST |
| `retrieve` | GET |
| `update` | PUT |
| `patch` | PATCH |
| `destroy` | DELETE |
| `merge` | PATCH |
| `cancel` | PATCH |
| `add` | POST |
| `remove` | DELETE |

### Resource pattern

Each resource defines a URI template path and optionally overrides methods:

```javascript
class Customer extends Resource {
  static get path () {
    return '/v1/customers{/customerUuid}{/attributes}';
  }
}

// Override with custom path
Customer.merge = Resource._method('POST', '/v1/customers/merges');
```

Path templates use RFC 6570 URI Template syntax, expanded by `uri-templates`.

### Method signature

All generated methods accept `(config, [...pathArgs], [data], [callback])`:

- `config` - instance of `ChartMogul.Config` (required first arg)
- Path arguments are positional (e.g., `customerUuid`)
- `data` - object: becomes query string for GET, body for POST/PUT/PATCH
- Special `data.qs` key allows passing query params separately from body on non-GET requests
- `callback` - optional, if omitted returns a promise

### Configuration

```javascript
const config = new ChartMogul.Config('api_key');
const config = new ChartMogul.Config('api_key', 'https://custom-base.example.com');
```

Retry: 20 retries by default (~15 min total), retries on HTTP 429, 5xx, and network errors. Response timeout: 30s, deadline: 120s.

### Error mapping

All errors inherit `ChartMogulError` with `httpStatus` and `response` properties:

| HTTP status | Error class |
|-------------|-------------|
| 400 | `SchemaInvalidError` |
| 401, 403 | `ForbiddenError` |
| 404 | `NotFoundError` |
| 422 | `ResourceInvalidError` |
| other | `ChartMogulError` |

Additional: `ConfigurationError` (invalid config), `DeprecatedParamError` (using `page` param).

### Module entry point

`lib/chartmogul.js` requires all resources and re-exports them as a single `ChartMogul` namespace object. Error classes are merged via `Object.assign`.

## Testing

**Stack:** Mocha + Chai (expect) + Nock

### Conventions

- Test files mirror source structure: `test/chartmogul/customer.js` tests `lib/chartmogul/customer.js`
- Each test file creates a config: `const config = new ChartMogul.Config('token');`
- Use nock to mock HTTP: `nock(config.API_BASE).post('/v1/customers', body).reply(200, response)`
- API field names use snake_case in test fixtures, wrapped with `/* eslint-disable camelcase */` / `/* eslint-enable camelcase */` comments
- Assert with `expect(res).to.have.property('uuid')` or `expect(res.field).to.equal(value)`
- Tests return promises (no done callback) - either `return promise.then()` or `async/await`

### CI

GitHub Actions on push/PR to main. Matrix: Node.js 18, 20, 22, latest. Runs `npm run cover`.

## Code style

- CommonJS modules (`require` / `module.exports`), not ESM
- `'use strict';` at the top of every source file
- Semicolons required (ESLint Standard + `"semi": [2, "always"]`)
- Files: kebab-case (`customer-note.js`, `plan-group.js`)
- Classes: PascalCase (`CustomerNote`, `PlanGroup`)
- Methods: camelCase (`createContact`, `connectSubscriptions`)
- API fields in request/response bodies: snake_case (`data_source_uuid`, `customer_uuid`)
- Path params in URI templates: camelCase (`{/customerUuid}`)
- No TypeScript, no build step - source ships directly
- Linting: ESLint with `eslint-config-standard` (`.eslintrc`)
- Pre-commit hook runs lint + test via `pre-commit` package
