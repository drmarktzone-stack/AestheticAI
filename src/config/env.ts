import Constants from "expo-constants";

export interface AppEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  storageBucket: string;
  faceAnalysisUrl: string;
  faceAnalysisApiKey: string;
  timelineSimulatorUrl: string;
  timelineSimulatorApiKey: string;
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
  const faceAnalysisUrl =
    process.env.EXPO_PUBLIC_FACE_ANALYSIS_URL ?? extra?.faceAnalysisUrl ?? "";
  const faceAnalysisApiKey =
    process.env.EXPO_PUBLIC_FACE_ANALYSIS_API_KEY ?? extra?.faceAnalysisApiKey ?? "";
  const timelineSimulatorUrl =
    process.env.EXPO_PUBLIC_TIMELINE_SIMULATOR_URL ?? extra?.timelineSimulatorUrl ?? "";
  const timelineSimulatorApiKey =
    process.env.EXPO_PUBLIC_TIMELINE_SIMULATOR_API_KEY ??
    extra?.timelineSimulatorApiKey ??
    "";

  return {
    supabaseUrl,
    supabaseAnonKey,
    storageBucket,
    faceAnalysisUrl,
    faceAnalysisApiKey,
    timelineSimulatorUrl,
    timelineSimulatorApiKey,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export const env = readEnv();
