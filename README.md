# AestheticAI

Clinical mentor for licensed aesthetic physicians. One application: region → cited protocol → material and typical dose → illustrated injection → emergency. The smart planner is a primary tool on the same path.

This is not a patient spa app, not a recovery companion, and not a catalog of cards. Brand name: **AestheticAI**. Protocols live inside the product; they are not a separate site.

Hebrew is the default language. Arabic and English are first-class. RTL layout flips for Hebrew and Arabic.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173). No API keys are required. Demo media and educational dose ranges run offline.

```bash
npm run build
npm run preview
```

`npm run preview` serves the production build (typically http://localhost:4173).

## Public preview

GitHub Pages (after the workflow publishes `dist/`):

**https://drmarktzone-stack.github.io/AestheticAI/**

The app uses hash routes, so a lips mentor path looks like:

`https://drmarktzone-stack.github.io/AestheticAI/#/journey/lips/protocol`

## What you can walk

1. **World of aesthetics** — editorial face atlas. Choose a region (start with lips).
2. **Mentor path** — anatomy and danger zones → protocol with citations → matching materials and typical educational doses → illustrated injection / demo simulation → complications and ACE-style emergency.
3. **Smart planner** — upload a photo or use the demo still, mark regions, multi-select treatment families (filler, tightening, wrinkles, aesthetic toxin, therapeutic toxin including TMJ / hyperhidrosis), receive a material + dose suggestion that resolves to a cited protocol, then generate an on-device illustrative after preview. That preview is labelled **Demo** and is never presented as a guaranteed clinical result.
4. **Houses and products** — opened from the materials step, with citations. Incomplete citations are marked.
5. **Emergency** — vascular occlusion, vision threat, anaphylaxis, Tyndall, delayed nodule, toxin ptosis.

## Languages

Switch **עב / عر / EN** in the header. Document `dir` and layout follow the locale. UI chrome is not hardcoded; clinical seed content is trilingual where authored, with Hebrew as the canonical draft.

## Clinical boundary

Typical dose ranges are educational. The clinician decides. Product IFU, anatomy, and clinic policy take precedence. Defaults are marked as educational drafts (`reviewedByPhysician: false`). No identifiable real-patient photographs; media is educational / demo.

Live image models are optional and not required. If they are not configured, the planner uses an honest on-device demo morph with loading / error / success states.

## Stack

Vite + React. Clinical data lives in `src/data` (protocols, materials, companies, citations, mentor packs). Shared engines: `src/lib/doseEngine.ts`, `src/lib/afterEngine.ts`.
