/**
 * Normalized frontal face landmark template (0–1 viewport).
 * Derived from MediaPipe Face Mesh topology — aesthetic photography subset.
 * Used for SVG overlay guidance (not live ML inference in this module).
 */
export interface FaceLandmark {
  id: string;
  x: number;
  y: number;
  /** MediaPipe index reference when applicable */
  mpIndex?: number;
}

export const FACE_OVAL_LANDMARKS: FaceLandmark[] = [
  { id: "forehead_center", x: 0.5, y: 0.18, mpIndex: 10 },
  { id: "temple_l", x: 0.22, y: 0.32, mpIndex: 234 },
  { id: "cheek_l", x: 0.28, y: 0.48, mpIndex: 132 },
  { id: "jaw_l", x: 0.32, y: 0.68, mpIndex: 172 },
  { id: "chin", x: 0.5, y: 0.78, mpIndex: 152 },
  { id: "jaw_r", x: 0.68, y: 0.68, mpIndex: 397 },
  { id: "cheek_r", x: 0.72, y: 0.48, mpIndex: 361 },
  { id: "temple_r", x: 0.78, y: 0.32, mpIndex: 454 },
];

export const FEATURE_LANDMARKS: FaceLandmark[] = [
  { id: "eye_l_outer", x: 0.36, y: 0.36, mpIndex: 33 },
  { id: "eye_l_inner", x: 0.44, y: 0.36, mpIndex: 133 },
  { id: "eye_r_inner", x: 0.56, y: 0.36, mpIndex: 362 },
  { id: "eye_r_outer", x: 0.64, y: 0.36, mpIndex: 263 },
  { id: "nose_bridge", x: 0.5, y: 0.4, mpIndex: 6 },
  { id: "nose_tip", x: 0.5, y: 0.48, mpIndex: 1 },
  { id: "mouth_l", x: 0.42, y: 0.6, mpIndex: 61 },
  { id: "mouth_center", x: 0.5, y: 0.62, mpIndex: 13 },
  { id: "mouth_r", x: 0.58, y: 0.6, mpIndex: 291 },
];

export const FACE_MESH_LANDMARKS: FaceLandmark[] = [
  ...FACE_OVAL_LANDMARKS,
  ...FEATURE_LANDMARKS,
];

/** Mesh edges for SVG polyline rendering */
export const FACE_MESH_EDGES: ReadonlyArray<readonly [string, string]> = [
  ["forehead_center", "temple_l"],
  ["temple_l", "cheek_l"],
  ["cheek_l", "jaw_l"],
  ["jaw_l", "chin"],
  ["chin", "jaw_r"],
  ["jaw_r", "cheek_r"],
  ["cheek_r", "temple_r"],
  ["temple_r", "forehead_center"],
  ["eye_l_outer", "eye_l_inner"],
  ["eye_l_inner", "eye_r_inner"],
  ["eye_r_inner", "eye_r_outer"],
  ["nose_bridge", "nose_tip"],
  ["mouth_l", "mouth_center"],
  ["mouth_center", "mouth_r"],
  ["forehead_center", "nose_bridge"],
  ["nose_tip", "mouth_center"],
  ["eye_l_inner", "nose_bridge"],
  ["eye_r_inner", "nose_bridge"],
] as const;

export function landmarkById(id: string): FaceLandmark | undefined {
  return FACE_MESH_LANDMARKS.find((l) => l.id === id);
}

export function toSvgPoint(landmark: FaceLandmark, width: number, height: number) {
  return { x: landmark.x * width, y: landmark.y * height };
}
