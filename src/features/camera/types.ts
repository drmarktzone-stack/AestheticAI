/** Capture stage for standardized medical photography */
export type CaptureStage = "before" | "after";

/** Ambient lighting classification */
export type LightingCondition =
  | "optimal"
  | "adequate"
  | "low"
  | "high_glare"
  | "unknown";

export interface HeadOrientation {
  /** degrees — nose up/down */
  pitch: number;
  /** degrees — head turn left/right */
  yaw: number;
  /** degrees — head tilt */
  roll: number;
}

export interface AlignmentMetrics extends HeadOrientation {
  /** 0–100 composite alignment score */
  score: number;
  pitchScore: number;
  yawScore: number;
  rollScore: number;
  /** Visual distance fit proxy (mesh guidance) 0–100 */
  distanceScore: number;
  isAligned: boolean;
}

export interface AestheticPhotoMetadata {
  id: string;
  uri: string;
  width: number;
  height: number;
  timestamp: string;
  stage: CaptureStage;
  orientation: HeadOrientation;
  alignmentScore: number;
  lighting: LightingCondition;
  /** URI of ghost reference used during capture, if any */
  ghostReferenceUri?: string;
  ghostModeEnabled: boolean;
  devicePlatform: string;
}

export interface MedicalCameraCaptureResult {
  photo: AestheticPhotoMetadata;
  localUri: string;
}

export interface MedicalAestheticCameraProps {
  stage: CaptureStage;
  ghostImageUri?: string | null;
  onCapture: (result: MedicalCameraCaptureResult) => void;
  onClose: () => void;
}

export const GHOST_OVERLAY_OPACITY = 0.3;

export const ALIGNMENT_THRESHOLDS = {
  pitch: { min: -12, max: 12 },
  yaw: { min: -10, max: 10 },
  roll: { min: -8, max: 8 },
  minimumScore: 82,
} as const;
