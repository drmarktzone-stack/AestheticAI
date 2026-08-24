# Protokol Mobile — Aesthetic Medicine (Expo + TypeScript)

Cross-platform clinical app scaffold with **react-i18next** (en/he/ar), **RTL**, and **Supabase** (auth, DB, encrypted storage).

## Project structure

```
src/
├── app/              # Root providers
├── components/       # UI + layout (RTL-aware)
├── config/           # Environment
├── hooks/            # useAuth, useRTL
├── i18n/             # i18next init, RTL engine
├── lib/supabase/     # Client, auth, medical image storage
├── locales/          # en.json, he.json, ar.json (unified schema)
├── screens/          # Feature screens
├── theme/            # Design tokens
└── types/            # TranslationSchema + shared types
```

## Step 1 — Install & run

```bash
cd protokol-mobile
npm install
cp .env.example .env   # fill Supabase keys
npx expo start
```

## Step 2 — Environment variables

Create `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET=medical-images
```

Restart Expo after changing env vars (`r` in terminal or full restart).

## Step 3 — TypeScript (strict)

`tsconfig.json` enables:

- `strict`
- `noUncheckedIndexedAccess`
- Path alias `@/*` → `src/*`

Run typecheck:

```bash
npx tsc --noEmit
```

## Step 4 — i18n (react-i18next)

- **No hardcoded UI strings** — use `t('namespace.key')` via `useTranslation()`.
- Unified schema: `src/types/translations.ts` — update this first, then `en.json`, `he.json`, `ar.json`.
- Typed keys via module augmentation in `src/i18n/resources.ts`.

Change language:

```tsx
import { changeAppLanguage } from '@/i18n';
await changeAppLanguage('he'); // 'en' | 'he' | 'ar'
```

## Step 5 — RTL (Hebrew + Arabic)

Configured in `src/i18n/rtl.ts`:

1. `I18nManager.forceRTL(true|false)` when switching he/ar ↔ en
2. App reload via `expo-updates` in production builds
3. Layout helpers in `useRTL()` — use `row`, `textStart`, `textEnd` instead of left/right

**app.json** (already set):

- Android: `"supportsRtl": true`
- iOS: `ExpoLocalization_supportsRTL`

**Best practice in components:**

```tsx
const { row, textStart } = useRTL();
<View style={{ flexDirection: row }}>
  <Text style={{ textAlign: textStart }}>{t('home.welcome')}</Text>
</View>
```

Use `marginStart` / `paddingEnd` (logical props) instead of `marginLeft`.

> **Note:** Native RTL flip requires app reload when crossing LTR↔RTL. This is standard React Native behavior.

## Step 6 — Supabase setup

### 6.1 Create project

1. [supabase.com](https://supabase.com) → New project
2. Copy **Project URL** and **anon public key** into `.env`

### 6.2 Auth

Enable Email provider in Supabase Dashboard → Authentication.

Client: `src/lib/supabase/client.ts` (SecureStore + AsyncStorage hybrid session).

### 6.3 Private storage bucket (medical images)

In Supabase Dashboard → Storage:

1. Create bucket `medical-images`
2. **Private** (not public)
3. Enable encryption at rest (default on Supabase cloud)

Example RLS policies (SQL Editor):

```sql
-- Physicians can only access their own patient folders
create policy "physician_read_own_images"
on storage.objects for select
using (
  bucket_id = 'medical-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "physician_upload_own_images"
on storage.objects for insert
with check (
  bucket_id = 'medical-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
```

Upload helper: `uploadMedicalImage()` in `src/lib/supabase/storage.ts`  
Path pattern: `{physicianId}/{patientId}/{fileName}`

### 6.4 Database tables (starter)

```sql
create table patients (
  id uuid primary key default gen_random_uuid(),
  physician_id uuid references auth.users(id) not null,
  display_code text not null,
  created_at timestamptz default now()
);

alter table patients enable row level security;

create policy "physicians_own_patients"
on patients for all
using (auth.uid() = physician_id);
```

Generate typed client:

```bash
npx supabase gen types typescript --project-id YOUR_ID > src/lib/supabase/database.types.ts
```

## Step 7 — Adding translations

1. Add key to `TranslationSchema` in `src/types/translations.ts`
2. Add string to `en.json`, `he.json`, `ar.json`
3. Use in UI: `t('your.key')`

## Compliance notes (HIPAA / GDPR)

- Store images in **private** Supabase bucket with RLS
- Use signed URLs with short TTL (`createSignedUrl`)
- Session tokens in SecureStore when possible
- Sign BAA with Supabase if handling US PHI (Pro/Team plan)
- Add audit logging + consent flows before production

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run android` | Android |
| `npm run ios` | iOS (macOS) |
| `npx tsc --noEmit` | Typecheck |

## Next implementation phases

- Navigation (Expo Router)
- Consultation + simulation screens (port from web Protokol)
- Physician content approval workflow
- Offline cache (expo-sqlite)
