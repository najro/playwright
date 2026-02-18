# playwright-regjeringen

End-to-end test automation for `regjeringen.no`/Optimizely CMS using Playwright + TypeScript.

This project uses:
- role-token based login setup (editor/admin)
- reusable Playwright storage state per role
- CSV-driven regression checks
- Page Object Model (POM) + shared fixtures
- Azure DevOps pipeline execution and reporting

## Tech stack

- Node.js + npm
- TypeScript
- Playwright Test (`@playwright/test`)
- `dotenv` + `zod` for env loading and validation

## Current project layout

```text
.
|- playwright.config.ts
|- azure-pipelines.yml
|- package.json
|- scripts/
|  |- cleanAuthState.js
|- src/
|  |- config/
|  |  |- env.ts
|  |  |- paths.ts
|  |  |- selectors.ts
|  |- fixtures/
|  |  |- index.ts
|  |- pom/
|  |  |- BasePage.ts
|  |  |- AppHomePage.ts
|  |  |- OptimizelyLoginPage.ts
|  |  |- FrontPage.ts
|  |  |- CalendarPage.ts
|  |- utils/
|  |  |- csvtool.ts
|  |  |- locators.ts
|- tests/
|  |- setup/
|  |  |- auth.setup.ts
|  |- pagetype/
|  |  |- basicpagetypes.spec.ts
|  |  |- frontpage.spec.ts
|  |  |- calendarpage.spec.ts
|  |  |- smoke.spec.ts
|  |- redirect/
|  |  |- redirect.spec.ts
|  |- site/
|  |  |- langauge-menu-spec.ts
|  |- data/
|     |- basic-page-types-urls.csv
|     |- redirect-urls.csv
|- .auth/                     (generated, gitignored)
|- playwright-report/         (generated)
|- test-results/              (generated)
```

## Test architecture

### Playwright projects
Defined in `playwright.config.ts`:

Setup projects:
- `setup-editor`
- `setup-admin`
- `setup-visitor`

Execution projects:
- `pagetype`
- `redirect`
- `site`

All projects use `Desktop Chrome` and `BASE_URL_SITE` as `baseURL`.

### Storage state strategy

- Setup test: `tests/setup/auth.setup.ts`
- Storage path helper: `src/config/paths.ts`
- Storage files: `.auth/<PW_ENV>/<role>.storageState.json`

`auth.setup.ts` maps setup project name to role:
- `setup-editor` -> `editor`
- `setup-admin` -> `admin`
- `setup-visitor` -> `visitor`

Login behavior:
- editor uses `OPTIMIZELY_CMS_EDITOR_TOKEN`
- admin uses `OPTIMIZELY_CMS_ADMIN_TOKEN`
- visitor does not impersonate via token, but still saves storage state

### Fixtures and POM

Shared fixtures in `src/fixtures/index.ts` provide:
- `home` (`AppHomePage`)
- `frontpage` (`FrontPage`)
- `calendarpage` (`CalendarPage`)

`BasePage` contains shared navigation/assertion helpers, including cookie banner handling (`#cookieApiData` + `#userSelectAll`).

## Test suites

### `pagetype` project

- `tests/pagetype/basicpagetypes.spec.ts`
  - CSV-driven source checks from `tests/data/basic-page-types-urls.csv`
  - Per row: open URL -> assert HTML length > 1000 -> assert expected HTML fragment exists

- `tests/pagetype/frontpage.spec.ts`
  - Validates front page structure (top tasks count, insight cards, carousel placement, footer visibility)

- `tests/pagetype/calendarpage.spec.ts`
  - Opens a calendar URL, clicks `show more`, verifies expected text becomes visible

- `tests/pagetype/smoke.spec.ts`
  - Basic authenticated smoke using `AppHomePage` (`/start/cms`)

### `redirect` project

- `tests/redirect/redirect.spec.ts`
  - CSV-driven redirect validation from `tests/data/redirect-urls.csv`
  - Handles both:
    - normal URL redirects (`waitForURL`)
    - PDF/download redirects (download event or direct response)

### `site` project

- `tests/site/langauge-menu-spec.ts` currently exists but is empty.

## CSV data contracts

