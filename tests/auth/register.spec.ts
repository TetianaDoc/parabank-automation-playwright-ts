import { test, expect } from '../fixtures/base.fixture';
import { createRandomUser } from '../../src/data/factories';
import { MESSAGES } from '../../src/data/fixtures';

test.describe('Authentication - Register', () => {
  test('should register a new user successfully', async ({ registerPage, accountMenu }) => {
    const newUser = createRandomUser();

    await registerPage.goto();
    await registerPage.register(newUser);

    await expect(registerPage.successTitle).toContainText(`Welcome ${newUser.username}`);
    await expect(registerPage.successMessage).toContainText(MESSAGES.registrationSuccess);
    await expect(accountMenu.welcomeMessage).toContainText(newUser.firstName);
  });

  test('should show error when passwords do not match', async ({ registerPage }) => {
    const user = createRandomUser();

    await registerPage.goto();
    await registerPage.register(user, 'MismatchedPassword999!');

    await expect(registerPage.passwordError).toBeVisible();
    await expect(registerPage.passwordError).toContainText('Passwords did not match.');
  });
});
