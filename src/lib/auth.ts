import { DIRECTUS_URL } from "./directus";

const STORAGE_KEY = "almajnouni_auth";

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
}

interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
  user: AuthUser;
}

export function getSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUser | null {
  return getSession()?.user ?? null;
}

export function isAuthenticated(): boolean {
  const s = getSession();
  if (!s) return false;
  return s.expires_at > Date.now();
}

function persist(session: StoredSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth-changed"));
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.errors?.[0]?.message ?? "بيانات الدخول غير صحيحة");
  }
  const { data } = await res.json();

  // Fetch user profile
  const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email,first_name,last_name,role.name`, {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  const meJson = await meRes.json();
  const me = meJson.data;
  const user: AuthUser = {
    id: me.id,
    email: me.email,
    first_name: me.first_name,
    last_name: me.last_name,
    role: me.role?.name ?? null,
  };

  persist({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires ?? 900_000),
    user,
  });
  return user;
}

export async function logout(): Promise<void> {
  const s = getSession();
  if (s?.refresh_token) {
    try {
      await fetch(`${DIRECTUS_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: s.refresh_token }),
      });
    } catch {
      /* ignore */
    }
  }
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}
