import { test, expect } from '../fixtures/base.fixture';
import { createRandomBillPayment } from '../../src/data/factories';

test.describe('Bill Pay - Pay Bill', () => {
  test('should pay a bill successfully', async ({
    registeredUser,
    billPayPage,
  }) => {
    await billPayPage.goto();

    const billData = createRandomBillPayment({ amount: '25.00' });
    const result = await billPayPage.payBill(billData);

    await expect(billPayPage.resultContainer).toBeVisible();
    await expect(billPayPage.resultTitle).toContainText('Bill Payment Complete');
    expect(result.payeeName).toBe(billData.payee.name);
    expect(result.amount).toContain('25.00');
  });

  test('should show validation errors when submitting empty bill payment form', async ({
    registeredUser,
    billPayPage,
  }) => {
    await billPayPage.goto();
    await billPayPage.clickSendPayment();

    await expect(billPayPage.page.locator('#validationModel-name')).toBeVisible();
    await expect(billPayPage.page.locator('#validationModel-address')).toBeVisible();
  });
});
