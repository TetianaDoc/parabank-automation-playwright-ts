import { test, expect } from '../fixtures/base.fixture';
import { DEFAULT_DEMO_USER, INVALID_USER_CREDENTIALS, MESSAGES } from '../../src/data/fixtures';
import { createRandomUser } from '../../src/data/factories';

test.describe('Authentication - Login', () => {
  test('should display login panel on home page', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login successfully with valid registered user', async ({
    registerPage,
    loginPage,
    accountMenu,
  }) => {
    // Register a fresh user first
    const user = createRandomUser();
    await registerPage.goto();
    await registerPage.register(user);

    // Logout
    await accountMenu.clickLogOut();

    // Login with the new credentials
    await loginPage.login({ username: user.username, password: user.password });

    // Verify user is logged in
    await expect(accountMenu.welcomeMessage).toBeVisible();
    await expect(accountMenu.welcomeMessage).toContainText(user.firstName);
  });

  test('should show error message when login with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(INVALID_USER_CREDENTIALS);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(MESSAGES.invalidLogin);
  });

  test('should log out successfully', async ({ registerPage, accountMenu, loginPage }) => {
    const user = createRandomUser();
    await registerPage.goto();
    await registerPage.register(user);

    await expect(accountMenu.welcomeMessage).toBeVisible();

    await accountMenu.clickLogOut();

    await expect(loginPage.loginButton).toBeVisible();
  });
});
