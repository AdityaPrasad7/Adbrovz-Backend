// In-memory cache fallback to avoid Redis dependency for now.
// Simple TTL support via expiresAt timestamp.
const store = new Map();

const now = () => Date.now();

const cleanupExpired = (key) => {
  if (!store.has(key)) return;
  const entry = store.get(key);
  if (entry.expiresAt && entry.expiresAt < now()) {
    store.delete(key);
  }
};

const set = async (key, value, expirySeconds = null) => {
  const expiresAt = expirySeconds ? now() + expirySeconds * 1000 : null;
  store.set(key, { value, expiresAt });
  return true;
};

const get = async (key) => {
  cleanupExpired(key);
  const entry = store.get(key);
  return entry ? entry.value : null;
};

const del = async (key) => {
  return store.delete(key);
};

const exists = async (key) => {
  cleanupExpired(key);
  return store.has(key);
};

const expire = async (key, seconds) => {
  if (!store.has(key)) return false;
  const entry = store.get(key);
  entry.expiresAt = now() + seconds * 1000;
  store.set(key, entry);
  return true;
};

// For compatibility
const getRedisClient = () => null;

module.exports = {
  set,
  get,
  del,
  exists,
  expire,
  getRedisClient,
};

