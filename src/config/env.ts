import Constants from "expo-constants";

export interface AppEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  storageBucket: string;
  isConfigured: boolean;
}

function readEnv(): AppEnv {
  const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;

  const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra?.supabaseUrl ?? "";
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra?.supabaseAnonKey ?? "";
  const storageBucket =
    process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET ??
    extra?.storageBucket ??
    "medical-images";

  return {
    supabaseUrl,
    supabaseAnonKey,
    storageBucket,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export const env = readEnv();
