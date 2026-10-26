# Science ID tashrif kartasi

Kiosk web app that prints a personal **Science ID** card (CR80, two-sided).
An operator logs in once; each visitor then enters their Science ID, confirms
their face with the webcam, and gets a printed card with their profile data
and a QR code linking to their public Science ID page.

```
Login ──▶ 1. Science ID ──▶ 2. Face ID ──▶ 3. Card ──▶ Print
(operator)   enter ID          webcam        preview      CR80 printer
```

## Contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [User flow](#user-flow)
- [Backend API](#backend-api)
- [Printing](#printing)
- [Kiosk deployment](#kiosk-deployment)
- [Project structure](#project-structure)
- [Translations](#translations)
- [Troubleshooting](#troubleshooting)

## Requirements

- Node.js 20+ and npm
- Chrome / Chromium (recommended for the kiosk; MediaPipe and silent printing are tested there)
- A webcam and a CR80 card printer (YMCKO ribbon) for production use
- Network access to the backend API, `cdn.jsdelivr.net` and `storage.googleapis.com`
  (MediaPipe WASM + face model are loaded at runtime)

## Getting started

```bash
cp .env.example .env      # then set VITE_BASE_URI
npm install
npm run dev               # http://localhost:5173
```

The camera only works on `localhost` or over **HTTPS** (browser security rule).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_BASE_URI` | yes | Backend base URL including the `/api` prefix, e.g. `https://api-idcard.ilmiy1.uz/api` |

`.env` is git-ignored — never commit it. Add new variables to `.env.example`,
`src/vite-env.d.ts` and read them only in `src/shared/constants/envURI.ts`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript check (`tsc -b`) |
| `npm run lint` | ESLint |
| `npm run verify` | Typecheck + lint + build — run before every commit |

## User flow

| Step | Route | What happens |
|---|---|---|
| Login | `/login` | Operator signs in; token is stored in `localStorage` (`access_token`). Already signed-in users are redirected to `/`. |
| 1. Science ID | `/` | Visitor types their ID (`ABC-0000-0000`, auto-formatted). The app looks up the profile and gets the PNFL code. A QR code points visitors without an ID to `id.ilmiy.uz`. |
| 2. Face ID | `/camera/:pnfl` | Webcam with a circular guide. MediaPipe detects the face; when it is centred for 6 frames a 3‑second countdown starts and the photo is taken automatically. The **Rasmga olish** button takes it manually (works even if the AI model fails to load). The photo is verified against the Science ID profile photo. |
| 2'. Face only | `/camera` | Same, but without a Science ID — the backend recognises the person by face. |
| 3. Card | `/generator/:pnfl` | Loads the profile and renders the front and back of the card. **Chop etish** opens a print preview, then prints. A "printing" screen returns to the home page after 45 seconds (or on button press). |

All routes except `/login` require a token; a `401` from the API clears it
and sends the operator back to `/login`. Unknown URLs show a 404 page; render
errors show an error page with "reload" and "home" actions.

## Backend API

All requests go to `VITE_BASE_URI` with `Authorization: Bearer <token>`.

| Method | Path | Body | Used for |
|---|---|---|---|
| `POST` | `/login` | `{ username, password }` | Operator login → `{ access_token, token_type, expires_in }` |
| `GET` | `/profile_scienceid/:scienceId` | — | Science ID lookup → `{ pnfl_code, profile, profile_found, message? }` |
| `POST` | `/verify_face` | multipart: `image` (JPEG 480×480), `pnfl_code` | Face check → `{ pnfl_code, match, similarity_percentage, confidence_score, processing_time_seconds }` |
| `POST` | `/recognize_face` | multipart: `image` | Face-only search → `{ pnfl_code \| null, message, … }` |
| `GET` | `/profile/:pnfl` | — | Card data → `{ pnfl_code, profile, profile_found, message? }` |

Error responses with `{ detail: string | string[] | {msg}[] }` are shown to
the user as-is; network errors show a generic "no connection" message.

## Printing

### How it works

1. Both card sides are rendered in the DOM at a fixed **450×280 px** (the
   on-screen preview is only visually scaled).
2. `html-to-image` exports each side at **4×** → 1800×1120 px (≈534 DPI on
   85.6 mm).
3. A **printer colour profile** is applied to the exported images.
4. The images are printed through a **hidden iframe** at the physical CR80
   size `85.6 × 53.98 mm`, margin 0, one page per side (front, then back).

### Why the colour profile exists

Card printers (YMCKO ribbons) reproduce light pastel artwork washed out, and
print anything that is not pure black with mixed C+M+Y dye — text looks soft
and brownish. Therefore:

- all text on the card is pure `#000` (printed with the sharp **K** resin panel);
- the print image gets extra saturation and contrast;
- near-black neutral pixels (text anti-aliasing, icons) are snapped to `#000`.

### Tuning for your printer

Edit `PRINT_COLOR_PROFILE` in `src/features/visit-card/constants/index.ts`
(`1` = unchanged):

| Key | Default | Effect |
|---|---|---|
| `saturation` | `1.3` | Colour intensity. Raise to `1.4–1.5` if the green is still pale. |
| `contrast` | `1.1` | Separation of light/dark. |
| `brightness` | `0.98` | Overall lightness. Lower slightly if colours look washed out. |
| `blackThreshold` | `64` | Pixels darker than this (0–255)… |
| `neutralTolerance` | `28` | …and this grey-ish become pure black. |

The print preview shows the original images; only the printed output is
colour-corrected. Change one value at a time and print a test card.

In the **printer driver**: select the YMCKO ribbon, card size CR80, disable
"colour enhancement" / custom ICC overrides, and enable "print black text
with K panel" if the driver offers it.

## Kiosk deployment

1. Build: `npm run build` and serve `dist/` from any static server with an
   SPA fallback (all paths → `index.html`) over HTTPS.
2. Set the card printer as the **default printer** of the OS.
3. Start Chrome in kiosk mode with silent printing:

   ```bash
   google-chrome --kiosk --kiosk-printing \
     --use-fake-ui-for-media-stream \
     https://your-domain/
   ```

   - `--kiosk-printing` prints straight to the default printer without a dialog.
   - `--use-fake-ui-for-media-stream` auto-accepts the camera permission
     (only use on a dedicated kiosk).
4. Log in once as the operator; the token stays in `localStorage`.

## Project structure

Feature-based, mirroring `slib-ui`:

```
src/
├── main.tsx              # entry: Providers + RouterProvider
├── Providers.tsx         # i18n, antd theme (dark), AntApp, React Query
├── i18n.ts               # i18next init (bundled uz locale)
├── index.css             # Tailwind + base styles
├── routes/               # path.ts (constants + builders), Routes.tsx (lazy)
├── layout/main-layout/   # auth guard, header with brand + step indicator
├── features/
│   ├── auth/             # login page + API
│   ├── science-id/       # home page, Science ID form + lookup
│   ├── face-id/          # camera page, face detection, verify/recognize API
│   └── visit-card/       # card front/back, profile query, export + print
└── shared/
    ├── api/              # BaseClient (axios, token, 401 handling)
    ├── hooks/            # queryKeys, React Query re-exports
    ├── ui/               # Panel, PageHeading, StatusCard, Stepper, ScaledBox…
    ├── utils/            # token storage, error modals, date/phone format
    ├── constants/        # env, links, language, session keys
    ├── types/            # shared domain types (Profile)
    ├── lib/              # cn() helper
    └── pages/            # 404, error boundary
public/locales/uz/translation.json   # every user-facing string
```

Each feature folder has its own `README.md`. Coding rules for contributors and
AI agents are in [AGENTS.md](./AGENTS.md).

## Translations

All UI text lives in `public/locales/uz/translation.json` (nested,
kebab-case keys) and is used via `useTranslation()`:

```tsx
const { t } = useTranslation();
<h1>{t('pages.home.title')}</h1>
```

To add a language: create `public/locales/<lng>/translation.json`, import it
in `src/i18n.ts`, and add the code to `SUPPORTED_LANGUAGES` in
`src/shared/constants/language.ts`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Kameraga ruxsat berilmagan" | Allow the camera in Chrome site settings; the page must be HTTPS or localhost. |
| "Kamera topilmadi" / "band" | Check the webcam cable; close other apps using the camera (Zoom, Teams). |
| Auto-capture never triggers | The face model is downloaded from the CDN — check internet access. Manual capture still works. |
| Print dialog appears | Chrome was not started with `--kiosk-printing`. |
| Card prints on several pages or cropped | Set the printer paper size to CR80 (85.6×54 mm) and margins to none. |
| Colours still pale / text soft | See [Tuning for your printer](#tuning-for-your-printer). |
| Redirected to login | The token expired (API returned 401) — log in again. |
| Photo missing on the printed card | The profile photo URL must allow CORS, otherwise the exporter cannot embed it. |

## Tech stack

React 18 · TypeScript · Vite 7 · Tailwind CSS 3 · Ant Design 5 · TanStack
Query 5 · React Router 7 · i18next · MediaPipe Tasks Vision · html-to-image ·
qrcode.react · dayjs · lucide-react
