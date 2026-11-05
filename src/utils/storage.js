// Small wrappers so a blocked/empty storage never crashes the app.
export function readJSON(store, key, fallback) {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
