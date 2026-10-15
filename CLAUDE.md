# visit-card — project rules

Structure mirrors `~/Desktop/library/slib-ui` (feature-based).

```
src/
  main.tsx, Providers.tsx, i18n.ts, index.css
  routes/        path.ts (route constants + builders), Routes.tsx (lazy routes), index.ts (constants only)
  layout/        main-layout/MainLayout.tsx (auth guard + header/stepper)
  features/<name>/  api/ hooks/ components/ pages/ types/ utils/ constants/ + index.ts (public surface)
    auth/        login
    science-id/  home page, Science ID lookup
    face-id/     camera, face detection, recognize/verify API
    visit-card/  card front/back, profile query, export + print
  shared/        api/ (BaseClient), hooks/ (queryKeys, useQuery), ui/, utils/, constants/, types/, lib/, pages/
public/locales/uz/translation.json   # all user-facing text
```

- Imports are absolute `@/...`. Another feature is used only through its `index.ts`.
- API: one class per feature in `api/<name>Api.ts` with a local `urls` map, singleton export, methods return `result.data`.
- Hooks: `use<Entity>DetailQuery`, `use<X>Mutation`; query keys live in `shared/hooks/queryKeys.ts`.
- Env is read only in `shared/constants/envURI.ts`. Never commit `.env`.
- No hardcoded UI strings: `useTranslation()` + keys in `public/locales/uz/translation.json` (nested, kebab-case).
- Card components (`features/visit-card/components/Card*.tsx`) are print artwork: fixed 450×280 px, `font-card` system font, pure `text-black` (no opacity/grey — see README "Printing").
- Prettier: 4 spaces, single quotes, semicolons, width 80.
- Verify: `npx tsc -b && npm run lint && npm run build`.
