import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";

const SECURESTORE_LIMIT = 2048;

/**
 * Hybrid storage: tokens in SecureStore when small enough, AsyncStorage fallback.
 * Supabase session JSON can exceed SecureStore limits on some Android builds.
 */
const supabaseStorage = {
  async getItem(key: string): Promise<string | null> {
    const secure = await SecureStore.getItemAsync(key);
    if (secure) return secure;
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (value.length <= SECURESTORE_LIMIT) {
      await SecureStore.setItemAsync(key, value);
      await AsyncStorage.removeItem(key);
      return;
    }
    await AsyncStorage.setItem(key, value);
    await SecureStore.deleteItemAsync(key).catch(() => undefined);
  },
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key).catch(() => undefined);
    await AsyncStorage.removeItem(key);
  },
};

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  if (!env.isConfigured) {
    throw new Error(
      "Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: supabaseStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return client;
}

/** Safe accessor when Supabase env vars are not yet set (dev bootstrap). */
export function getSupabaseClientOrNull(): SupabaseClient | null {
  if (!env.isConfigured) return null;
  return getSupabaseClient();
}
