import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
import { Account } from '../../data/models/account.model';

export class AccountsOverviewPage extends BasePage {
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly totalBalanceCell: Locator;
  readonly overviewContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.totalBalanceCell = page.locator('#accountTable tbody tr:last-child td:nth-child(2)');
    this.overviewContainer = page.locator('#showOverview');
  }

  get urlPath(): string {
    return PATHS.overview;
  }

  async waitForAccountsLoaded(): Promise<void> {
    await this.accountTable.waitFor({ state: 'visible' });
    await this.accountRows.first().waitFor({ state: 'visible' });
  }

  async getAccountRowsCount(): Promise<number> {
    await this.waitForAccountsLoaded();
    return this.accountRows.count();
  }

  async getAccountIds(): Promise<string[]> {
    await this.waitForAccountsLoaded();
    const count = await this.accountRows.count();
    const ids: string[] = [];
    // The last row is the Total row
    for (let i = 0; i < count - 1; i++) {
      const link = this.accountRows.nth(i).locator('td:first-child a');
      const text = (await link.textContent())?.trim();
      if (text) {
        ids.push(text);
      }
    }
    return ids;
  }

  async getFirstAccountId(): Promise<string> {
    const ids = await this.getAccountIds();
    if (ids.length === 0) {
      throw new Error('No accounts found on overview page');
    }
    return ids[0];
  }

  async clickAccount(accountId: string): Promise<void> {
    await this.accountTable.locator(`a:has-text("${accountId}")`).click();
  }
}
