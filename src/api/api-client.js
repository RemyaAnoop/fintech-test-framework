import { environment } from '../test-config/environment-configuration.js';
import { authHeaders } from '../utils/api-helpers.js';
import { apiRoutes } from './api-routes.js';

export class ApiClient {
  constructor(request) {
    this.request = request;
  }

  createUser(payload, token = environment.authToken) {
    return this.request.post(`${environment.apiBaseUrl}${apiRoutes.users}`, {
      data: payload,
      headers: authHeaders(token),
    });
  }

  getUser(id, token = environment.authToken) {
    return this.request.get(`${environment.apiBaseUrl}${apiRoutes.user(id)}`, {
      headers: authHeaders(token),
    });
  }

  createTransaction(payload, token = environment.authToken) {
    return this.request.post(`${environment.apiBaseUrl}${apiRoutes.transactions}`, {
      data: payload,
      headers: authHeaders(token),
    });
  }

  getTransactions(userId, token = environment.authToken) {
    return this.request.get(`${environment.apiBaseUrl}${apiRoutes.userTransactions(userId)}`, {
      headers: authHeaders(token),
    });
  }
}
