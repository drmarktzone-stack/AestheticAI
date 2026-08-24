import type { AuthError, Session, User } from "@supabase/supabase-js";

import { getSupabaseClientOrNull } from "@/lib/supabase/client";

export interface SignInResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<SignInResult> {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) {
    return {
      user: null,
      session: null,
      error: { name: "AuthError", message: "Supabase not configured" } as AuthError,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, session: data.session, error };
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
): (() => void) | null {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) return null;

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => data.subscription.unsubscribe();
}
