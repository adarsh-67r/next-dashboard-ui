# Package Upgrade Migration Notes

## Upgraded: Path B (Full Latest) — May 2026

### Summary of Changes

| Package | Old | New |
|---|---|---|
| `next` | 14.2.5 | 15.3.2 |
| `react` | ^18 | ^19.1.0 |
| `react-dom` | ^18 | ^19.1.0 |
| `tailwindcss` | ^3.4.1 | ^4.1.6 |
| `eslint` | ^8 | ^9 |
| `eslint-config-next` | 14.2.5 | 15.3.2 |
| `typescript` | ^5 | ^5.8.3 |
| `@types/node` | ^20 | ^22 |
| `@types/react` | ^18 | ^19 |
| `@types/react-dom` | ^18 | ^19 |
| `zod` | ^3.23.8 | ^3.24.4 |
| `react-hook-form` | ^7.52.2 | ^7.54.2 |
| `@hookform/resolvers` | ^3.9.0 | ^3.10.0 |
| `recharts` | ^2.12.7 | ^2.15.3 |
| `react-big-calendar` | ^1.13.2 | ^1.16.3 |
| `react-calendar` | ^5.0.0 | ^5.1.0 |
| `moment` | ^2.30.1 | **REMOVED** → replaced by `dayjs` |

---

## Breaking Changes & What to Fix

### 1. Tailwind CSS v4 — CSS-first config
- `tailwind.config.ts` is **deleted** — Tailwind v4 uses CSS `@theme` tokens instead
- Custom colors are now defined in `app/globals.css` via `@theme {}`
- `postcss.config.mjs` now uses `@tailwindcss/postcss` instead of `tailwindcss`
- Old class names like `bg-lamaSky` → now `bg-lama-sky` (kebab-case)
- `backgroundImage` gradient utilities are built-in in v4, remove custom ones

### 2. ESLint 9 — Flat config
- `.eslintrc.json` is **replaced** by `eslint.config.mjs`
- Old `extends: "next/core-web-vitals"` now uses FlatCompat adapter

### 3. Next.js 15
- `params` and `searchParams` in `page.tsx` are now **async** — must be awaited:
  ```tsx
  // OLD
  export default function Page({ params }: { params: { id: string } }) {}

  // NEW
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  ```
- `--turbopack` flag added to `dev` script for faster HMR
- `remotePatterns` in `next.config.mjs` now requires `protocol` field

### 4. React 19
- `ref` is now a regular prop — no more `React.forwardRef` needed
- `ReactDOM.render` is removed — use `createRoot` (likely already done)
- New hooks: `use()`, `useFormStatus()`, `useOptimistic()` available

### 5. moment.js → dayjs
- `moment` is deprecated and unmaintained
- Replace all `import moment from 'moment'` with `import dayjs from 'dayjs'`
- API is nearly identical:
  ```ts
  // OLD
  moment(date).format('DD/MM/YYYY')

  // NEW
  dayjs(date).format('DD/MM/YYYY')
  ```
- `react-big-calendar` uses moment as a localizer — update to:
  ```tsx
  import dayjs from 'dayjs'
  import dayjsLocalizer from 'react-big-calendar/lib/localizers/dayjs'
  const localizer = dayjsLocalizer(dayjs)
  ```

---

## Steps After Cloning This Branch

```bash
# 1. Delete old lockfile and node_modules
rm -rf node_modules package-lock.json

# 2. Install fresh dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Fix any TypeScript/ESLint errors surfaced by strict new versions
```
