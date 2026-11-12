---
name: coverage-analysis
description: E2E UI test scenario coverage gap analysis for this ParaBank Playwright + TypeScript test suite. Maps existing spec files against ParaBank functional domains (auth/login, auth/register, accounts/overview, accounts/open-account, transfer/transfer-funds, bill-pay), positive journeys, form validation errors, boundary cases, and state verification. Use during review to surface missing E2E test scenarios; pair with test-generation to implement them.
---

# E2E Test Coverage Analysis Skill — ParaBank Playwright Tests

In an E2E UI test automation repository (`tests/**/*.spec.ts`), coverage analysis evaluates **user journey & validation scenario completeness** across ParaBank features rather than application source-code line coverage. Apply this skill to identify high-value missing negative, validation, boundary, and state-verification test cases for the target `.spec.ts` file or feature directory.

## Scenario Coverage Matrix per ParaBank Feature

| Feature Area (`tests/`) | Page Objects Used | High-Value Scenarios Expected | Priority |
|---|---|---|---|
| **Authentication — Login** (`tests/auth/login.spec.ts`) | `LoginPage`, `AccountMenuComponent`, `RegisterPage` | 1. Login panel visibility on home page<br>2. Valid login with registered user & welcome message check<br>3. Invalid credentials error (`MESSAGES.invalidLogin`)<br>4. Empty username or empty password submission error (`Please enter a username and password.`)<br>5. Successful logout returning to login panel<br>6. Navigation links from login panel (`Register`, `Forgot login info?`) | High |
| **Authentication — Register** (`tests/auth/register.spec.ts`) | `RegisterPage`, `AccountMenuComponent` | 1. Successful new user registration & auto-login<br>2. Mismatched confirm password error (`Passwords did not match.`)<br>3. Duplicate username registration error (`This username already exists.`)<br>4. Required field validation errors when submitting empty registration form | High |
| **Accounts — Overview** (`tests/accounts/accounts-overview.spec.ts`) | `AccountsOverviewPage`, `OpenAccountPage` | 1. Accounts overview table & initial account row displayed for authenticated user<br>2. Total balance row displayed in table footer<br>3. Newly opened account appears in the Accounts Overview account IDs list<br>4. Clicking an account ID navigates to Account Details (`activity.htm`) | High |
| **Accounts — Open Account** (`tests/accounts/open-account.spec.ts`) | `OpenAccountPage`, `AccountsOverviewPage` | 1. Open new `SAVINGS` account and verify non-empty numeric account ID<br>2. Open new `CHECKING` account and verify account creation title & ID link<br>3. Navigate to new account details by clicking `newAccountIdLink` | High |
| **Transfer — Transfer Funds** (`tests/transfer/transfer-funds.spec.ts`) | `TransferFundsPage`, `OpenAccountPage`, `AccountsOverviewPage` | 1. Transfer funds between two accounts (`fromAccountId` -> `toAccountId`) and verify `MESSAGES.transferCompleteTitle`, `amountResult`, `fromAccountIdResult`, `toAccountIdResult`<br>2. Submitting transfer form with empty amount shows validation error (`#amount.errors` / `The amount cannot be empty.`)<br>3. Submitting transfer form with non-numeric/invalid amount shows validation error (`Please enter a valid amount.`) | High |
| **Bill Pay — Pay Bill** (`tests/bill-pay/bill-pay.spec.ts`) | `BillPayPage`, `OpenAccountPage` | 1. Pay bill with valid payee data (`createRandomBillPayment` or `SAMPLE_BILL_PAYEES`) and verify `MESSAGES.billPaymentCompleteTitle`, payee name, amount, and source account ID<br>2. Empty bill payment form submission displays required-field validation errors<br>3. Mismatched account number and `verifyAccount` displays mismatch error (`The account numbers do not match.`)<br>4. Paying bill from a specific newly opened account verifies `resultFromAccountId` matches the selected account | High |

## Procedure

### 1. Determine Target Feature & Existing Tests
- Read the target file (or feature directory under `tests/`).
- **Fast-path skip for non-spec targets:** If `target` is in `src/ui/`, `src/data/`, `tests/fixtures/`, `playwright.config.ts`, `package.json`, or any file that is **not** a `*.spec.ts` file (or a directory under `tests/` containing `*.spec.ts` files), write `_N/A — E2E scenario coverage analysis applies only to *.spec.ts files._` to `output_path` and return `COUNT=0`.
- Identify the ParaBank feature under test (`auth`, `accounts`, `transfer`, `bill-pay`) and scan sibling `.spec.ts` files in the **same feature folder** so you do not flag a scenario as missing if a sibling spec file already covers it.
- Read the corresponding Page Object(s) in `src/ui/pages/` to see which locators and methods already exist.

### 2. Identify High-Value Missing Scenarios in the Target Spec
- Check the Scenario Coverage Matrix above against the existing `test(...)` blocks in the target file.
- Also check whether existing positive tests omit critical contract assertions on properties already returned by the Page Object (e.g. `transferFundsPage.transfer()` returns `{ amount, fromAccountId, toAccountId }`, or `billPayPage.payBill()` returns `{ payeeName, amount, fromAccountId }` — verify all returned fields are asserted!).
- If a proposed test requires a new locator on a Page Object (and that locator does not yet exist on the Page Object), either:
  - Prefer scenarios that work with existing Page Object locators/methods first, OR
  - Note `out-of-scope: src/ui/pages/<page>.ts` in the Fix and use only existing Page Object properties or add the locator cleanly if both files are in scope.

### 3. Cap and Prioritize Findings
- Emit **at most 3 coverage findings per file** so the implementator can add clean, deterministic tests without bloating a single spec file.
- Prioritize:
  1. `High` — Missing core feature variant (e.g. `CHECKING` account in `open-account.spec.ts`, duplicate username in `register.spec.ts`, verifyAccount mismatch in `bill-pay.spec.ts`) or missing assertion on returned DTO fields
  2. `Medium` — Secondary negative validation scenario or post-action state check (e.g. verifying newly opened account appears in `AccountsOverviewPage`)
  3. `Low` — UI navigation link or minor edge case

## Output Contract

When invoked with `feedback_path`, write findings using the shared format:

```markdown
### [ ] F<N> · <Severity> · Coverage
**Location:** `tests/accounts/open-account.spec.ts:17`
**Issue:** `open-account.spec.ts` only verifies opening a `SAVINGS` account; there is no test covering `CHECKING` account creation (`AccountType = 'CHECKING'`).
**Fix:**
```typescript
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
```
**Apply with:** the `test-generation` skill.
```

`<Category>` is always `Coverage`.

## Scope Discipline

- Do **not** flag TypeScript style, unused imports, or POM refactoring issues in existing tests — those belong to `code-review` and `playwright-review`.
- Every proposed `test(...)` block must use fixtures from `tests/fixtures/base.fixture.ts` (`registeredUser`, page objects), factories/constants from `src/data/`, and never use raw `page.locator(...)` calls in the spec if a Page Object locator is available.
