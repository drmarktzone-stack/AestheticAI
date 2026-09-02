import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from "@mediapipe/tasks-vision";

import type { Vec2 } from "./types";

const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";

function modelUrl(): string {
  return `${import.meta.env.BASE_URL}mediapipe/face_landmarker.task`;
}

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function getLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
      landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
      try {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelUrl(), delegate: "GPU" },
          runningMode: "IMAGE",
          numFaces: 1,
          minFaceDetectionConfidence: 0.4,
          minFacePresenceConfidence: 0.4,
        });
      } catch {
        return FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelUrl(), delegate: "CPU" },
          runningMode: "IMAGE",
          numFaces: 1,
          minFaceDetectionConfidence: 0.4,
          minFacePresenceConfidence: 0.4,
        });
      }
    })();
    landmarkerPromise.catch(() => {
      landmarkerPromise = null;
    });
  }
  return landmarkerPromise;
}

export async function detectFace(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap): Promise<Vec2[] | null> {
  const landmarker = await getLandmarker();
  const result: FaceLandmarkerResult = landmarker.detect(image);
  const face = result.faceLandmarks[0];
  if (!face || face.length < 400) return null;
  return face.map((p) => ({ x: p.x, y: p.y }));
}

export { FaceLandmarker };
