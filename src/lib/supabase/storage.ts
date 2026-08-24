import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

import { env } from "@/config/env";
import { getSupabaseClientOrNull } from "@/lib/supabase/client";

export interface UploadMedicalImageInput {
  localUri: string;
  patientId: string;
  fileName: string;
  contentType?: string;
}

export interface UploadMedicalImageResult {
  path: string;
  signedUrl: string | null;
  error: string | null;
}

/**
 * Uploads to a private Supabase Storage bucket.
 * Server-side encryption at rest is provided by Supabase (S3/GCP backing).
 * Enable RLS policies on `medical-images` bucket — see README.
 */
export async function uploadMedicalImage(
  input: UploadMedicalImageInput,
): Promise<UploadMedicalImageResult> {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) {
    return { path: "", signedUrl: null, error: "Supabase not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { path: "", signedUrl: null, error: "Unauthorized" };
  }

  const objectPath = `${user.id}/${input.patientId}/${input.fileName}`;

  try {
    const base64 = await FileSystem.readAsStringAsync(input.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { error: uploadError } = await supabase.storage
      .from(env.storageBucket)
      .upload(objectPath, decode(base64), {
        contentType: input.contentType ?? "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return { path: "", signedUrl: null, error: uploadError.message };
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(env.storageBucket)
      .createSignedUrl(objectPath, 3600);

    if (signError) {
      return { path: objectPath, signedUrl: null, error: signError.message };
    }

    return { path: objectPath, signedUrl: signed.signedUrl, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return { path: "", signedUrl: null, error: message };
  }
}

export async function getSignedMedicalImageUrl(
  objectPath: string,
  expiresInSeconds = 3600,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) return { url: null, error: "Supabase not configured" };

  const { data, error } = await supabase.storage
    .from(env.storageBucket)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error) return { url: null, error: error.message };
  return { url: data.signedUrl, error: null };
}
