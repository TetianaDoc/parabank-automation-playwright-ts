import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  protected readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, rootLocator: Locator) {
    this.page = page;
    this.root = rootLocator;
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
