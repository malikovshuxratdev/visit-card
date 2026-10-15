# AGENTS.md — visit-card

Instructions for AI coding agents (Claude Code, Codex, Cursor…) and human
contributors. Product overview, setup and deployment are in
[README.md](./README.md).

## Project in one paragraph

Vite + React 18 + TypeScript kiosk app. Operator logs in → visitor enters a
Science ID → webcam face verification (MediaPipe) → two-sided CR80 card is
rendered, exported to PNG, colour-corrected and printed on a card printer.
UI: Tailwind 3 + Ant Design 5 (dark theme). Server state: TanStack Query.
Routing: React Router 7. Text: i18next (Uzbek only for now).

## Commands

```bash
npm run dev         # dev server
npm run typecheck   # tsc -b
npm run lint        # eslint
npm run build       # vite build
npm run verify      # typecheck + lint + build — must pass before you say "done"
```

There is no test runner yet. For UI changes, run the dev server and check the
page in a browser at desktop (1920×1080), tablet (1024×768) and mobile
(390×844) widths.

## Architecture (feature-based, mirrors `~/Desktop/library/slib-ui`)

```
src/
  main.tsx, Providers.tsx, i18n.ts, index.css
  routes/        path.ts (constants + path builders), Routes.tsx (lazy routes), index.ts (constants only)
  layout/        main-layout/MainLayout.tsx (auth guard, header, step indicator)
  features/<name>/
    api/         <name>Api.ts — one class, local `urls` map, singleton export
    hooks/       use<Entity>DetailQuery / use<X>Mutation
    components/  feature UI (+ index.ts barrel)
    pages/       route components (default export, lazy-loaded)
    types/ utils/ constants/
    index.ts     public surface for OTHER features
    README.md    what the feature does
  shared/        api/ hooks/ ui/ utils/ constants/ types/ lib/ pages/
public/locales/uz/translation.json
```

Features: `auth`, `science-id`, `face-id`, `visit-card`.

### Rules

1. **Imports are absolute** (`@/features/...`, `@/shared/...`), even inside a feature.
2. A feature may import another feature **only through its `index.ts`**
   (e.g. `science-id` uses `CardFront` from `@/features/visit-card`).
   Never import from another feature's internal folders.
3. `shared/` never imports from `features/`.
4. `routes/index.ts` exports constants only (avoids circular imports).
   Navigate with builders: `navigate(paths.generator(pnfl))`, never string concatenation.
5. Pages are lazy-loaded in `routes/Routes.tsx` and default-exported.

## Conventions

### API + data

- HTTP goes through `baseApiClient` (`@/shared/api`). It attaches the bearer
  token and redirects to `/login` on 401. Do not create other axios instances.
- New endpoint → add to the feature's `api/<name>Api.ts` `urls` map and a
  method returning `result.data`; types go in the feature's `types/` (or
  `shared/types/` if several features use them).
- Queries: keys only from `shared/hooks/queryKeys.ts`. Mutations surface
  errors with `showErrorModalFromApiError` (`@/shared/utils`).
- `QueryClient` defaults (in `Providers.tsx`): no refetch on focus,
  `staleTime` 60 s, 1 retry for queries, none for mutations.
- Env vars are read **only** in `shared/constants/envURI.ts`.

### UI

- **No hardcoded user-facing strings.** Add a key to
  `public/locales/uz/translation.json` (nested, kebab-case:
  `pages.<page>.<key>`, `components.<component>.<key>`, `common.*`) and use
  `const { t } = useTranslation()`. Outside React use `i18n.t` from `@/i18n`.
- Reuse `@/shared/ui`: `Panel` (glass container), `PageHeading`
  (eyebrow/title/subtitle), `StatusCard` (error/empty states), `PageLoader`,
  `Stepper`, `ScaledBox`, `BrandBackground`.
- Design tokens are in `tailwind.config.js`: `brand-*` (Science ID green),
  `ink-*` (navy surfaces), `scan` (cyan), shadows `shadow-panel`/`shadow-card`,
  animations `animate-fade-up`/`animate-scan-line`. Use them instead of raw hex.
