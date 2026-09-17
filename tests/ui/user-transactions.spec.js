import { test } from '../../src/fixtures/ui-fixtures.js';
import { environment } from '../../src/test-config/environment-configuration.js';
import { createTransaction, createUser } from '../../src/test-data/factories.js';

test.describe('Transaction creation', () => {
  test('creates a transfer from the UI', async ({ page, request, transactions }) => {
    const userResponse = await request.post(`${environment.apiBaseUrl}/users`, { data: createUser(), headers: { Authorization: `Bearer ${environment.authToken}` } });
    const user = await userResponse.json();
    await page.goto('/transactions');
    await transactions.create(createTransaction(user.id));
    await transactions.expectSuccess();
  });

  test('shows an error for an invalid transaction', async ({ page, transactions }) => {
    await page.goto('/transactions');
    await transactions.create(createTransaction('missing-user', { amount: -10 }));
    await transactions.expectError('Invalid transaction data');
  });
});
