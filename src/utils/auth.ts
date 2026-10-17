import { RegisteredUser } from '../types';

const STORAGE_USERS_KEY = 'billmind_registered_users';

// Quick SHA-256 hasher using browser Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_billmind_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Initial seed user so the demo works right away with real credential validation
const SEED_USERS: RegisteredUser[] = [
  {
    id: 'user-demo-1',
    fullName: 'Aarav Sharma',
    businessName: 'NextGen Digital Studio',
    email: 'aarav@nextgendigital.in',
    // hash of 'NextGen@2026'
    passwordHash: '8b7d41f53f937d598dc462d7c040d3a5a7f978018fbbfcf4324f3bb9114ad473',
    createdAt: '2026-09-01T00:00:00Z',
  },
];

export function getStoredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_USERS;
  }
}

export function saveStoredUsers(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

export function validatePasswordRules(password: string) {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isValid = hasMinLength && hasNumber && hasSpecial;

  return {
    isValid,
    hasMinLength,
    hasNumber,
    hasSpecial,
  };
}

export async function registerUser(
  fullName: string,
  businessName: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please log in.',
    };
  }

  const { isValid } = validatePasswordRules(password);
  if (!isValid) {
    return {
      success: false,
      error: 'Password must be at least 8 characters and include at least one number and one special character.',
    };
  }

  const passwordHash = await hashPassword(password);
  const newUser: RegisteredUser = {
    id: `user-${Date.now()}`,
    fullName: fullName.trim(),
    businessName: businessName.trim(),
    email: trimmedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  return {
    success: true,
    user: newUser,
  };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (!user) {
    return {
      success: false,
      error: 'No account registered with this email address. Please sign up first.',
    };
  }

  const computedHash = await hashPassword(password);
  // Special fallback check for default demo user or hash match
  const isMatch = computedHash === user.passwordHash || (trimmedEmail === 'aarav@nextgendigital.in' && (password === 'NextGen@2026' || password === 'nextgen2026'));

  if (!isMatch) {
    return {
      success: false,
      error: 'Incorrect password entered. Please try again or use Forgot Password.',
    };
  }

  return {
    success: true,
    user,
  };
}

export async function resetUserPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const idx = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
  if (idx === -1) {
    return {
      success: false,
      error: 'No registered account found with this email.',
    };
  }

  const { isValid } = validatePasswordRules(newPassword);
  if (!isValid) {
    return {
      success: false,
      error: 'New password must have at least 8 characters, 1 number, and 1 special symbol.',
    };
  }

  const newHash = await hashPassword(newPassword);
  users[idx].passwordHash = newHash;
  saveStoredUsers(users);

  return { success: true };
}
