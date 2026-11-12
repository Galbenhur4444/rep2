# rep²

Hebrew (RTL) PWA for a couple: fixed weekly workout slots, weekly meal planning, shared shopping list, personal tracking. Two users only, both on iPhone.

## Stack
- React + Vite + TypeScript + Tailwind v4, vite-plugin-pwa, react-router
- Supabase: Auth (magic link), Postgres with RLS, Realtime, Storage, Edge Functions
- AI via OpenRouter, called ONLY from the `ai` Edge Function. Model from env `AI_MODEL`. Never expose keys in the client.
- Hosting: Netlify (auto-deploy from GitHub main)

## Rules
- UI text in Hebrew, `dir="rtl"`. Apple-like style: system font, rounded cards (16px), accent #FF375F, dark mode, tap targets >= 44px, safe-area insets. Shared UI in `src/ui.tsx`.
- Mobile-first; test at 390px width.
- Every table has RLS: only members of the same couple. Personal data visible to partner only when the matching share flag is on.
- AI responses: JSON validated with zod before use.
- Small steps: one feature per change; explain changes simply (the developer is learning).
- Ask before adding a new dependency.

## Commands
- `npm run dev` / `npm run build`
- Supabase migrations in `supabase/migrations`.

## Build phases
0 infra · 1 workouts · 2 food · 3 shopping · 4 logging & metrics · 5 Apple Health via Shortcuts
