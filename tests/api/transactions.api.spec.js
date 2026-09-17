import { test } from '../../src/fixtures/api-fixtures.js';
import { expect } from '@playwright/test';
import { createTransaction, createUser } from '../../src/test-data/factories.js';
import { expectApiError, logApiResponse } from '../../src/utils/api-helpers.js';
import {
  expectPositiveAmount,
  expectRequiredFields,
  expectTransactionContract,
} from '../../src/utils/custom-assertions.js';

test.describe('Transaction service API', () => {
  test('creates a transaction', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const createdResponse = await apiClient.createTransaction(createTransaction(user.id));
    const created = await logApiResponse(createdResponse, 'POST /transactions');

    expect(createdResponse.status()).toBe(201);
    expectTransactionContract(created);
    expectPositiveAmount(created.amount);
    expectRequiredFields(created, ['id', 'userId', 'amount', 'type', 'recipientId']);
  });

  test('lists transactions for a user', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const createdResponse = await apiClient.createTransaction(createTransaction(user.id));
    const created = await logApiResponse(createdResponse, 'POST /transactions');

    const listResponse = await apiClient.getTransactions(user.id);
    const transactions = await logApiResponse(listResponse, 'GET /transactions/:userId');
    expect(listResponse.status()).toBe(200);
    expect(transactions).toEqual(expect.arrayContaining([expect.objectContaining({ id: created.id })]));
  });

  test('returns an empty list for a user with no transactions', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const response = await apiClient.getTransactions(user.id);
    const transactions = await logApiResponse(response, 'GET /transactions/:userId');

    expect(response.status()).toBe(200);
    expect(transactions).toEqual([]);
  });

  test('rejects zero transaction amounts', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const response = await apiClient.createTransaction(createTransaction(user.id, { amount: 0 }));
    await expectApiError(response, 400, 'Invalid transaction data');
  });


  test('rejects negative transaction amounts', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const response = await apiClient.createTransaction(createTransaction(user.id, { amount: -1 }));
    await expectApiError(response, 400, 'Invalid transaction data');
  });

  test('rejects invalid transaction types', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const response = await apiClient.createTransaction(createTransaction(user.id, { type: 'refund' }));
    await expectApiError(response, 400, 'Invalid transaction data');
  });

  test('rejects transactions without a recipient', async ({ apiClient }) => {
    const userResponse = await apiClient.createUser(createUser());
    const user = await logApiResponse(userResponse, 'POST /users');
    const response = await apiClient.createTransaction(createTransaction(user.id, { recipientId: '' }));
    await expectApiError(response, 400, 'Invalid transaction data');
  });

  test('rejects transactions for unknown users', async ({ apiClient }) => {
    const response = await apiClient.createTransaction(createTransaction('invalid-user'));
    await expectApiError(response, 400, 'Invalid transaction data');
  });

  test('requires authentication', async ({ apiClient }) => {
    const response = await apiClient.getTransactions('user-123', '');
    await expectApiError(response, 401, 'Unauthorized');
  });

  test('rejects invalid authentication tokens', async ({ apiClient }) => {
    const response = await apiClient.getTransactions('user-123', 'invalid-token');
    await expectApiError(response, 401, 'Unauthorized');
  });
});
