import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { useAuth } from "@/providers/AuthProvider";

const DEMO_PATIENT_KEY = "protokol.demo_patient_id";

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Resolves patient identity from auth session or a device-bound demo UUID. */
export function usePatientIdentity(): { patientId: string | null; loading: boolean } {
  const { session, isLoading } = useAuth();
  const [demoId, setDemoId] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(true);

  useEffect(() => {
    if (session?.user.id) {
      setDemoLoading(false);
      return;
    }

    void SecureStore.getItemAsync(DEMO_PATIENT_KEY).then(async (stored) => {
      if (stored) {
        setDemoId(stored);
        setDemoLoading(false);
        return;
      }
      const id = generateUuid();
      await SecureStore.setItemAsync(DEMO_PATIENT_KEY, id);
      setDemoId(id);
      setDemoLoading(false);
    });
  }, [session?.user.id]);

  if (isLoading || demoLoading) {
    return { patientId: null, loading: true };
  }

  return { patientId: session?.user.id ?? demoId, loading: false };
}
