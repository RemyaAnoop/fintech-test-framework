import { expect } from '@playwright/test';

export class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.userId = page.getByLabel('User ID');
    this.recipientId = page.getByLabel('Recipient ID');
    this.txnType = page.getByLabel('Transaction type');
    this.txnAmount = page.getByLabel('Amount');
    this.createButton = page.getByRole('button', { name: 'Create transaction' });
    this.message = page.getByRole('status');
  }

  async create(transactionFlow) {
    await this.userId.fill(transactionFlow.userId);
    await this.recipientId.fill(transactionFlow.recipientId);
    await this.txnType.selectOption(transactionFlow.type);
    await this.txnAmount.fill(String(transactionFlow.amount));
    await this.createButton.click();
  }

  async expectSuccess() { await expect(this.message).toContainText('created successfully'); }
  async expectError(text) { await expect(this.message).toContainText(text); }
}
