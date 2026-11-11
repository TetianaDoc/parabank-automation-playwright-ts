import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class HeaderComponent extends BaseComponent {
  readonly logo: Locator;
  readonly adminLink: Locator;
  readonly caption: Locator;

  constructor(page: Page) {
    super(page, page.locator('#topPanel'));
    this.logo = this.root.locator('img.logo');
    this.adminLink = this.root.locator('img.admin');
    this.caption = this.root.locator('p.caption');
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async clickAdmin(): Promise<void> {
    await this.adminLink.click();
  }

  async getCaptionText(): Promise<string> {
    return (await this.caption.textContent()) || '';
  }
}
