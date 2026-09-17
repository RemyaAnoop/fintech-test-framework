# Fintech Quality Automation Framework - Playwright + JavaScript

This project is a Playwright test framework for a fintech application. It
includes API tests, UI tests, test utilities, reporting, and a local mock
server. No external services are required.

## What it covers

- User and transaction API tests
- Create, read, and list operations
- Validation and error cases
- Authentication and authorization
- User registration and transaction UI flows
- Unique test-data factories
- Environment configuration
- Reusable API client
- Separate API and UI fixtures
- Custom assertions
- API response logging
- HTML and JSON reports
- Failure screenshots, videos, and retry traces
- GitHub Actions CI

## Project structure

```text
fintech-test-framework/
├── server/
│   └── mock-server.js
├── src/
│   ├── api/
│   │   ├── api-client.js
│   │   └── api-routes.js
│   ├── fixtures/
│   │   ├── api-fixtures.js
│   │   └── ui-fixtures.js
│   ├── pages/
│   │   ├── user-registration-page.js
│   │   └── user-transactions-page.js
│   ├── test-config/
│   │   └── environment-configuration.js
│   ├── test-data/
│   │   └── factories.js
│   └── utils/
│       ├── api-helpers.js
│       └── custom-assertions.js
├── tests/
│   ├── api/
│   │   ├── users.api.spec.js
│   │   └── transactions.api.spec.js
│   └── ui/
│       ├── user-registration.spec.js
│       └── user-transactions.spec.js
├── playwright.config.js
├── .github/
│   └── workflows/
│       └── playwright.yml
└── package.json
```

## Installation

```bash
npm ci
npx playwright install chromium
```

## Run tests

The mock server starts automatically.

```bash
npm test                         # All tests
npm run test:api                 # API tests only
npm run test:ui                  # UI tests only
npm test -- --project=chromium   # Chromium only
npm run lint                     # Check JavaScript syntax
```

## Reports

```bash
npm run report
```

Output locations:

```text
playwright-report/          HTML report
test-results/results.json   JSON report
test-results/               Screenshots, videos, and traces
```

API response status and bodies are logged in the test output. Screenshots and
videos are kept for failed tests, and traces are collected on the first retry.

## Environment configuration

The default environment is local:

```bash
TEST_ENV=local npm test
```

```text
UI:  http://localhost:3000
API: http://localhost:3000/api
```

Other configured environments:

```bash
TEST_ENV=dev npm test
TEST_ENV=staging npm test
```

Use `UI_BASE_URL` and `API_BASE_URL` to override URLs. Use `API_TOKEN` for
non-local authentication:

```bash
TEST_ENV=staging \
UI_BASE_URL=https://staging.example.com \
API_BASE_URL=https://staging.example.com/api \
API_TOKEN=<token> npm test
```

Configuration is in
[`src/test-config/environment-configuration.js`](./src/test-config/environment-configuration.js).
Do not commit real tokens, passwords, or private URLs.

## Continuous integration

The workflow in
[`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) runs
all tests on pushes and pull requests to `main` or `master`. It installs
dependencies and browsers, runs the tests, and uploads the HTML report and
test artifacts.

## Design decisions

- Playwright handles both API and UI tests.
- API and UI tests can run separately.
- The API client keeps HTTP details out of the tests.
- Factories create unique data for safer parallel runs.
- Environment values are kept outside test logic.
- The mock server makes local runs repeatable.

## Future quality improvements

For a production fintech system, I would add:

- Contract and schema tests
- Idempotency and duplicate-transaction tests
- More role and account-ownership authorization tests
- Data consistency checks
- Performance and load tests
- CI quality gates
- Request and trace ID monitoring
- Test tags for smoke and regression suites
- Test-data cleanup policies

Performance testing should use a dedicated tool such as k6, JMeter, or Gatling.
Playwright should remain focused on functional correctness.

This framework provides a reliable foundation for testing the fintech
application locally and in CI.
