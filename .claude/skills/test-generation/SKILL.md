---
name: test-generation
description: Generates idiomatic Playwright + TypeScript E2E tests and Page Object extensions for this ParaBank test automation project. Produces type-safe, isolated test specs importing from base.fixture.ts, leveraging Page Objects (src/ui/pages), UI Components (src/ui/components), dynamic data factories (createRandomUser, createRandomBillPayment), and constants (MESSAGES, PATHS). Use when fixing Coverage findings or adding new ParaBank E2E tests.
---

# E2E Test Generation Skill — ParaBank Playwright Tests

Use this skill to write new `test(...)` blocks, spec files (`tests/**/*.spec.ts`), or Page Object methods (`src/ui/pages/*.page.ts`), especially when resolving `Coverage` findings during the `/review` loop.

## Conventions

- **Test Runner & Fixtures:** Always import `{ test, expect }` from `../fixtures/base.fixture` (never directly from `@playwright/test` in spec files).
- **Authentication Isolation:**
  - For any post-login feature (`accounts`, `transfer`, `bill-pay`), inject the `registeredUser` fixture in the test signature (`async ({ registeredUser, ... }) => { ... }`). It automatically registers and logs in a unique isolated user.
  - For registration or login tests in `tests/auth/`, use `createRandomUser()` from `../../src/data/factories` (or `INVALID_USER_CREDENTIALS` from `../../src/data/fixtures`).
- **Page Objects & Components:**
  - Use injected fixtures: `loginPage`, `registerPage`, `accountsOverviewPage`, `openAccountPage`, `transferFundsPage`, `billPayPage`, `header`, `navigation`, `accountMenu`, `footer`.
  - Never write raw `page.locator(...)` in `.spec.ts` files — encapsulate all selectors as `readonly` `Locator` properties on the Page Object or Component.
- **Test Data & Constants:**
  - Use `MESSAGES` and `PATHS` from `../../src/data/fixtures` for expected titles, messages, and URLs.
  - Use `createRandomUser()` and `createRandomBillPayment()` from `../../src/data/factories` for dynamic, collision-free test data.
- **Assertions:**
  - Prefer Playwright web-first assertions (`await expect(locator).toBeVisible()`, `await expect(locator).toContainText(...)`, `await expect(locator).toHaveText(...)`).
  - Validate returned DTO fields (`TransferResult`, `BillPaymentResult`, `newAccountId`) with deterministic matchers (`expect(newAccountId).toMatch(/^\d+$/)`).

## Templates

### 1. Authenticated Feature Test (using `registeredUser` fixture)

```typescript
import { test, expect } from '../fixtures/base.fixture';
import { MESSAGES } from '../../src/data/fixtures';

test.describe('Accounts - Open New Account', () => {
  test('should open a new checking account successfully', async ({
    registeredUser,
    openAccountPage,
  }) => {
    await openAccountPage.goto();

    const newAccountId = await openAccountPage.openAccount('CHECKING');

    await expect(openAccountPage.resultTitle).toContainText(MESSAGES.accountOpenedTitle);
    await expect(openAccountPage.newAccountIdLink).toBeVisible();
    expect(newAccountId).toMatch(/^\d+$/);
  });
});
```

### 2. Multi-Account / Financial Transaction Test

```typescript
test('should transfer funds and verify source and destination accounts', async ({
  registeredUser,
  accountsOverviewPage,
  openAccountPage,
  transferFundsPage,
}) => {
  await accountsOverviewPage.goto();
  const sourceAccountId = await accountsOverviewPage.getFirstAccountId();

  await openAccountPage.goto();
  const destinationAccountId = await openAccountPage.openAccount('SAVINGS', sourceAccountId);

  await transferFundsPage.goto();
  const result = await transferFundsPage.transfer({
    amount: '75.00',
    fromAccountId: sourceAccountId,
    toAccountId: destinationAccountId,
  });

  await expect(transferFundsPage.resultTitle).toContainText(MESSAGES.transferCompleteTitle);
  expect(result.amount).toContain('75.00');
  expect(result.fromAccountId).toBe(sourceAccountId);
  expect(result.toAccountId).toBe(destinationAccountId);
});
```

### 3. Negative Validation / Error State Test

```typescript
test('should show error when registering with an existing username', async ({
  registerPage,
  accountMenu,
}) => {
  const existingUser = createRandomUser();

  await registerPage.goto();
  await registerPage.register(existingUser);
  await accountMenu.clickLogOut();

  await registerPage.goto();
  await registerPage.register(existingUser);

  await expect(registerPage.usernameError).toBeVisible();
  await expect(registerPage.usernameError).toContainText('This username already exists.');
});
```

## After Writing Tests

Run the TypeScript and Playwright verification chain:

```bash
# 1. Always verify TypeScript compilation and strict types first:
npx tsc --noEmit

# 2. List/validate test registration in Playwright without launching a browser:
npx playwright test --list <path/to/spec.ts>
```

## Scope Discipline

- Generate only the `test(...)` blocks or Page Object helpers required by the finding or user request.
- Reuse `tests/fixtures/base.fixture.ts`, `src/ui/pages/`, `src/data/factories/`, and `src/data/fixtures/` rather than duplicating boilerplate.
- Never use `page.waitForTimeout(...)` or hardcode real PII/credentials.
