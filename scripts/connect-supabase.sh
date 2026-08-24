#!/usr/bin/env bash
# Link this repo to a hosted Supabase project, push migrations, deploy functions.
# Requires: SUPABASE_ACCESS_TOKEN and PROJECT_REF (or interactive supabase login).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required"
  exit 1
fi

npx --yes supabase --version

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Set SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens"
  echo "Then re-run: SUPABASE_ACCESS_TOKEN=... PROJECT_REF=xxxxx ./scripts/connect-supabase.sh"
  exit 1
fi

if [[ -z "${PROJECT_REF:-}" ]]; then
  echo "Set PROJECT_REF (Settings → General → Reference ID), e.g. abcdxyzefghijk"
  exit 1
fi

npx supabase link --project-ref "$PROJECT_REF" --yes
npx supabase db push
npx supabase functions deploy analyze-face
npx supabase functions deploy timeline-simulator
npx supabase functions deploy submit-checkin
npx supabase functions deploy clinic-alerts

echo
echo "Next: set Edge Function secrets in the dashboard (or via CLI):"
echo "  npx supabase secrets set OPENAI_API_KEY=..."
echo "  npx supabase secrets set REPLICATE_API_TOKEN=..."
echo
echo "Then copy Project URL + anon key into .env as EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY"
