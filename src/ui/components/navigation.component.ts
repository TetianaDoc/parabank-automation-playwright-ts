import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class NavigationComponent extends BaseComponent {
  // Top right icon buttons
  readonly homeButton: Locator;
  readonly aboutButton: Locator;
  readonly contactButton: Locator;

  // Header left menu
  readonly solutionsMenu: Locator;
  readonly aboutUsLink: Locator;
  readonly servicesLink: Locator;
  readonly productsLink: Locator;
  readonly locationsLink: Locator;
  readonly adminPageLink: Locator;

  constructor(page: Page) {
    super(page, page.locator('#headerPanel'));
    this.homeButton = this.root.locator('ul.button li.home a');
    this.aboutButton = this.root.locator('ul.button li.aboutus a');
    this.contactButton = this.root.locator('ul.button li.contact a');

    this.solutionsMenu = this.root.locator('ul.leftmenu');
    this.aboutUsLink = this.solutionsMenu.locator('a[href*="about.htm"]');
    this.servicesLink = this.solutionsMenu.locator('a[href*="services.htm"]');
    this.productsLink = this.solutionsMenu.locator('a[href*="products.jsp"]');
    this.locationsLink = this.solutionsMenu.locator('a[href*="contacts.jsp"]');
    this.adminPageLink = this.solutionsMenu.locator('a[href*="admin.htm"]');
  }

  async goHome(): Promise<void> {
    await this.homeButton.click();
  }

  async goToAbout(): Promise<void> {
    await this.aboutButton.click();
  }

  async goToContact(): Promise<void> {
    await this.contactButton.click();
  }
}
