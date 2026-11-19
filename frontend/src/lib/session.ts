export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  user: AuthUser;
};

const STORAGE_KEY = "duolink.session";

let cached: AuthSession | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function readSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (loaded) {
    return cached;
  }
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    cached = null;
  }
  return cached;
}

export function getSession(): AuthSession | null {
  return readSession();
}

export function getServerSession(): AuthSession | null {
  return null;
}

export function setSession(session: AuthSession | null): void {
  cached = session;
  loaded = true;
  if (typeof window !== "undefined") {
    try {
      if (session) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable (private mode); keep the in-memory session.
    }
  }
  emit();
}

export function clearSession(): void {
  setSession(null);
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      loaded = false;
      emit();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function isSessionExpired(
  session: AuthSession,
  skewSeconds = 30,
): boolean {
  return session.expires_at - skewSeconds <= Math.floor(Date.now() / 1000);
}
