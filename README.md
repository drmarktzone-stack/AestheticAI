# AestheticAI

Clinical mentor for licensed aesthetic physicians. Brand name: **AestheticAI**. One Vite app, three spaces:

1. **Simulator (home)** — upload a real face photo. MediaPipe Face Landmarker snaps it into the engine frame. Tap a region on that photo, choose treatment and expected after, then generate an after that warps the same photo. Before/after slider. Labelled **הדמיה / דמו** — not a promised result.
2. **Atlas** — one region in depth: anatomical layers, typical educational dose, ACE path.
3. **Emergency** — ACE vascular ischemia pathway.

Protocols live inside the same app as a clinical journey step. They are not a separate product.

Hebrew is the default language. Arabic and English are first-class. RTL layout flips for Hebrew and Arabic.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173). No API keys are required. Face alignment uses a self-hosted MediaPipe model plus WASM from jsDelivr.

```bash
npm run build
npm run preview
```

`npm run preview` serves the production build (typically http://localhost:4173). For a Pages-shaped build:

```bash
GITHUB_PAGES=1 npm run build
GITHUB_PAGES=1 npm run preview
```

Preview is then at http://localhost:4173/AestheticAI/

## Cloud Run

The Google Cloud Run wizard for this repo must **not** track `main` until this Vite app is merged. `main` is still the Expo `protokol-mobile` package and cannot serve `$PORT`.

Track this branch:

**`cursor/aestheticai-clinical-app-14fb`**

Dockerfile at repo root (`/Dockerfile`): Node 22 build, then a tiny static server on `0.0.0.0:$PORT` (default 8080). No API keys are baked into the image. GitHub Pages stays on the existing workflow (`GITHUB_PAGES=1`).

```bash
docker build -t aestheticai .
docker run --rm -p 8080:8080 -e PORT=8080 aestheticai
```

## Public preview

GitHub Pages (after the workflow publishes `dist/`):

**https://drmarktzone-stack.github.io/AestheticAI/**

The app uses hash routes:

- Simulator: `https://drmarktzone-stack.github.io/AestheticAI/#/`
- Atlas (temples): `https://drmarktzone-stack.github.io/AestheticAI/#/atlas`
- ACE vascular occlusion: `https://drmarktzone-stack.github.io/AestheticAI/#/emergency/vascular-occlusion`

## Clinical boundary

Typical dose ranges are educational. The clinician decides. Product IFU, anatomy, and clinic policy take precedence. Defaults are marked as educational drafts (`reviewedByPhysician: false`). Demo media is labelled. The simulator after is an on-device illustration of the uploaded photo — never a stock model and never a guaranteed clinical result.

## Stack

Vite + React + HashRouter. On-device face engine: MediaPipe Face Landmarker (478 points), triangulated piecewise-affine warp, region-local texture. Clinical data lives in `src/data`.