- antd components are themed in `Providers.tsx` (dark algorithm, primary
  `#039855`). Imperative modals: use `showErrorModal` so they get the theme.
- Icons: `lucide-react` **0.344** — use names that exist in that version
  (`CheckCircle2`, `AlertTriangle`, not `CircleCheck`/`TriangleAlert`).
- Combine classes with `cn()` from `@/shared/lib/utils`.
- Layout must work from 320 px to 1920 px wide; touch targets ≥ 44 px
  (kiosk touchscreen).

### Formatting

Prettier (`.prettierrc`): 4 spaces, single quotes, semicolons, trailing
commas `es5`, width 80. Components/pages PascalCase `.tsx`; hooks/api/utils
camelCase `.ts`; folders kebab-case; every folder has an `index.ts` barrel.

## Danger zones — read before editing

### Card artwork (`features/visit-card/components/Card*.tsx`)

These components are **print artwork**, not regular UI.

- Fixed size `CARD_WIDTH × CARD_HEIGHT` (450×280). Layout uses pixel values
  that match the background PNGs — don't convert to responsive units.
- Text must be **pure `text-black`** — no opacity, no grey. Grey prints
  blurry with CMY dye on card printers.
- Use the `font-card` system font stack (html-to-image does not embed web
  fonts; we pass `skipFonts: true`).
- Scaling for display is done by the `ScaledBox` wrapper; the exported node
  must stay untransformed.

### Print pipeline (`features/visit-card/utils/print.ts`, `constants/index.ts`)

- Export: `exportCardImage` (4× pixel ratio). Colour correction:
  `prepareImageForPrint` / `adjustPixels` with `PRINT_COLOR_PROFILE`.
- Printing uses a hidden iframe (works with `--kiosk-printing`, never blocked
  as a popup). Do not switch back to `window.open`.
- Page size is CR80 `85.6 × 53.98 mm`, margin 0, one page per side.

### Camera + face detection (`features/face-id/`)

- `useCamera` owns the `MediaStream`: it must stop tracks on stop, retake and
  unmount (including unmount during `getUserMedia`). Keep that guarantee.
- Camera constraints are 640×480 and face thresholds in `useFaceDetection.ts`
  (`CENTER_TOLERANCE`, `MIN/MAX_FACE_SIZE`) are relative to that frame. If
  you change the resolution, re-tune the thresholds.
- Countdown: an **auto** countdown is cancelled when the face leaves the
  guide; a **manual** one (button) always completes — manual capture must work
  even when the model failed to load.
- The captured photo is a centre-square crop, 480×480 JPEG (q 0.95), not
  mirrored. The preview is mirrored only visually (`-scale-x-100`).
- MediaPipe WASM/model are loaded from CDNs (`WASM_PATH`, `BLAZE_FACE_MODEL`).

### Auth

- Token key: `access_token` in `localStorage` (`TokenService`).
- `MainLayout` guards protected routes with `<Navigate>`; `LoginPage`
  redirects away when a token exists. There is intentionally **no logout
  button** (kiosk).

## Recipes

**Add a page:** create `features/<f>/pages/XPage.tsx` (default export) → add
a constant + builder to `routes/path.ts` → add a lazy route in
`routes/Routes.tsx` (inside the `MainLayout` children if it needs auth) →
add texts to the locale file.

**Add an endpoint:** `features/<f>/types` → `api/<f>Api.ts` (`urls` + method)
→ `hooks/use<X>Query|Mutation.ts` (key in `shared/hooks/queryKeys.ts`) →
export from the feature `index.ts` only if another feature needs it.

**Add a translation:** edit `public/locales/uz/translation.json`; keys are
type-checked only at runtime, so grep for the key after adding it.

## Don'ts

- Don't commit `.env`, `dist/`, `*.tsbuildinfo`, or `node_modules`.
- Don't add new UI/state libraries (Redux, MUI, …) without asking.
- Don't put business logic in `shared/`; don't import features from `shared/`.
- Don't change card artwork layout, colours or print constants without a test
  print on the real printer.
- Don't commit or push unless the user asks.
