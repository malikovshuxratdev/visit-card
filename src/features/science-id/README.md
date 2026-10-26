# science-id

Step 1 — the home page where the visitor enters their Science ID.

| Path | Purpose |
|---|---|
| `pages/HomePage.tsx` | `/` — form panel + sample card preview (uses `@/features/visit-card`). |
| `components/ScienceIdForm.tsx` | Auto-formatting input (`ABC-0000-0000`), submit on Enter/button. |
| `components/FaceScanOption.tsx` | "Yuz orqali topish" — opens `/camera` without a PNFL (face-only lookup via `POST /recognize_face`). |
| `components/NoScienceIdHint.tsx` | QR code to `id.ilmiy.uz` for visitors without an ID. |
| `hooks/useScienceIdLookupMutation.ts` | `GET /profile_scienceid/:id`; on `pnfl_code` → `/camera/:pnfl`, otherwise shows the API message. |
| `utils/formatScienceId.ts` | `formatScienceId`, `isValidScienceId`, `SCIENCE_ID_LENGTH` (13). |

Format: 3 Latin letters + 8 digits. Digits are accepted only after the three
letters; input is upper-cased and dashes are inserted automatically.
