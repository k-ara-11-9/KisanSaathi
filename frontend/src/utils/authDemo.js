const STORAGE_KEY = 'kissanconnect-demo-users';
const SESSION_KEY = 'kissanconnect-session-user';

export const DEFAULT_DEMO_USER = {
  name: 'Ramesh Kumar',
  mobile: '9876543210',
  password: 'kissanconnect123',
  block: 'Block A101',
};

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return null;
}

export function readStoredUsers() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUser(user) {
  const storage = getStorage();
  const users = readStoredUsers();
  const normalizedUser = {
    ...DEFAULT_DEMO_USER,
    ...user,
    name: (user?.name || '').trim(),
    mobile: (user?.mobile || '').trim(),
  };

  const existingIndex = users.findIndex((entry) => {
    const sameName = (entry.name || '').trim().toLowerCase() === normalizedUser.name.toLowerCase();
    const sameMobile = (entry.mobile || '').trim() === normalizedUser.mobile;
    return sameName || sameMobile;
  });

  const nextUsers = existingIndex >= 0
    ? users.map((entry, index) => (index === existingIndex ? normalizedUser : entry))
    : [...users, normalizedUser];

  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(nextUsers));
  }

  return normalizedUser;
}

export function authenticateUser({ nameOrMobile, password }) {
  const normalizedInput = (nameOrMobile || '').trim();
  if (!normalizedInput || !password) return null;

  const users = readStoredUsers();
  const candidate = users.find((user) => {
    const name = (user.name || '').trim().toLowerCase();
    const mobile = (user.mobile || '').trim();
    const input = normalizedInput.toLowerCase();
    return name === input || mobile === normalizedInput || mobile === normalizedInput.replace(/\D/g, '');
  }) || DEFAULT_DEMO_USER;

  if (candidate.password && candidate.password === password) {
    return {
      name: candidate.name,
      mobile: candidate.mobile,
      block: candidate.block || 'Unassigned',
    };
  }

  return null;
}

export function readSessionUser() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const saved = storage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveSessionUser(user) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSessionUser() {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(SESSION_KEY);
}
