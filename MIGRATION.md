# Package Upgrade Migration Notes

## Upgraded: Path B (Full Latest) — May 2026

### Summary of Changes

| Package | Old | New |
|---|---|---|
| `next` | 14.2.5 | **16.2.6** |
| `react` | ^18 | ^19.2.0 |
| `react-dom` | ^18 | ^19.2.0 |
| `tailwindcss` | ^3.4.1 | ^4.1.6 |
| `eslint` | ^8 | ^9 |
| `eslint-config-next` | 14.2.5 | 16.2.6 |
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

### 3. Next.js 16 (major upgrade from 14)

#### params / searchParams are async
```tsx
// OLD (Next.js 14)
export default function Page({ params }: { params: { id: string } }) {}

// NEW (Next.js 15+)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

#### middleware.js → proxy.js
- `middleware.js` is deprecated in Next.js 16 — rename to `proxy.js`
- Behavior is the same, just rename and adjust the exported function
- Old `middleware.js` still works temporarily but will be removed in a future version

#### Turbopack is now default
- No need for `--turbopack` flag — it's the default bundler in Next.js 16
- Production builds are up to **5× faster**, Fast Refresh up to **10× quicker**
- Switch back to Webpack if needed: `next dev --no-turbopack`

#### Cache Components (`use cache` directive)
- New `use cache` directive replaces the old `experimental.ppr`
- Gives explicit control over what is cached vs. recalculated per request
- `revalidateTag()` and `updateTag()` APIs have been reworked

#### Removed features
- AMP support removed
- `publicRuntimeConfig` and `serverRuntimeConfig` removed
- `experimental.ppr` removed → replaced by Cache Components
- Requires **Node.js 20.9+** and **TypeScript 5.1+**

#### next.config.mjs — remotePatterns
```js
// OLD
remotePatterns: [{ hostname: "images.pexels.com" }]

// NEW (protocol required)
remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }]
```

### 4. React 19.2
- Next.js 16 officially adopts React 19.2
- `ref` is now a regular prop — no more `React.forwardRef` needed
- New hooks available: `use()`, `useFormStatus()`, `useOptimistic()`
- React Compiler support enabled

### 5. moment.js → dayjs
- `moment` is deprecated and unmaintained — removed
- Replace all imports:
```ts
// OLD
import moment from 'moment'
moment(date).format('DD/MM/YYYY')

// NEW
import dayjs from 'dayjs'
dayjs(date).format('DD/MM/YYYY')
```
- For `react-big-calendar` localizer:
```tsx
import dayjs from 'dayjs'
import dayjsLocalizer from 'react-big-calendar/lib/localizers/dayjs'
const localizer = dayjsLocalizer(dayjs)
```

---

## Steps After Cloning This Branch (Windows)

```powershell
# PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

npm install
npm run dev
```

```cmd
:: Command Prompt
rd /s /q node_modules
del package-lock.json

npm install
npm run dev
```

## Or use the official Next.js upgrade codemod (recommended)

```bash
npx @next/codemod@canary upgrade latest
```

This auto-handles params/searchParams async migration and middleware → proxy rename.
