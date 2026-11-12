---
name: playwright-review
description: Domain review for Playwright and Page Object Model (POM) idioms in this ParaBank E2E automation project. Checks Locator encapsulation in Page Objects and Components, web-first assertions, AJAX synchronization without arbitrary sleeps, BasePage/BaseComponent inheritance, and Playwright fixture patterns. Use when reviewing spec files, page objects, UI components, or Playwright configuration.
---

# Playwright Review Skill — ParaBank E2E Tests

Apply this checklist to the target code. Focus strictly on idiomatic **Playwright (`@playwright/test`)** usage, Page Object Model (POM) encapsulation, resilient locator strategies, web-first assertions, and synchronization with ParaBank's server-rendered + AJAX UI.

## Checklist

### 1. Page Object Model (POM) & Component Encapsulation (`src/ui/`)
- [ ] **Zero raw locators in spec files:** Test files (`tests/**/*.spec.ts`) must **never** call `page.locator(...)`, `billPayPage.page.locator(...)`, or raw CSS/XPath selectors directly. All locators belong on the corresponding Page Object (`src/ui/pages/*.page.ts`) or Component (`src/ui/components/*.component.ts`) as `readonly` properties
- [ ] **All Page Objects extend `BasePage`:** Every page class in `src/ui/pages/` extends `BasePage`, defines `get urlPath(): string` returning a `PATHS.*` constant, and initializes its `readonly` locators in the `constructor(page: Page)`
- [ ] **All UI Components extend `BaseComponent`:** Shared layout regions (`HeaderComponent`, `NavigationComponent`, `AccountMenuComponent`, `FooterComponent`) extend `BaseComponent` and scope child locators to `this.root.locator(...)` where applicable
- [ ] **Barrel exports updated:** Any new page object or component is exported from `src/ui/pages/index.ts` or `src/ui/components/index.ts` and wired into `PageFixtures` in `tests/fixtures/base.fixture.ts`

### 2. Locator Strategy & Resilience
- [ ] Prefer resilient, specific selectors scoped to their form or container (e.g. `#loginPanel input[name="username"]`, `#billpayResult #payeeName`, `this.root.locator(...)`) over fragile positional selectors or bare tag selectors (`#rightPanel p` when multiple `<p>` elements exist)
- [ ] Avoid string interpolation inside CSS selectors when dynamic text could contain special characters; prefer `.filter({ hasText: ... })` or `getByRole('link', { name: accountId, exact: true })` over `locator(\`a:has-text("\${accountId}")\`)`
- [ ] For validation error elements (e.g. on `BillPayPage`, `RegisterPage`, `TransferFundsPage`), expose dedicated `Locator` properties or a helper method `getValidationError(field: ...): Locator` on the Page Object

### 3. Web-First Assertions vs Manual Extraction
- [ ] Prefer Playwright web-first assertions (`await expect(locator).toBeVisible()`, `await expect(locator).toContainText(...)`, `await expect(locator).toHaveText(...)`, `await expect(locator).toHaveCount(...)`) over extracting primitive values with `await locator.textContent()` / `await locator.isVisible()` and passing them to synchronous `expect(...)`
- [ ] When a Page Object action method returns a result DTO (`TransferResult`, `BillPaymentResult`) by reading `.textContent()`, ensure the container is awaited (`await this.resultContainer.waitFor({ state: 'visible' })`) before reading child text, or assert directly on the `readonly` result locators (`resultPayeeName`, `resultAmount`, `amountResult`, etc.) using `await expect(locator).toContainText(...)`

### 4. Synchronization & Waiting (No Flaky Sleeps)
- [ ] **Never use `page.waitForTimeout(...)`** or hardcoded delays
- [ ] **AJAX-populated `<select>` elements:** ParaBank populates account dropdowns (`#fromAccountId`, `#toAccountId`) asynchronously via XHR after page load. Page Objects that interact with account dropdowns (`OpenAccountPage`, `TransferFundsPage`, `BillPayPage`) must wait for dropdown options to be populated before calling `.selectOption(...)` or submitting the form
- [ ] **Navigation & form submission waits:** Use web-first assertions on the resulting UI state (`await expect(pageObject.resultContainer).toBeVisible()`) rather than brittle `waitForNavigation` or overly strict `waitForResponse` predicates that can time out or miss cached/redirected responses

### 5. Playwright Configuration & Fixtures (`playwright.config.ts`, `base.fixture.ts`)
- [ ] `base.fixture.ts` cleanly injects stateless Page Objects and Components, and `registeredUser` verifies registration succeeded before yielding `await use(user)`
- [ ] Artifacts (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`) remain enabled in `playwright.config.ts` for CI failure triage

## Output Contract

When invoked by an agent with a `feedback_path`, write findings to that file using the shared format:

```markdown
# Playwright Review — Iteration <N>

**Target:** <path or scope>
**Date:** <YYYY-MM-DD>

## Summary

- Total findings: <N>
- Critical: <X> | High: <Y> | Medium: <Z> | Low: <W>

## Findings

### [ ] F1 · Medium · Playwright
**Location:** `tests/bill-pay/bill-pay.spec.ts:27`
**Issue:** Test accesses raw locators directly via `billPayPage.page.locator('#validationModel-name')` and `billPayPage.page.locator('#validationModel-address')`, violating Page Object Model encapsulation.
**Fix:**
Expose `payeeNameError` and `addressError` locators on `BillPayPage` (`out-of-scope: src/ui/pages/bill-pay.page.ts`) or assert via encapsulated `BillPayPage` properties:
```typescript
await expect(billPayPage.payeeNameError).toBeVisible();
await expect(billPayPage.addressError).toBeVisible();
```
```

`<Category>` is always `Playwright`.

Severity scale:
- `Critical` — Hardcoded `waitForTimeout`, race condition from missing AJAX dropdown readiness before form submit, or broken locator causing test failure
- `High` — Raw `page.locator(...)` calls leaked into `tests/**/*.spec.ts`, synchronous `expect(await locator.isVisible()).toBe(true)` bypassing auto-retry
- `Medium` — Fragile CSS/text selector (`a:has-text(...)` instead of `getByRole`/`filter`), manual `textContent()` extraction where web-first `expect(locator).toHaveText(...)` is cleaner
- `Low` — Minor POM ergonomics or locator scoping improvement

## Scope Discipline

- Own Playwright API usage, locator design, Page Object / Component encapsulation, auto-waiting/AJAX synchronization, and web-first assertions.
- Defer general TypeScript typing/imports/constants to `code-review`, secrets/PII/environment safety to `security-audit`, and missing E2E scenario test cases to `coverage-analysis`.
