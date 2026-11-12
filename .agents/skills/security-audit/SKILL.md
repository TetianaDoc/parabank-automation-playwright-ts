---
name: security-audit
description: Security, credential, and PII hygiene audit for this ParaBank Playwright + TypeScript test automation codebase. Covers credential sourcing, environment configuration, synthetic PII/SSN/account test data in fixtures and factories, Playwright trace/storageState secret safety, and .gitignore/package.json hygiene. Use when reviewing fixtures, factories, page objects, specs, or project config.
---

# Security Audit Skill — ParaBank E2E Tests (Playwright + TypeScript)

Apply this security checklist to the target file, directory, or configuration (`playwright.config.ts`, `package.json`, `.gitignore`). Be strict on credential hygiene, PII safety in test fixtures, and artifact/cache exclusions.

## Audit Scope

### 1. Credential & Environment Variable Hygiene
- [ ] **No real credentials in source control:** Real usernames, passwords, API tokens, or session cookies must never appear in `src/`, `tests/`, or `playwright.config.ts`. Only public ParaBank demo credentials (`john` / `demo` in `DEFAULT_DEMO_USER`), obviously synthetic negative-test credentials (`INVALID_USER_CREDENTIALS`), or dynamically generated test users (`createRandomUser()`) are permitted.
- [ ] **Environment URL validation:** `playwright.config.ts` sources `process.env.BASE_URL` with a safe fallback to the public ParaBank sandbox (`https://parabank.parasoft.com/parabank/`). Never hardcode internal/staging URLs with embedded basic-auth credentials (`https://user:pass@host`).
- [ ] **No secrets logged to console:** Never print passwords, session cookies (`JSESSIONID`), or environment variables via `console.log` in tests, fixtures, or page objects.

### 2. Test Data & PII Hygiene (`src/data/`)
- [ ] **Synthetic PII & SSNs only:** ParaBank registration requires `ssn`, `phoneNumber`, `address`, and `firstName`/`lastName`. All static fixtures (`src/data/fixtures/users.data.ts`, `billers.data.ts`) and dynamic factories (`src/data/factories/user.factory.ts`, `bill-pay.factory.ts`) must use clearly synthetic values (e.g. `555-*` phone numbers, dummy SSNs, fictional street names).
- [ ] **Safe email/domain references (RFC 2606):** If email addresses or external domains are used anywhere in test data, use reserved domains (`@example.com`, `@test.example.com`) rather than real corporate domains.
- [ ] **Safe dynamic username generation:** `createRandomUser()` must stay within ParaBank's column length constraints (`<= 15` chars) and use non-sensitive random suffixes (`u<timestamp><random>`).

### 3. Browser Context & DOM Execution Safety
- [ ] **Safe `page.evaluate` / `page.waitForFunction` usage:** Any browser-context evaluation in Page Objects (`OpenAccountPage`, `TransferFundsPage`) must avoid injecting unsanitized external strings into DOM queries (`document.querySelector`) — pass arguments safely as parameters to `waitForFunction(fn, arg)` if dynamic values are ever needed.
- [ ] **Storage state isolation:** Saved browser authentication state (`playwright/.auth/*.json`) must never be committed to Git.

### 4. Repository & Build Hygiene (`.gitignore` & `package.json`)
- [ ] `.gitignore` excludes `node_modules/`, `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`, `/playwright/.auth/`, `.env`, `.claude/.review-cache/`, and `.agents/.review-cache/`.
- [ ] Dependencies in `package.json` use explicit semver ranges under `devDependencies` (`@playwright/test`, `@types/node`) with lockfile (`package-lock.json`) committed.

## Severity Classification

| Severity | Examples |
|---|---|
| **Critical** | Real credentials, API keys, or session tokens hardcoded in source files or committed in `playwright/.auth/` |
| **High** | `.env`, `.claude/.review-cache/`, or `.agents/.review-cache/` missing from `.gitignore`; passwords or cookies printed to stdout |
| **Medium** | Real PII (real phone numbers, real SSN patterns, real corporate emails) in `src/data/fixtures/` or `tests/`; unsafe string interpolation inside `page.waitForFunction` / `page.evaluate` |
| **Low** | Minor dependency or configuration hardening in `package.json` / `playwright.config.ts` |

## Output Contract

When invoked by an agent with a `feedback_path`, write findings to the feedback file using the shared format:

```markdown
### [ ] F<N> · <Severity> · Security
**Location:** `.gitignore:12`
**Issue:** `.gitignore` does not exclude `.claude/.review-cache/` and `.agents/.review-cache/`, risking accidental commit of review artifacts and cached snippets.
**Fix:**
```gitignore
# Environment and system files
.env
.DS_Store
Thumbs.db

# AI review cache
.claude/.review-cache/
.agents/.review-cache/
```
```

`<Category>` is always `Security`.

## Scope Discipline

- Own credential handling, PII/SSN/phone hygiene in test data, `page.evaluate`/`waitForFunction` injection safety, and `.gitignore`/`package.json` security.
- Defer TypeScript typing and code style to `code-review` and Playwright locator/POM mechanics to `playwright-review`.
