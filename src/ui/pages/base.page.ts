import { Page, Response } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { NavigationComponent } from '../components/navigation.component';
import { FooterComponent } from '../components/footer.component';
import { AccountMenuComponent } from '../components/account-menu.component';

export abstract class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly navigation: NavigationComponent;
  readonly footer: FooterComponent;
  readonly accountMenu: AccountMenuComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.navigation = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
    this.accountMenu = new AccountMenuComponent(page);
  }

  abstract get urlPath(): string;

  async goto(): Promise<Response | null> {
    return this.page.goto(this.urlPath, { waitUntil: 'domcontentloaded' });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
