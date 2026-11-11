import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
import { UserCredentials } from '../../data/models/user.model';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotLoginLink: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#loginPanel input[name="username"]');
    this.passwordInput = page.locator('#loginPanel input[name="password"]');
    this.loginButton = page.locator('#loginPanel input[type="submit"][value="Log In"]');
    this.forgotLoginLink = page.locator('#loginPanel a[href*="lookup.htm"]');
    this.registerLink = page.locator('#loginPanel a[href*="register.htm"]');
    this.errorMessage = page.locator('#rightPanel p.error');
  }

  get urlPath(): string {
    return PATHS.home;
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.clickLogin();
  }

  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }

  async clickForgotLogin(): Promise<void> {
    await this.forgotLoginLink.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || '';
  }
}
