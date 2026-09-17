import http from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.PORT || 3000);
const token = 'test-token';
const users = new Map();
const transactions = [];

function json(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(data === undefined ? '' : JSON.stringify(data));
}
function authorized(request) { return request.headers.authorization === `Bearer ${token}`; }
function readBody(request) {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => { data += chunk; });
    request.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (error) { reject(error); } });
    request.on('error', reject);
  });
}
function validUser(value) { return value.name?.trim() && /^[^@]+@[^@]+\.[^@]+$/.test(value.email || '') && ['standard', 'premium'].includes(value.accountType); }
function validTransaction(value) { return value.userId && users.has(value.userId) && Number(value.amount) > 0 && ['transfer', 'payment'].includes(value.type) && value.recipientId; }

function page(isTransactions = false) {
  const form = isTransactions
    ? `<h2>Create transaction</h2><form id="transaction-form"><label>User ID<input id="userId" aria-label="User ID" required></label><label>Recipient ID<input id="recipientId" aria-label="Recipient ID" required></label><label>Transaction type<select id="type" aria-label="Transaction type"><option value="transfer">Transfer</option><option value="payment">Payment</option></select></label><label>Amount<input id="amount" aria-label="Amount" type="number" step="0.01" required></label><button>Create transaction</button></form>`
    : `<h2>Register user</h2><form id="registration-form"><label>Name<input id="name" aria-label="Name" required></label><label>Email<input id="email" aria-label="Email" required></label><label>Account type<select id="accountType" aria-label="Account type"><option value="standard">Standard</option><option value="premium">Premium</option></select></label><button>Register</button></form>`;
  const data = isTransactions
    ? `{userId:document.getElementById('userId').value,recipientId:document.getElementById('recipientId').value,type:document.getElementById('type').value,amount:Number(document.getElementById('amount').value)}`
    : `{name:document.getElementById('name').value,email:document.getElementById('email').value,accountType:document.getElementById('accountType').value}`;
  const endpoint = isTransactions ? 'transactions' : 'users';
  return `<!doctype html><html><head><title>Fintech Portal</title></head><body><h1>Fintech Portal</h1>${form}<p role="status" id="message"></p><script>const form=document.querySelector('form');form.addEventListener('submit',async e=>{e.preventDefault();const data=${data};const r=await fetch('/api/${endpoint}',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer ${token}'},body:JSON.stringify(data)});const b=await r.json();document.getElementById('message').textContent=r.ok?'${isTransactions ? 'Transaction' : 'User'} ${isTransactions ? 'created' : 'registered'} successfully':b.error;document.getElementById('message').className=r.ok?'success':'error';});</script></body></html>`;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'GET' && url.pathname === '/') {
    const registrationPage = page()
      .replace('<p role="status" id="message"></p>', '<p role="alert" id="message"></p><p data-testid="user-id"></p>')
      .replace('User registered successfully', 'User created successfully')
      .replace('</script>', "const message = document.getElementById('message'); const userId = document.querySelector('[data-testid=\"user-id\"]'); new MutationObserver(() => { if (message.className === 'success') userId.textContent = 'created'; }).observe(message, { childList: true });</script>");
    response.end(registrationPage);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/transactions') { response.end(page(true)); return; }
  if (!url.pathname.startsWith('/api/')) { json(response, 404, { error: 'Not found' }); return; }
  if (!authorized(request)) { json(response, 401, { error: 'Unauthorized' }); return; }
  try {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[1] === 'users') {
      const id = parts[2];
      if (request.method === 'POST') { const value = await readBody(request); if (!validUser(value)) return json(response, 400, { error: 'Invalid user data' }); const user = { id: randomUUID(), ...value }; users.set(user.id, user); return json(response, 201, user); }
      if (!users.has(id)) return json(response, 404, { error: 'User not found' });
      if (request.method === 'GET') return json(response, 200, users.get(id));
    }
    if (parts[1] === 'transactions') {
      if (request.method === 'POST') { const value = await readBody(request); if (!validTransaction(value)) return json(response, 400, { error: 'Invalid transaction data' }); const transaction = { id: randomUUID(), ...value }; transactions.push(transaction); return json(response, 201, transaction); }
      if (request.method === 'GET') return json(response, 200, transactions.filter(item => item.userId === parts[2]));
    }
    return json(response, 404, { error: 'Not found' });
  } catch (error) { return json(response, 400, { error: 'Invalid JSON' }); }
});
server.listen(port, '127.0.0.1', () => console.log(`Mock fintech server listening on http://127.0.0.1:${port}`));
