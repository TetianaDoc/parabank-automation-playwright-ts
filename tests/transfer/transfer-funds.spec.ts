import { test, expect } from '../fixtures/base.fixture';
import { MESSAGES } from '../../src/data/fixtures';

test.describe('Transfer - Transfer Funds', () => {
  test('should transfer funds between accounts', async ({
    registeredUser,
    openAccountPage,
    transferFundsPage,
  }) => {
    // Open a second account so we have both a source and destination account
    await openAccountPage.goto();
    const newAccountId = await openAccountPage.openAccount('CHECKING');

    await transferFundsPage.goto();
    const result = await transferFundsPage.transfer({
      amount: '50.00',
      toAccountId: newAccountId,
    });

    await expect(transferFundsPage.resultTitle).toContainText(MESSAGES.transferCompleteTitle);
    expect(result.amount).toContain('50.00');
  });
});
