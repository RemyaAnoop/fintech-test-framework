import { test } from '../../src/fixtures/api-fixtures.js';
import { expect } from '@playwright/test';
import { createUser } from '../../src/test-data/factories.js';
import { expectApiError, logApiResponse } from '../../src/utils/api-helpers.js';
import { expectUserContract } from '../../src/utils/custom-assertions.js';

test.describe('User service API', () => {
  test('creates and retrieves a user', async ({ apiClient }) => {
    const user = createUser();
    const createdResponse = await apiClient.createUser(user);
    const created = await logApiResponse(createdResponse, 'POST /users');
    expect(createdResponse.status()).toBe(201);
    expectUserContract(created);
    const getResponse = await apiClient.getUser(created.id);
    const fetched = await logApiResponse(getResponse, 'GET /users/:id');
    expect(getResponse.ok()).toBeTruthy();
    expect(fetched).toMatchObject(user);
  });

  test('rejects invalid payloads', async ({ apiClient }) => {
    await expectApiError(await apiClient.createUser({ name: '', email: 'bad', accountType: 'gold' }), 400, 'Invalid user data');
  });

  test('protects endpoints without authentication', async ({ apiClient }) => {
    const response = await apiClient.createUser(createUser(), '');
    await expectApiError(response, 401, 'Unauthorized');
  });

  test('rejects invalid authentication tokens', async ({ apiClient }) => {
    const response = await apiClient.getUser('unknown', 'invalid-token');
    await expectApiError(response, 401, 'Unauthorized');
  });

  test('returns not found for an unknown user', async ({ apiClient }) => {
    const response = await apiClient.getUser('unknown-user');
    await expectApiError(response, 404, 'User not found');
  });

});
