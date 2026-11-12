---
name: code-review
description: Comprehensive TypeScript and Playwright test architecture review for this ParaBank E2E test automation codebase. Checks TypeScript strictness and idioms, layered architecture boundaries (src/ui, src/data, tests), fixture and test isolation, path alias consistency, and test automation antipatterns. Use when reviewing a spec file, page object, component, data factory, or fixture for code quality, reliability, and maintainability.
---

# Code Review Skill — ParaBank E2E Tests (TypeScript + Playwright)

Apply this review checklist to the target code (file, directory, or diff). Be exhaustive yet precise — surface real defects, flakiness risks, and maintainability issues rather than stylistic noise. The codebase uses **TypeScript (ES2022, strict mode)** and **Playwright Test (`@playwright/test`)** organized into three layers: `src/ui/` (Pages & Components), `src/data/` (Models, Fixtures, Factories), and `tests/` (Playwright Fixtures & Feature Specs).

## Checklist

### TypeScript Idioms & Type Safety
- [ ] Strict typing enforced: no explicit `any`, untyped parameters, or unsafe type assertions (`as unknown as ...`) when proper interfaces exist in `src/data/models/` (`User`, `UserCredentials`, `Account`, `AccountType`, `BillPayee`, `BillPaymentRequest`, `BillPaymentResult`, `TransferRequest`, `TransferResult`)
- [ ] `readonly` modifier applied to all `Locator`, `Page`, and child component properties on Page Objects (`BasePage` subclasses) and Components (`BaseComponent` subclasses)
- [ ] Explicit return types (`Promise<void>`, `Promise<string>`, `Promise<TransferResult>`, etc.) declared on all public Page Object and Component methods
- [ ] No unused imports or dead variables (e.g. importing `DEFAULT_DEMO_USER` in `login.spec.ts` or `Account` in `accounts-overview.page.ts` without using them)
- [ ] Consistent module imports: prefer barrel imports (`src/data/fixtures`, `src/data/factories`, `src/ui/pages`) or configured `tsconfig.json` path aliases (`@pages/*`, `@components/*`, `@data/*`, `@models/*`, `@fixtures/*`) consistently rather than deep brittle relative chains
- [ ] Constants objects in `src/data/fixtures/` use `as const` or explicit domain interfaces (`Record<string, BillPayee>`, `User`, `UserCredentials`) for immutability and literal type inference
- [ ] No leftover `console.log(...)` or `page.pause()` debugging statements in specs, fixtures, or page objects

### Layered Architecture & Test Isolation
- [ ] **Three-layer separation of concerns:**
  - `src/ui/` must not import from `tests/`
  - `src/data/` must remain pure data/models/factories and never import `@playwright/test` or `src/ui/`
  - `tests/**/*.spec.ts` must import `test` and `expect` from `../fixtures/base.fixture` (or `@fixtures/base.fixture`), never directly from `@playwright/test`
- [ ] **Independent, isolated tests:** Each `test(...)` block must be self-contained and independent of execution order. Never share mutable user/account state across `test(...)` blocks in module-scoped `let` variables
- [ ] **Fixture reuse (`registeredUser`):** Tests that require an authenticated user should inject the `registeredUser` fixture from `tests/fixtures/base.fixture.ts` rather than duplicating manual `createRandomUser()` + `registerPage.goto()` + `registerPage.register(...)` boilerplate (except in `tests/auth/` where registration/login itself is under test)
- [ ] **Unique dynamic data per test run:** User registration and bill pay tests must use factory functions (`createRandomUser`, `createRandomBillPayment`) so parallel or repeated runs against the shared ParaBank server do not collide

### Antipatterns in Test Automation
- [ ] **Hardcoded UI strings & paths in specs/pages:** Expected titles, error messages, and URL paths should reference `MESSAGES` and `PATHS` in `src/data/fixtures/test-constants.ts` instead of duplicating string literals (e.g. `'Bill Payment Complete'`, `'Passwords did not match.'`)
- [ ] **Vacuous or weak assertions:** Avoid `expect(value).toBeTruthy()` when a stronger format/content assertion applies (e.g. `expect(newAccountId).toMatch(/^\d+$/)` for numeric ParaBank account IDs)
- [ ] **Unawaited promises:** Every Playwright async call (`fill`, `click`, `goto`, `selectOption`, `waitFor`, `expect(...)`) must be `await`ed
- [ ] **Swallowed errors or silent fallbacks:** Avoid returning `''` via `(await locator.textContent()) || ''` when asserting critical values if web-first `await expect(locator).toContainText(...)` can be asserted directly on the `Locator`
- [ ] **Dead code or misleading comments:** Comments and method names must accurately reflect the test action and assertion

## Output Contract

When invoked by an agent that supplies a `feedback_path`, write findings to that file using **exactly** the format below. The first line of every finding **must** be `### [ ] F<N> · <Severity> · <Category>` — the `[ ]` checkbox is parsed downstream.

```markdown
# Code Review — Iteration <N>

**Target:** <path or scope>
**Date:** <YYYY-MM-DD>

## Summary

- Total findings: <N>
- Critical: <X> | High: <Y> | Medium: <Z> | Low: <W>

## Findings

### [ ] F1 · Low · TypeScript
**Location:** `src/ui/pages/accounts-overview.page.ts:4`
**Issue:** `Account` is imported from `../../data/models/account.model` but never used in `AccountsOverviewPage`.
**Fix:**
```typescript
import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
```
```

Severity scale: `Critical` (unawaited async Playwright operation causing race conditions, broken compilation, shared mutable state across tests) · `High` (flaky test isolation, bypassed `base.fixture.ts`, false-positive assertion) · `Medium` (hardcoded magic strings instead of `MESSAGES`/`PATHS`, weak `toBeTruthy()` assertion on IDs, architectural layer violation) · `Low` (unused import, missing return type annotation, naming/comment drift, polish).

When invoked **without** a `feedback_path` (interactive single-shot), produce the same content as plain output and end with a summary table by severity.

## Scope Discipline

- Read the target file(s) fully before flagging issues — partial reads produce false positives.
- Defer Playwright locator strategy, auto-waiting, and Page Object encapsulation mechanics to `playwright-review`, credential/PII/environment safety to `security-audit`, and missing E2E feature scenarios to `coverage-analysis`. This skill owns TypeScript idioms, strictness, architectural boundaries, test isolation, and general test code quality.
- Do not propose refactors beyond what each finding requires.
