# AestheticAI

Clinical mentor for licensed aesthetic physicians. Brand name: **AestheticAI**. One Vite app, three spaces:

1. **Simulator (home)** — upload or capture a real face photo. MediaPipe Face Landmarker snaps it into the engine frame, then auto-scans wrinkles, folds, volume loss and hypertrophy. Three panels: **סריקה** (marked findings), **מפת הזרקה** (catalog injection points, material, typical educational dose, plane), **אחרי** (identity-preserving after of this patient). Hebrew plan table with finding toggles. Labelled **הדמיה / דמו** — not a promised result.
2. **Atlas** — one region in depth: anatomical layers, typical educational dose, ACE path.
3. **Emergency** — ACE vascular ischemia pathway.

Protocols live inside the same app as a clinical journey step. They are not a separate product.

Hebrew is the default language. Arabic and English are first-class. RTL layout flips for Hebrew and Arabic.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173). No API keys are required. Face alignment uses a self-hosted MediaPipe model plus WASM from jsDelivr. Without Vertex, the client degrades to on-device MediaPipe overlays, catalog doses (`buildDosePlan` / `treatmentCatalog`), and the local warp (`renderAfter` / `generateAfterPreview`).

```bash
npm run build
npm start
```

`npm start` runs `scripts/server.mjs`: static `dist/` plus `POST /api/analyze`, `POST /api/simulate`, `GET /api/health`. Default port `8080` (`PORT` overrides). Patient photos are processed in memory and are not written to disk, GCS, or logs.

For a Pages-shaped build:

```bash
GITHUB_PAGES=1 npm run build
GITHUB_PAGES=1 npm run preview
```

Preview is then at http://localhost:4173/AestheticAI/

## Cloud Run

Live target: `https://aestheticai-308665814452.me-west1.run.app` (GCP project `project-8fd8a005-ae6d-4139-ab4`, region `me-west1`).

Dockerfile at repo root (`/Dockerfile`): Node 22 build, then production `npm ci --omit=dev` (includes `@google/genai`) and `node scripts/server.mjs` on `0.0.0.0:$PORT` (default 8080). No API keys are baked into the image. GitHub Pages stays on the existing workflow (`GITHUB_PAGES=1`).

Cloud Run does **not** auto-inject `GOOGLE_CLOUD_PROJECT`. It only sets `PORT`, `K_SERVICE`, `K_REVISION`, and `K_CONFIGURATION`. Set both of these on the service (belt-and-suspenders):

- `GOOGLE_CLOUD_LOCATION=global` (Vertex Gemini via the global endpoint)
- `GOOGLE_CLOUD_PROJECT` (your GCP project id)

If those are missing, the server also reads `GCLOUD_PROJECT` / `GCP_PROJECT`, then fetches the project id once from the metadata server (`GET http://metadata.google.internal/computeMetadata/v1/project/project-id` with `Metadata-Flavor: Google`, ~1s timeout) and caches it. The project id is never baked into the image.

Also:

- Enable `aiplatform.googleapis.com`
- Grant the Cloud Run runtime service account `roles/aiplatform.user`

Vertex uses Application Default Credentials. Do not set `GEMINI_API_KEY` or bake secrets into git or the image.

```bash
docker build -t aestheticai .
docker run --rm -p 8080:8080 -e PORT=8080 aestheticai
```

`GET /api/health` returns `{ ok, vertex }`. If Vertex is down, `/api/analyze` returns `503 VERTEX_UNAVAILABLE` and the client still draws MediaPipe overlays and catalog doses. If the image model blocks photoreal faces, `/api/simulate` returns `422 FACE_EDIT_BLOCKED` and panel 3 falls back to the local warp — it is never left empty.

## Public preview

GitHub Pages (after the workflow publishes `dist/`):

**https://drmarktzone-stack.github.io/AestheticAI/**

The app uses hash routes:

- Simulator: `https://drmarktzone-stack.github.io/AestheticAI/#/`
- Atlas (temples): `https://drmarktzone-stack.github.io/AestheticAI/#/atlas`
- ACE vascular occlusion: `https://drmarktzone-stack.github.io/AestheticAI/#/emergency/vascular-occlusion`

On Pages the Vertex API is not present; the simulator degrades to the on-device path.

## Clinical boundary

Typical dose ranges are educational. The clinician decides. Product IFU, anatomy, and clinic policy take precedence. Defaults are marked as educational drafts (`reviewedByPhysician: false`). Demo media is labelled. Gemini may propose which regions look treated; numeric ml/units are snapped to the protocol catalog. The simulator after is an illustration of the uploaded photo — never a stock model and never a guaranteed clinical result.

## Stack

Vite + React + HashRouter. On-device face engine: MediaPipe Face Landmarker (478 points), triangulated piecewise-affine warp, region-local texture. Cloud Run API: Vertex Gemini (`gemini-2.5-flash` vision JSON; image try-order `gemini-3.1-flash-image` then `gemini-2.5-flash-image`). Clinical data lives in `src/data`.
