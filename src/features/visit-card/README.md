# visit-card

Step 3 — renders the two-sided card and prints it.

| Path | Purpose |
|---|---|
| `pages/GeneratorPage.tsx` | `/generator/:id` — loads the profile, shows both sides, export → preview → print → "printing" screen. |
| `components/CardFront.tsx`, `CardBack.tsx`, `CardField.tsx` | **Print artwork** at a fixed 450×280 px over `frontImage.png` / `backImage.png`. |
| `components/CardPreview.tsx` | Scales a card to the available width (`ScaledBox`) with a caption. |
| `components/PrintPreviewModal.tsx` | Shows the exported images; on print applies the colour profile and prints. |
| `components/PrintingOverlay.tsx` | Full-screen printing animation, returns home after `PRINTING_REDIRECT_SECONDS` (45). |
| `hooks/useVisitCardQuery.ts` | `useProfileDetailQuery(pnfl)` → `GET /profile/:pnfl`. |
| `hooks/useImagesReady.ts` | Waits for the card background images (never hangs on error). |
| `utils/print.ts` | `exportCardImage` (html-to-image, 4×), `adjustPixels` / `prepareImageForPrint` (colour profile), `printImages` (hidden iframe, CR80 page). |
| `constants/index.ts` | Card size, export ratio, `PRINT_PAGE_MM`, **`PRINT_COLOR_PROFILE`**, `SAMPLE_PROFILE`. |

Public API (`index.ts`): `CardFront`, `CardBack`, `CardPreview`, `SAMPLE_PROFILE` — used by the home page.

Card rules
- All card text is pure `text-black` (sharp K panel on YMCKO printers) — never grey or semi-transparent.
- `font-card` system font (web fonts are not embedded by the exporter).
- Missing values show `common.not-available` ("Yo'q"); invalid dates too; empty phone/email rows are hidden.
- QR on the back links to `https://id.ilmiy.uz/user/card/<science_id>` (sample card → `https://id.ilmiy.uz`).

Colour tuning: see README → "Printing". Change one `PRINT_COLOR_PROFILE` value at a time and test on the real printer.
