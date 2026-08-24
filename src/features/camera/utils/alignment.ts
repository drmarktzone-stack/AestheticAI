import type { AlignmentMetrics, HeadOrientation, LightingCondition } from "@/features/camera/types";
import { ALIGNMENT_THRESHOLDS } from "@/features/camera/types";

function scoreInRange(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 100;
  const distance = value < min ? min - value : value - max;
  return Math.max(0, 100 - distance * 8);
}

export function computeAlignment(orientation: HeadOrientation): AlignmentMetrics {
  const pitchScore = scoreInRange(
    orientation.pitch,
    ALIGNMENT_THRESHOLDS.pitch.min,
    ALIGNMENT_THRESHOLDS.pitch.max,
  );
  const yawScore = scoreInRange(
    orientation.yaw,
    ALIGNMENT_THRESHOLDS.yaw.min,
    ALIGNMENT_THRESHOLDS.yaw.max,
  );
  const rollScore = scoreInRange(
    orientation.roll,
    ALIGNMENT_THRESHOLDS.roll.min,
    ALIGNMENT_THRESHOLDS.roll.max,
  );

  const score = Math.round((pitchScore + yawScore + rollScore) / 3);
  const distanceScore = Math.round(score * 0.92 + 8);

  return {
    ...orientation,
    pitchScore: Math.round(pitchScore),
    yawScore: Math.round(yawScore),
    rollScore: Math.round(rollScore),
    score,
    distanceScore: Math.min(100, distanceScore),
    isAligned: score >= ALIGNMENT_THRESHOLDS.minimumScore,
  };
}

export function inferLightingFromExif(exif: Record<string, unknown> | undefined): LightingCondition {
  if (!exif) return "unknown";

  const brightness = exif.BrightnessValue ?? exif.brightness;
  if (typeof brightness === "number") {
    if (brightness < 2) return "low";
    if (brightness > 10) return "high_glare";
    if (brightness >= 4 && brightness <= 8) return "optimal";
    return "adequate";
  }

  return "unknown";
}

export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}
