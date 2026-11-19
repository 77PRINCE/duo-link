"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  logoutAccount,
  loginAccount,
  registerAccount,
  type RegisterResult,
} from "@/lib/api";
import {
  getServerSession,
  getSession,
  setSession,
  subscribeSession,
  type AuthSession,
  type AuthUser,
} from "@/lib/session";

const emptySubscribe = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

type AuthContextValue = {
  user: AuthUser | null;
  session: AuthSession | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<RegisterResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedSession = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession,
  );
  const ready = useHydrated();
  const router = useRouter();

  // `useSyncExternalStore` serves the server snapshot (null) during hydration
  // and only swaps in the stored value on the following render. Read storage
  // synchronously once hydration is complete so consumers never briefly see a
  // signed-in user as signed-out (which would bounce them to /login).
  const session = ready && storedSession === null ? getSession() : storedSession;

  const login = useCallback(async (email: string, password: string) => {
    const next = await loginAccount(email, password);
    setSession(next);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      const result = await registerAccount(email, password, name);
      if (result.session) {
        setSession(result.session);
      }
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutAccount();
    setSession(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      ready,
      login,
      register,
      logout,
    }),
    [session, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
