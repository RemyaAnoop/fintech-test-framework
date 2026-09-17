import { expect } from '@playwright/test';
import { environment } from '../test-config/environment-configuration.js';

export function authHeaders(token = environment.authToken) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function expectApiError(response, status, message, label = 'API error') {
  expect(response.status()).toBe(status);
  const body = await response.json();
  console.log(`[API] ${label} ${response.status()} ${JSON.stringify(body)}`);
  expect(body).toMatchObject({ error: message });
  return body;
}

export async function logApiResponse(response, label) {
  const body = await response.text();
  console.log(`[API] ${label} ${response.status()} ${body}`);
  return body ? JSON.parse(body) : undefined;
}
