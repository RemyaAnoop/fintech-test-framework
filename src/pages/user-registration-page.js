import { expect } from '@playwright/test';

export class UserRegistrationPage {
  constructor(page) {
    this.page = page;
    this.userName = page.getByLabel('Name');
    this.emailAddress = page.getByLabel('Email');
    this.accountType = page.getByLabel('Account type');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.message = page.getByRole('alert');
    this.userId = page.getByTestId('user-id');
  }

  async open() { await this.page.goto('/'); }

  async register(user) {
    await this.userName.fill(user.name);
    await this.emailAddress.fill(user.email);
    await this.accountType.selectOption(user.accountType);
    await this.registerButton.click();
  }

  async expectSuccess() { await expect(this.message).toContainText('User created successfully'); }
  async expectUserId() { await expect(this.userId).not.toBeEmpty(); }
  async expectError(text) { await expect(this.message).toContainText(text); }
}
