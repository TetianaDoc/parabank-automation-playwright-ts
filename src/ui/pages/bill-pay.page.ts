import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
import { BillPaymentRequest, BillPaymentResult } from '../../data/models/bill-pay.model';

export class BillPayPage extends BasePage {
  readonly payeeNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly sendPaymentButton: Locator;

  readonly resultContainer: Locator;
  readonly resultTitle: Locator;
  readonly resultPayeeName: Locator;
  readonly resultAmount: Locator;
  readonly resultFromAccountId: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.streetInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountIdSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');

    this.resultContainer = page.locator('#billpayResult');
    this.resultTitle = page.locator('#billpayResult h1.title');
    this.resultPayeeName = page.locator('#billpayResult #payeeName');
    this.resultAmount = page.locator('#billpayResult #amount');
    this.resultFromAccountId = page.locator('#billpayResult #fromAccountId');
  }

  get urlPath(): string {
    return PATHS.billPay;
  }

  async fillPaymentForm(data: BillPaymentRequest): Promise<void> {
    await this.payeeNameInput.fill(data.payee.name);
    await this.streetInput.fill(data.payee.address.street);
    await this.cityInput.fill(data.payee.address.city);
    await this.stateInput.fill(data.payee.address.state);
    await this.zipCodeInput.fill(data.payee.address.zipCode);
    await this.phoneNumberInput.fill(data.payee.phoneNumber);
    await this.accountNumberInput.fill(data.payee.accountNumber);
    await this.verifyAccountInput.fill(data.verifyAccount);
    await this.amountInput.fill(data.amount);

    if (data.fromAccountId) {
      await this.fromAccountIdSelect.selectOption(data.fromAccountId);
    }
  }

  async clickSendPayment(): Promise<void> {
    await this.sendPaymentButton.click();
  }

  async payBill(data: BillPaymentRequest): Promise<BillPaymentResult> {
    await this.fillPaymentForm(data);
    await this.clickSendPayment();
    await this.resultContainer.waitFor({ state: 'visible' });

    return {
      payeeName: (await this.resultPayeeName.textContent()) || '',
      amount: (await this.resultAmount.textContent()) || '',
      fromAccountId: (await this.resultFromAccountId.textContent()) || '',
    };
  }
}
