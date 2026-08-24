import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { getCurrentSession, onAuthStateChange } from "@/lib/supabase/auth";
import { env } from "@/config/env";

interface AuthContextValue {
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!env.isConfigured) {
      setIsLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    void (async () => {
      const current = await getCurrentSession();
      setSession(current);
      setIsLoading(false);
      unsubscribe = onAuthStateChange(setSession);
    })();

    return () => unsubscribe?.();
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, isConfigured: env.isConfigured }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
