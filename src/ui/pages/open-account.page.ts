import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
import { AccountType } from '../../data/models/account.model';

export class OpenAccountPage extends BasePage {
  readonly accountTypeSelect: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly openAccountButton: Locator;
  readonly resultContainer: Locator;
  readonly resultTitle: Locator;
  readonly newAccountIdLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountIdSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.resultContainer = page.locator('#openAccountResult');
    this.resultTitle = page.locator('#openAccountResult h1.title');
    this.newAccountIdLink = page.locator('#newAccountId');
  }

  get urlPath(): string {
    return PATHS.openAccount;
  }

  async selectAccountType(type: AccountType): Promise<void> {
    const value = type === 'SAVINGS' ? '1' : '0';
    await this.accountTypeSelect.selectOption(value);
  }

  async selectFromAccount(accountId?: string): Promise<void> {
    // Wait until fromAccountId options are populated via AJAX
    await this.page.waitForFunction(() => {
      const select = document.querySelector('#fromAccountId') as HTMLSelectElement | null;
      return select && select.options.length > 0;
    });

    if (accountId) {
      await this.fromAccountIdSelect.selectOption(accountId);
    }
  }

  async clickOpenAccount(): Promise<void> {
    await this.openAccountButton.click();
  }

  async openAccount(type: AccountType, fromAccountId?: string): Promise<string> {
    await this.selectFromAccount(fromAccountId);
    await this.selectAccountType(type);
    await this.clickOpenAccount();
    await this.resultContainer.waitFor({ state: 'visible' });
    return (await this.newAccountIdLink.textContent()) || '';
  }

  async getNewAccountId(): Promise<string> {
    await this.resultContainer.waitFor({ state: 'visible' });
    return (await this.newAccountIdLink.textContent()) || '';
  }
}
