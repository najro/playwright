# Playwright + Entra ID (MFA) template (TypeScript)

This is a future-proof Playwright E2E test template designed for:

- **Multi-project test execution** (run `portal`, `admin`, etc. independently)
- **Project dependencies** using Playwright’s built-in `dependencies` feature:
  - Each `<app>` project depends on `setup-<app>` which performs authentication
- **Entra ID authentication + optional MFA** using **TOTP** (Authenticator App / OATH secret)
- **Environment-based configuration** via environment variables and `.env` files
- **POM (Page Object Model)** to keep tests clean and resilient
- **Azure DevOps pipeline** example (`azure-pipelines.yml`)

> ⚠️ Important note about MFA in CI  
> Many Entra MFA methods are *not* automation-friendly (push notifications, phone calls, etc.).  
> This template assumes you use **TOTP** (a shared secret) for the test user. In practice, teams usually:
> - use a **dedicated test tenant / test user**
> - configure Conditional Access so the test user can use **TOTP** on build agents  
> Store the secret in Azure DevOps Library / Key Vault.

---

## Folder structure

```
.
├─ playwright.config.ts
├─ package.json
├─ azure-pipelines.yml
├─ .env.example
├─ scripts/
│  └─ cleanAuthState.js
├─ src/
│  ├─ config/
│  │  ├─ env.ts            # dotenv loading + env validation (zod)
│  │  ├─ paths.ts          # storageState paths
│  │  └─ selectors.ts      # Entra selectors (centralized)
│  ├─ pages/
│  │  ├─ BasePage.ts
│  │  ├─ EntraLoginPage.ts # Entra login flow (+ optional MFA)
│  │  └─ AppHomePage.ts    # Example app page
│  ├─ fixtures/
│  │  └─ index.ts          # optional base test fixture
│  └─ utils/
│     ├─ locators.ts       # helper for resilient selectors
│     └─ totp.ts           # TOTP generator
└─ tests/
   ├─ setup/
   │  └─ auth.setup.ts     # executed by setup-<app> projects
   ├─ portal/
   │  └─ smoke.spec.ts
   └─ admin/
      └─ smoke.spec.ts
```

Auth state is stored in:

```
.auth/<PW_ENV>/<app>.storageState.json
```

`.auth/` is gitignored.

---

## 1) Install

### Prerequisites
- Node.js **20+** recommended (18+ typically works too)
- A test user in Entra ID (Microsoft Entra ID / Azure AD)

### Steps

```bash
npm install
npx playwright install --with-deps
```

---

## 2) Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- `BASE_URL_PORTAL` and/or `BASE_URL_ADMIN`
- `ENTRA_USERNAME`, `ENTRA_PASSWORD`
- (optional, but recommended for CI) `ENTRA_TOTP_SECRET`

### Environment file strategy

- `.env` — shared defaults (optional)
- `.env.<PW_ENV>` — env-specific (optional)
- `.env.local` — developer-machine override (recommended)

The loader order is:

1. `.env`
2. `.env.<PW_ENV>`
3. `.env.local`

Values loaded later override earlier ones.

---

## 3) Run tests

### Run the portal project

```bash
npm run test:portal
```

What happens:

1. Playwright runs project `setup-portal`
2. It logs in through Entra and saves `.auth/<PW_ENV>/portal.storageState.json`
3. Playwright runs project `portal` using that storageState automatically

### Run admin

```bash
npm run test:admin
```

### Run everything

```bash
npm run test:all
```

### Clean auth state (force a fresh login)

```bash
npm run clean:auth
```

---

## 4) How MFA (TOTP) works here

If Entra prompts for a verification code, the template:

1. detects an OTP input field
2. generates a TOTP from `ENTRA_TOTP_SECRET`
3. submits it

If Entra asks for MFA but `ENTRA_TOTP_SECRET` is empty, the setup test fails with a clear error.

> To use TOTP, your test account must be configured with an Authenticator App / OATH secret in Entra.

---

## 5) Add more apps / projects

To add a new application called `billing`:

1. Add a new env var:
   - `BASE_URL_BILLING=...`
2. Add a folder:
   - `tests/billing/*.spec.ts`
3. Add two projects in `playwright.config.ts`:
   - `setup-billing` (auth)
   - `billing` (real tests) with `dependencies: ['setup-billing']` and `storageState: authStatePathFor('billing')`

That’s it.

---

## 6) Make tests stable (recommended practices)

- Prefer `data-testid` selectors in your app.
- Avoid brittle CSS selectors.
- Keep login details isolated to **setup** projects (already done here).
- Keep one source of truth for URLs and secrets (env vars).
- Use traces/screenshots/video only on failure (already configured).

---

## 7) Azure DevOps pipeline

See `azure-pipelines.yml`.

Recommended secrets in Azure DevOps:
- `BASE_URL_PORTAL`
- `ENTRA_USERNAME`
- `ENTRA_PASSWORD`
- `ENTRA_TOTP_SECRET`

The sample pipeline runs the `portal` project and publishes:
- JUnit test results
- Playwright HTML report artifact

---

## Customization checklist

For a real product you typically customize these parts:

- `tests/*/*.spec.ts` assertions (use your app’s stable locators)
- `src/pages/AppHomePage.ts` to reflect your navigation + “logged in” indicator
- `src/pages/EntraLoginPage.ts` if your Entra flow differs (CA policies, extra prompts)
- `playwright.config.ts` projects list and timeouts

---

## Troubleshooting

### Entra UI changed (selectors broke)
Update `src/config/selectors.ts` and/or logic in `src/pages/EntraLoginPage.ts`.

### Tests redirect to login even with storageState
Possible reasons:
- cookies/local storage are bound to a different domain than `baseURL`
- auth is not valid for long (token expiration)
- conditional access / session policies changed

Fixes:
- ensure `baseURL` matches the domain used during authentication
- keep setup projects in the same run (as here)
- re-run with a clean auth state: `npm run clean:auth`

---

## License
Use freely inside your org. Replace with your preferred license if needed.
