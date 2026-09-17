import { randomUUID } from 'node:crypto';

export function createUser(overrides = {}) {
  const userId = randomUUID().slice(0, 8);

  return {
    name: `Test User ${userId}`,
    email: `test.${userId}@example.com`,
    accountType: 'premium',
    ...overrides,
  };
}

export function createTransaction(userId, overrides = {}) {
  return {
    userId,
    amount: 100.5,
    type: 'transfer',
    recipientId: '456',
    ...overrides,
  };
}