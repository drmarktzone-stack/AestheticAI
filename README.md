# פרוטוקול (Protokol)

Clinical decision platform for aesthetic physicians — materials, anatomy, techniques, protocols, emergency, patient simulation, and consultation flow.

**Languages:** Hebrew · Arabic · English (RTL/LTR)

## Run

```bash
cd protokol
npm install
npm run dev
```

## What's included (v2)

- **Trilingual UI** — switch עב / عر / EN in the header
- **Consultation flow** — Assessment → Plan → Simulation → Documentation
- **Patient simulation** — upload photo, select zones, before/after preview, injection points
- **Interactive face map** — treatment zones + danger highlighting
- **Technique simulator** — animated injection paths
- **Clinical library** — materials, regions, techniques, protocols, emergency
- **Physician ownership** — draft content until you approve

## Medical responsibility

For licensed physicians only. All clinical content (dosing, indications, emergency protocols) is your responsibility. Defaults are drafts (`reviewedByPhysician: false`) until approved against IFU and clinic policy.

## Structure

- `src/i18n` — locales (he/ar/en)
- `src/data` — clinical seed content + face zones
- `src/components/visual` — FaceMap, TechniqueSimulator, BeforeAfterViewer
- `src/pages` — Home, Consultation, Simulation, library modules

## Next steps

1. Approve/edit clinical content (brands, doses, emergency protocol)
2. Richer simulation (landmark AI, mesh warping)
3. Photo/video guides per procedure
4. PWA offline + physician auth
5. Consent templates + outcome tracking (simulation vs real)
