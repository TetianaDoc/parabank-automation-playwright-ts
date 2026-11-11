import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
import { TransferRequest, TransferResult } from '../../data/models/transfer.model';

export class TransferFundsPage extends BasePage {
  readonly amountInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly toAccountIdSelect: Locator;
  readonly transferButton: Locator;

  readonly resultContainer: Locator;
  readonly resultTitle: Locator;
  readonly amountResult: Locator;
  readonly fromAccountIdResult: Locator;
  readonly toAccountIdResult: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.fromAccountIdSelect = page.locator('#fromAccountId');
    this.toAccountIdSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('#transferForm input[type="submit"][value="Transfer"]');

    this.resultContainer = page.locator('#showResult');
    this.resultTitle = page.locator('#showResult h1.title');
    this.amountResult = page.locator('#amountResult');
    this.fromAccountIdResult = page.locator('#fromAccountIdResult');
    this.toAccountIdResult = page.locator('#toAccountIdResult');
  }

  get urlPath(): string {
    return PATHS.transfer;
  }

  async waitForAccountsLoaded(): Promise<void> {
    await this.page.waitForFunction(() => {
      const fromSel = document.querySelector('#fromAccountId') as HTMLSelectElement | null;
      const toSel = document.querySelector('#toAccountId') as HTMLSelectElement | null;
      return fromSel && fromSel.options.length > 0 && toSel && toSel.options.length > 0;
    });
  }

  async fillAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectFromAccount(accountId: string): Promise<void> {
    await this.fromAccountIdSelect.selectOption(accountId);
  }

  async selectToAccount(accountId: string): Promise<void> {
    await this.toAccountIdSelect.selectOption(accountId);
  }

  async clickTransfer(): Promise<void> {
    await this.transferButton.click();
  }

  async transfer(request: TransferRequest): Promise<TransferResult> {
    await this.waitForAccountsLoaded();
    await this.fillAmount(request.amount);

    if (request.fromAccountId) {
      await this.selectFromAccount(request.fromAccountId);
    }
    if (request.toAccountId) {
      await this.selectToAccount(request.toAccountId);
    }

    await this.clickTransfer();
    await this.resultContainer.waitFor({ state: 'visible' });

    return {
      amount: (await this.amountResult.textContent()) || '',
      fromAccountId: (await this.fromAccountIdResult.textContent()) || '',
      toAccountId: (await this.toAccountIdResult.textContent()) || '',
    };
  }
}
