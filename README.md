# Science ID tashrif kartasi

Kiosk web app that prints a personal Science ID card: the operator logs in,
the visitor enters their Science ID, confirms their face with the webcam, and
the two-sided card is printed on a CR80 card printer.

## Getting started

```bash
cp .env.example .env   # set VITE_BASE_URI to the backend URL
npm install
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (`dist/`) |
| `npx tsc -b` | Typecheck |
| `npm run lint` | ESLint |

## Flow

1. **Login** (`/login`) — operator credentials, token stored in `localStorage`.
2. **Science ID** (`/`) — `GET /profile_scienceid/:id` → PNFL code.
3. **Face ID** (`/camera/:pnfl`) — MediaPipe face detection auto-captures when
   the face is centred (or press the button), then `POST /verify_face`.
   Without a PNFL (`/camera`) it uses `POST /recognize_face`.
4. **Card** (`/generator/:pnfl`) — `GET /profile/:pnfl`, render, print.

## Printing

Cards are rendered at 450×280 px and exported at 4× (1800×1120 px ≈ 534 DPI),
then printed through a hidden iframe at the physical CR80 size
(85.6 × 53.98 mm, no margins). For silent kiosk printing run Chrome with
`--kiosk --kiosk-printing` and set the card printer as default.

Card printers wash out pastel artwork and print grey text with blurry CMY dye,
so the print image gets a colour profile: more saturation/contrast and
near-black pixels snapped to pure `#000` (sharp K panel). All card text is
pure black for the same reason. Tune the values for your printer in
`src/features/visit-card/constants/index.ts` → `PRINT_COLOR_PROFILE`
(`1` = unchanged). In the printer driver also disable any "colour
enhancement"/ICC override and select the YMCKO ribbon.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, Ant Design 5, TanStack Query,
React Router 7, i18next, MediaPipe Tasks Vision, html-to-image.

## Structure

See [CLAUDE.md](./CLAUDE.md).
