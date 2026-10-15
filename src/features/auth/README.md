# auth

Operator login for the kiosk.

| Path | Purpose |
|---|---|
| `pages/LoginPage.tsx` | `/login` — antd form (username ≥ 3, password ≥ 6). Redirects to `/` if a token already exists. |
| `hooks/useLoginMutation.ts` | `POST /login`; stores `access_token` via `TokenService`, navigates home. 400/401/422 → "wrong credentials" modal, other errors → API message. |
| `api/authApi.ts` | `AuthAPI.login(body)` |
| `types/auth.ts` | `LoginBody`, `LoginResponse` |

Notes
- The route guard lives in `src/layout/main-layout/MainLayout.tsx`.
- A 401 from any other endpoint clears the token and redirects here (`shared/api/baseClient.ts`).
- There is intentionally no logout button (kiosk).
