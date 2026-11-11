import { test, expect } from '../fixtures/base.fixture';

test.describe('Accounts - Overview', () => {
  test('should display accounts overview table for authenticated user', async ({
    registeredUser,
    accountsOverviewPage,
  }) => {
    await accountsOverviewPage.goto();
    await accountsOverviewPage.waitForAccountsLoaded();

    await expect(accountsOverviewPage.accountTable).toBeVisible();

    const accountIds = await accountsOverviewPage.getAccountIds();
    expect(accountIds.length).toBeGreaterThan(0);
  });
});