### Redirect CSV (`tests/data/redirect-urls.csv`)
Required header:

```text
source;description;target
```

### Page type CSV (`tests/data/basic-page-types-urls.csv`)
Required header:

```text
url;text;search
```

The CSV parser is in `src/utils/csvtool.ts` and will throw on missing required columns or incomplete rows.

## Environment variables

Validated in `src/config/env.ts` using `zod`.

### Required

- `OPTIMIZELY_CMS_EDITOR_TOKEN`
- `OPTIMIZELY_CMS_ADMIN_TOKEN`
- `PERCY_TOKEN`

### Optional

- `PW_ENV` (default: `local`)
- `BASE_URL_SITE` (URL)
- `BASE_URL_CMS` (URL)
- `POST_LOGIN_PATH_SITE`
- `POST_LOGIN_PATH_CMS`
- `CI` (parsed to boolean)

### Dotenv loading order

Loaded in this order (later overrides earlier):
1. `.env`
2. `.env.<PW_ENV>`
3. `.env.local`

Note: repository currently includes `.env` but no `.env.example` template file.

## Install

```bash
npm ci
npx playwright install --with-deps
```

## Local usage

### Run everything

```bash
npm test
# same as
npm run test:all
```

### Run setup only

```bash
npm run test:setup-editor
npm run test:setup-admin
npm run test:setup-visitor
```

### Run test projects

```bash
npm run test:pagetype
npm run test:redirect
npm run test:site
```

### Debugging and report

```bash
npm run test:ui
npm run test:debug
npm run report
```

### Utilities

```bash
npm run clean:auth
npm run codegen:portal
```

`clean:auth` deletes `.auth` recursively to force fresh login state generation.

## Playwright runtime settings

From `playwright.config.ts`:

- `timeout`: 60s
- `expect.timeout`: 10s
- `actionTimeout`: 15s
- `navigationTimeout`: 30s
- `fullyParallel`: `true`
- retries: `2` in CI, `0` locally
- workers: `2` in CI, default locally
- artifacts:
  - trace: `retain-on-failure`
  - screenshot: `only-on-failure`
  - video: `retain-on-failure`
- headed locally, headless in CI
- reporters:
  - list
  - html (`playwright-report`)
  - junit (`test-results/junit.xml`)

## Path aliases

Configured in `tsconfig.json`:

- `@config/*` -> `src/config/*`
- `@pages/*` -> `src/pom/*`
- `@utils/*` -> `src/utils/*`
- `@fixtures/*` -> `src/fixtures/*`

## CI pipeline (Azure DevOps)

`azure-pipelines.yml` currently does:

1. Use Node `24.11.0`
2. `npm ci`
3. `npx playwright install --with-deps`
4. Run setup projects (`setup-editor`, `setup-admin`, `setup-visitor`)
5. Run `pagetype`, publish JUnit + HTML report artifact
6. Run `redirect`, publish JUnit + HTML report artifact
7. Run `site`, publish JUnit + HTML report artifact

Pipeline env vars expected:
- `BASE_URL_SITE`
- `BASE_URL_CMS`
- `OPTIMIZELY_CMS_EDITOR_TOKEN`
- `OPTIMIZELY_CMS_ADMIN_TOKEN`
- `PERCY_TOKEN`
- plus runtime values `CI=true` and `PW_ENV=dev`

## Known gaps and follow-ups

- `tests/site/langauge-menu-spec.ts` is empty (no active assertions in `site` project yet).
- `PERCY_TOKEN` is required by env validation even though no Percy integration appears in test code.
- Some source files include stale comments referencing older project names.
- There is no checked-in `.env.example`; adding one would simplify onboarding.

## Troubleshooting

### Env validation fails at startup

Check required variables in `.env` or pipeline variables. Validation errors are printed from `src/config/env.ts`.

### Tests unexpectedly redirected to login

- Delete state: `npm run clean:auth`
- Re-run setup projects
- Confirm `baseURL` domain matches where auth cookies are valid
- Verify role token values for editor/admin

### Redirect tests flaky on file targets

`redirect.spec.ts` treats PDF targets specially and accepts either a download event or direct response. Confirm target CSV entries resolve against current `BASE_URL_SITE`.
