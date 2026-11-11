import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class FooterComponent extends BaseComponent {
  readonly homeLink: Locator;
  readonly aboutUsLink: Locator;
  readonly servicesLink: Locator;
  readonly productsLink: Locator;
  readonly locationsLink: Locator;
  readonly siteMapLink: Locator;
  readonly contactUsLink: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    super(page, page.locator('#footermainPanel'));
    this.homeLink = this.root.locator('a[href*="index.htm"]');
    this.aboutUsLink = this.root.locator('a[href*="about.htm"]');
    this.servicesLink = this.root.locator('a[href*="services.htm"]');
    this.productsLink = this.root.locator('a[href*="products.jsp"]');
    this.locationsLink = this.root.locator('a[href*="contacts.jsp"]');
    this.siteMapLink = this.root.locator('a[href*="sitemap.htm"]');
    this.contactUsLink = this.root.locator('a[href*="contact.htm"]');
    this.copyright = this.root.locator('p.copyright');
  }

  async getCopyrightText(): Promise<string> {
    return (await this.copyright.textContent()) || '';
  }
}
