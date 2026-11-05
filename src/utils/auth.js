import { readJSON, writeJSON } from './storage';

/*
 * Authentication.
 * Registered users are kept in localStorage ("users"); the active session
 * lives in sessionStorage (auth-token, name, email, phone), the same keys the
 * course backend uses. If you run the optional Express/MongoDB server, point
 * API_URL at it and these functions can be swapped for fetch() calls.
 */
export const API_URL = 'http://localhost:8181';

const USERS_KEY = 'users';
export const AUTH_EVENT = 'auth-changed';

const notify = () => window.dispatchEvent(new Event(AUTH_EVENT));
const getUsers = () => readJSON(localStorage, USERS_KEY, []);
const saveUsers = (users) => writeJSON(localStorage, USERS_KEY, users);

function startSession(user, token = `local-${Date.now()}`) {
  sessionStorage.setItem('auth-token', token);
  sessionStorage.setItem('name', user.name);
  sessionStorage.setItem('email', user.email);
  sessionStorage.setItem('phone', user.phone);
  sessionStorage.setItem('role', user.role);
  notify();
}

export function getCurrentUser() {
  if (!sessionStorage.getItem('auth-token')) return null;
  return {
    name: sessionStorage.getItem('name') || '',
    email: sessionStorage.getItem('email') || '',
    phone: sessionStorage.getItem('phone') || '',
    role: sessionStorage.getItem('role') || 'patient',
  };
}

// Calls the backend API. Returns null when the server is unreachable
// (e.g. on the static deployed site) so we can fall back to local storage.
async function callApi(endpoint, body) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      const error = Array.isArray(json.error) ? json.error.join(', ') : json.error;
      return { ok: false, error: error || 'Request failed.' };
    }
    startSession(json.user, json.authtoken);
    return { ok: true };
  } catch {
    return null; // network error → server not running
  }
}

// Register a new user through POST /api/auth/register
export async function registerUser(data) {
  return (await callApi('/api/auth/register', data)) ?? signUp(data);
}

// Authenticate through POST /api/auth/login
export async function loginUser(data) {
  return (await callApi('/api/auth/login', data)) ?? login(data);
}

export function signUp({ role, name, phone, email, password }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'A user with this email already exists.' };
  }
  const user = { role, name, phone, email, password };
  saveUsers([...users, user]);
  startSession(user);
  return { ok: true };
}

export function login({ email, password }) {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  startSession(user);
  return { ok: true };
}

export function logout() {
  ['auth-token', 'name', 'email', 'phone', 'role'].forEach((k) => sessionStorage.removeItem(k));
  notify();
}

export function updateProfile({ name, phone }) {
  const email = sessionStorage.getItem('email');
  const users = getUsers().map((u) => (u.email === email ? { ...u, name, phone } : u));
  saveUsers(users);
  sessionStorage.setItem('name', name);
  sessionStorage.setItem('phone', phone);
  notify();
}
