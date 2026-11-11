import { test as baseTest, expect } from '@playwright/test';
import {
  LoginPage,
  RegisterPage,
  AccountsOverviewPage,
  OpenAccountPage,
  TransferFundsPage,
  BillPayPage,
} from '../../src/ui/pages';
import {
  HeaderComponent,
  NavigationComponent,
  AccountMenuComponent,
  FooterComponent,
} from '../../src/ui/components';
import { User } from '../../src/data/models';
import { createRandomUser } from '../../src/data/factories';

export interface PageFixtures {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  accountsOverviewPage: AccountsOverviewPage;
  openAccountPage: OpenAccountPage;
  transferFundsPage: TransferFundsPage;
  billPayPage: BillPayPage;
  header: HeaderComponent;
  navigation: NavigationComponent;
  accountMenu: AccountMenuComponent;
  footer: FooterComponent;
  registeredUser: User;
}

export const test = baseTest.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  accountsOverviewPage: async ({ page }, use) => {
    await use(new AccountsOverviewPage(page));
  },

  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },

  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },

  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },

  navigation: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },

  accountMenu: async ({ page }, use) => {
    await use(new AccountMenuComponent(page));
  },

  footer: async ({ page }, use) => {
    await use(new FooterComponent(page));
  },

  registeredUser: async ({ page, registerPage }, use) => {
    const user = createRandomUser();
    await registerPage.goto();
    await registerPage.register(user);
    await expect(registerPage.successTitle).toContainText(user.username);
    await use(user);
  },
});

export { expect };
