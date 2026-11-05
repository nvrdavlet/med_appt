/*
 * StayHealthy backend – authentication API.
 * Pure Node.js (no npm packages needed). Users are stored in server/users.json
 * with scrypt-hashed passwords; a signed token is returned on register/login.
 *
 *   node server/index.js          → http://localhost:8181
 *
 * Endpoints:
 *   POST /api/auth/register  { role, name, email, phone, password }
 *   POST /api/auth/login     { email, password }
 *   GET  /api/auth/user      header: Authorization: Bearer <authtoken>
 *   PUT  /api/auth/user      header: Authorization: Bearer <authtoken>, body { name, phone }
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = process.env.PORT || 8181;
const SECRET = process.env.JWT_SECRET || 'stayhealthy-secret';
const DB_FILE = path.join(__dirname, 'users.json');

const readUsers = () => {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return []; }
};
const writeUsers = (users) => fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) =>
  `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
const checkPassword = (password, stored) => {
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, 'hex'));
};

// Minimal JWT (HS256)
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const sign = (payload) => {
  const body = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ ...payload, iat: Date.now() })}`;
  return `${body}.${crypto.createHmac('sha256', SECRET).update(body).digest('base64url')}`;
};
const verify = (token = '') => {
  const [h, p, s] = token.split('.');
  if (!s) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
  if (s !== expected) return null;
  return JSON.parse(Buffer.from(p, 'base64url').toString());
};

const send = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  });
  res.end(JSON.stringify(data));
};

const readBody = (req) => new Promise((resolve) => {
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve(null); } });
});

const validateRegister = ({ role, name, email, phone, password } = {}) => {
  const errors = [];
  if (!['patient', 'doctor'].includes(role)) errors.push('Role must be patient or doctor');
  if (!name || name.trim().length < 4) errors.push('Name must be at least 4 characters');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) errors.push('Invalid email');
  if (!/^\d{10}$/.test(phone || '')) errors.push('Phone must be 10 digits');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  return errors;
};

const publicUser = ({ password, ...u }) => u;

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = req.url.split('?')[0];

  if (req.method === 'GET' && url === '/') return send(res, 200, { message: 'StayHealthy API is running' });

  if (req.method === 'POST' && url === '/api/auth/register') {
    const body = await readBody(req);
    if (!body) return send(res, 400, { error: 'Invalid JSON' });
    const errors = validateRegister(body);
    if (errors.length) return send(res, 400, { error: errors });
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
      return send(res, 400, { error: 'A user with this email already exists' });
    }
    const user = {
      id: crypto.randomUUID(), role: body.role, name: body.name.trim(),
      email: body.email.toLowerCase(), phone: body.phone, password: hashPassword(body.password),
    };
    writeUsers([...users, user]);
    return send(res, 201, { authtoken: sign({ id: user.id, email: user.email }), user: publicUser(user) });
  }

  if (req.method === 'POST' && url === '/api/auth/login') {
    const body = await readBody(req);
    if (!body || !body.email || !body.password) return send(res, 400, { error: 'Email and password are required' });
    const user = readUsers().find((u) => u.email === body.email.toLowerCase());
    if (!user || !checkPassword(body.password, user.password)) {
      return send(res, 400, { error: 'Invalid credentials' });
    }
    return send(res, 200, { authtoken: sign({ id: user.id, email: user.email }), user: publicUser(user) });
  }

  if (url === '/api/auth/user' && (req.method === 'GET' || req.method === 'PUT')) {
    const payload = verify((req.headers.authorization || '').replace('Bearer ', ''));
    if (!payload) return send(res, 401, { error: 'Invalid or missing token' });
    const users = readUsers();
    const user = users.find((u) => u.id === payload.id);
    if (!user) return send(res, 404, { error: 'User not found' });
    if (req.method === 'GET') return send(res, 200, publicUser(user));
    const body = (await readBody(req)) || {};
    if (body.name) user.name = body.name.trim();
    if (body.phone) user.phone = body.phone;
    writeUsers(users);
    return send(res, 200, publicUser(user));
  }

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => console.log(`StayHealthy API running on http://localhost:${PORT}`));
