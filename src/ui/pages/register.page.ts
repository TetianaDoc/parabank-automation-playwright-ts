import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PATHS } from '../../data/fixtures/test-constants';
import { User } from '../../data/models/user.model';

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[id="customer.firstName"]');
    this.lastNameInput = page.locator('input[id="customer.lastName"]');
    this.streetInput = page.locator('input[id="customer.address.street"]');
    this.cityInput = page.locator('input[id="customer.address.city"]');
    this.stateInput = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput = page.locator('input[id="customer.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[id="customer.ssn"]');
    this.usernameInput = page.locator('input[id="customer.username"]');
    this.passwordInput = page.locator('input[id="customer.password"]');
    this.confirmPasswordInput = page.locator('input[id="repeatedPassword"]');
    this.registerButton = page.locator('input[type="submit"][value="Register"]');

    this.successTitle = page.locator('#rightPanel h1.title');
    this.successMessage = page.locator('#rightPanel p');
    this.usernameError = page.locator('span[id="customer.username.errors"]');
    this.passwordError = page.locator('span[id="repeatedPassword.errors"]');
  }

  get urlPath(): string {
    return PATHS.register;
  }

  async fillForm(user: User, confirmPassword?: string): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.streetInput.fill(user.address.street);
    await this.cityInput.fill(user.address.city);
    await this.stateInput.fill(user.address.state);
    await this.zipCodeInput.fill(user.address.zipCode);
    await this.phoneNumberInput.fill(user.phoneNumber);
    await this.ssnInput.fill(user.ssn);
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(confirmPassword !== undefined ? confirmPassword : user.password);
  }

  async clickRegister(): Promise<void> {
    await this.registerButton.click();
  }

  async register(user: User, confirmPassword?: string): Promise<void> {
    await this.fillForm(user, confirmPassword);
    await Promise.all([
      this.page.waitForResponse(
        (response) => response.url().includes('register.htm') && response.status() === 200,
        { timeout: 15000 }
      ),
      this.clickRegister(),
    ]);
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent()) || '';
  }

  async getSuccessTitle(): Promise<string> {
    return (await this.successTitle.textContent()) || '';
  }
}
