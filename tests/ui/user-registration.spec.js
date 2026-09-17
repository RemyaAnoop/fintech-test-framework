import { test } from '../../src/fixtures/ui-fixtures.js';
import { createUser } from '../../src/test-data/factories.js';

test.describe('User registration', () => {
  test('registers a premium user', async ({ registration }) => {
    await registration.open();
    await registration.register(createUser());
    await registration.expectSuccess();
    await registration.expectUserId();
  });

  test('shows a validation error for an invalid email', async ({ registration }) => {
    await registration.open();
    await registration.register(createUser({ email: 'invalid-email' }));
    await registration.expectError('Invalid user data');
  });
});
