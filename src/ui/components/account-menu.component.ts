import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class AccountMenuComponent extends BaseComponent {
  readonly welcomeMessage: Locator;
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logOutLink: Locator;

  constructor(page: Page) {
    super(page, page.locator('#leftPanel'));
    this.welcomeMessage = this.root.locator('p.smallText');
    this.openNewAccountLink = this.root.locator('a[href*="openaccount.htm"]');
    this.accountsOverviewLink = this.root.locator('a[href*="overview.htm"]');
    this.transferFundsLink = this.root.locator('a[href*="transfer.htm"]');
    this.billPayLink = this.root.locator('a[href*="billpay.htm"]');
    this.findTransactionsLink = this.root.locator('a[href*="findtrans.htm"]');
    this.updateContactInfoLink = this.root.locator('a[href*="updateprofile.htm"]');
    this.requestLoanLink = this.root.locator('a[href*="requestloan.htm"]');
    this.logOutLink = this.root.locator('a[href*="logout.htm"]');
  }

  async getWelcomeText(): Promise<string> {
    return (await this.welcomeMessage.textContent()) || '';
  }

  async clickOpenNewAccount(): Promise<void> {
    await this.openNewAccountLink.click();
  }

  async clickAccountsOverview(): Promise<void> {
    await this.accountsOverviewLink.click();
  }

  async clickTransferFunds(): Promise<void> {
    await this.transferFundsLink.click();
  }

  async clickBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  async clickFindTransactions(): Promise<void> {
    await this.findTransactionsLink.click();
  }

  async clickUpdateContactInfo(): Promise<void> {
    await this.updateContactInfoLink.click();
  }

  async clickRequestLoan(): Promise<void> {
    await this.requestLoanLink.click();
  }

  async clickLogOut(): Promise<void> {
    await this.logOutLink.click();
  }
}
