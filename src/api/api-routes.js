export const apiRoutes = {
  users: '/users',
  user: (id) => `/users/${encodeURIComponent(id)}`,
  transactions: '/transactions',
  userTransactions: (userId) => `/transactions/${encodeURIComponent(userId)}`,
};
