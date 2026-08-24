import { useEffect, useRef, useState } from "react";
import { DeviceMotion } from "expo-sensors";

import type { AlignmentMetrics } from "@/features/camera/types";
import { computeAlignment, radiansToDegrees } from "@/features/camera/utils/alignment";

const MOTION_INTERVAL_MS = 16; // ~60Hz sensor sampling

export function useHeadAlignment(enabled: boolean) {
  const [alignment, setAlignment] = useState<AlignmentMetrics>(() =>
    computeAlignment({ pitch: 0, yaw: 0, roll: 0 }),
  );
  const lastEmit = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    DeviceMotion.setUpdateInterval(MOTION_INTERVAL_MS);
    const subscription = DeviceMotion.addListener((data) => {
      const now = Date.now();
      if (now - lastEmit.current < MOTION_INTERVAL_MS) return;
      lastEmit.current = now;

      const rotation = data.rotation;
      if (!rotation) return;

      const pitch = radiansToDegrees(rotation.beta ?? 0);
      const roll = radiansToDegrees(rotation.gamma ?? 0);
      const yaw = radiansToDegrees(rotation.alpha ?? 0);

      setAlignment(computeAlignment({ pitch, yaw, roll }));
    });

    return () => subscription.remove();
  }, [enabled]);

  return alignment;
}
