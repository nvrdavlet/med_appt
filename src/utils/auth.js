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

function startSession(user) {
  sessionStorage.setItem('auth-token', `token-${Date.now()}`);
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
