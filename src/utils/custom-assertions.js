import { expect } from '@playwright/test';

export function expectIsoDate(value) {
  expect(Number.isNaN(Date.parse(value))).toBeFalsy();
}

export function expectPositiveAmount(amount) {
  expect(amount).toBeGreaterThan(0);
}

export function expectRequiredFields(body, fields) {
  for (const field of fields) {
    expect(body).toHaveProperty(field);
  }
}

export function expectUserContract(user) {
  expect(user).toEqual(expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    email: expect.stringMatching(/^[^@]+@[^@]+\.[^@]+$/),
    accountType: expect.stringMatching(/^(standard|premium)$/),
  }));
}

export function expectTransactionContract(transaction) {
  expect(transaction).toEqual(expect.objectContaining({
    id: expect.any(String),
    userId: expect.any(String),
    amount: expect.any(Number),
    type: expect.any(String),
    recipientId: expect.any(String),
  }));
}
