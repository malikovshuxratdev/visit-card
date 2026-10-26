# shared

Code used by several features. Must not import from `src/features/`.

| Folder | Contents |
|---|---|
| `api/` | `baseApiClient` — axios singleton: base URL from env, bearer token, 401 → clear token + `/login`. `buildParams` for query strings. |
| `hooks/` | `queryKeys` (all React Query keys), re-exported `useQuery` / `useMutation`. |
| `ui/` | `BrandBackground` (video + scrim), `Panel`, `PageHeading`, `PageLoader`, `StatusCard`, `Stepper`, `ScaledBox`. |
| `utils/` | `TokenService`, `showErrorModal` / `showErrorModalFromApiError` / `getApiErrorMessage`, `formatDate`, `formatPhone`, themed modal bridge. |
| `constants/` | `BASE_URI` (only place env is read), `SCIENCE_ID_URL`, language and session keys. |
| `types/` | `Profile`, `ProfileResponse`. |
| `lib/` | `cn()` = clsx + tailwind-merge. |
| `pages/` | `NotFoundPage` (404), `ErrorBoundaryPage` (route errors). |
