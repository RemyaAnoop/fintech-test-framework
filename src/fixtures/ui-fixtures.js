import { test as base } from '@playwright/test';
import { UserRegistrationPage } from '../pages/user-registration-page.js';
import { TransactionsPage } from '../pages/user-transactions-page.js';

export const test = base.extend({
  registration: async ({ page }, use) => {
    await use(new UserRegistrationPage(page));
  },
  transactions: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },
});
