import { test, expect } from '../fixtures/base.fixture';
import { MESSAGES } from '../../src/data/fixtures';

test.describe('Accounts - Open New Account', () => {
  test('should open a new savings account successfully', async ({
    registeredUser,
    openAccountPage,
  }) => {
    await openAccountPage.goto();

    const newAccountId = await openAccountPage.openAccount('SAVINGS');

    await expect(openAccountPage.resultTitle).toContainText(MESSAGES.accountOpenedTitle);
    await expect(openAccountPage.newAccountIdLink).toBeVisible();
    expect(newAccountId).toBeTruthy();
  });
});
