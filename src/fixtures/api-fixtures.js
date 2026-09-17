import { test as base } from '@playwright/test';
import { ApiClient } from '../api/api-client.js';

export const test = base.extend({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});
