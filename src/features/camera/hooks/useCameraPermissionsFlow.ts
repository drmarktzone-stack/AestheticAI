import { useCallback, useEffect, useState } from "react";
import { useCameraPermissions } from "expo-camera";

export function useCameraPermissionsFlow() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);

  const ensurePermission = useCallback(async () => {
    if (permission?.granted) return true;
    const result = await requestPermission();
    return result.granted;
  }, [permission?.granted, requestPermission]);

  const markReady = useCallback(() => setIsReady(true), []);

  useEffect(() => {
    if (!permission?.granted) {
      setIsReady(false);
    }
  }, [permission?.granted]);

  return {
    permission,
    isReady,
    ensurePermission,
    markReady,
  };
}
