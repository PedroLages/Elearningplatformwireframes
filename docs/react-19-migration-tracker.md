# React 19 Migration & Dependency Modernization Tracker

> **Status**: Not started
> **Created**: 2026-02-22
> **Last updated**: 2026-02-22

## Context

LevelUp runs React 18.3.1 with 50+ shadcn/ui components, 20+ Radix UI packages, and a mature dependency tree. React 19 brings forwardRef removal, Context shorthand, the `use()` hook, and the stable React Compiler (v1.0.0, Oct 2025) which auto-memoizes and eliminates manual `useMemo`/`useCallback`. This migration modernizes the full stack while the codebase is in excellent shape: zero deprecated APIs, only 1 forwardRef, and no React.memo usage.

---

## Phase 0: Audit Results (complete)

### Dependency Compatibility Matrix

Verified against npm metadata, GitHub releases, and changelogs (Feb 2026).

#### Production Dependencies

| Package | Current | Target | React 19? | Breaking Changes? | Action |
|---|---|---|---|---|---|
| react / react-dom | 18.3.1 | 19.2.x | N/A | Yes (forwardRef, Context) | Upgrade in Phase 2b |
| @radix-ui/react-* (20 pkgs) | 1.x-2.x | `radix-ui` unified | Yes | Import paths change | shadcn CLI migrate |
| recharts | ^2.15.4 | 3.7.x | Yes (needs react-is override on v2) | Yes: Customized API, accessibilityLayer default | Upgrade in Phase 2c |
| react-day-picker | 8.10.1 | 9.6.x | Yes (v9.4.3+) | Yes: API rewrite v8→v9 | Upgrade in Phase 2c |
| cmdk | 1.1.1 | 1.1.x | Yes (peer dep allows R19) | No | Keep, verify |
| react-hook-form | 7.55.0 | 7.x latest | Yes | No | Keep |
| react-resizable-panels | ^4.6.3 | 4.x latest | Yes | No | Keep |
| embla-carousel-react | 8.6.0 | 8.x latest | Yes | No | Keep |
| input-otp | 1.4.2 | 1.x latest | Yes | No | Keep |
| vaul | 1.1.2 | 1.x latest | Yes | No | Keep |
| sonner | 2.0.3 | 2.x latest | Yes | No | Keep |
| motion | 12.23.24 | 12.x latest | Yes (native R19 support) | No | Keep |
| react-markdown | ^10.1.0 | 10.x latest | Yes | No | Keep |
| react-pdf / pdfjs-dist | ^10.4.0 / ^5.4 | 10.x / 5.x latest | Yes (supports R16.8+) | No | Keep |
| next-themes | 0.4.6 | 0.4.x | Yes | No | Keep (works fine in Vite) |
| date-fns | 3.6.0 | 4.x | N/A (no React) | Yes: ESM-only, tree-shaking | Upgrade in Phase 2a |
| lucide-react | ^0.487.0 | latest | Yes | No | npm update |
| zustand | ^5.0.11 | 5.x latest | Yes | No | Keep |
| react-router | 7.13.0 | 7.x latest | Yes (built for R18→R19 bridge) | No | Keep |
| ai / @ai-sdk/* | ^2.2.37 / ^3.x | latest | Yes (actively maintained) | No | npm update |
| dexie | ^4.3.0 | 4.x latest | N/A (no React dep) | No | Keep |
| class-variance-authority | 0.7.1 | 0.7.x | N/A | No | Keep |
| clsx | 2.1.1 | 2.x | N/A | No | Keep |
| tailwind-merge | 3.2.0 | 3.x | N/A | No | Keep |

#### Dev Dependencies

| Package | Current | Target | React 19? | Action |
|---|---|---|---|---|
| @vitejs/plugin-react | 4.7.0 | 4.7.x + compiler | Yes | Add babel-plugin-react-compiler |
| @testing-library/react | ^16.3.2 | 16.x | Yes | Keep |
| @storybook/react-vite | ^10.2.8 | 10.x | Yes | Keep |
| vitest / @vitest/* | ^4.0.18 | 4.x | Yes | Keep |
| tailwindcss / @tailwindcss/vite | 4.1.12 | 4.x | N/A | Keep |
| typescript | ^5.9.3 | 5.x | N/A | Keep |
| **NEW** babel-plugin-react-compiler | - | 1.0.0 | Required | Install in Phase 2d |

#### Blockers: NONE

All dependencies either already support React 19 or have clear upgrade paths.

### Codebase Audit Summary

#### React API Surface (170 source files scanned)

| Pattern | Count | Files | Migration Impact |
|---|---|---|---|
| `forwardRef` | 1 | button.tsx | Trivial (handled by shadcn regeneration) |
| `useContext` | 7 | 6 shadcn/ui files | Optional `use()` migration |
| `React.memo` | 0 | - | None needed |
| `useMemo` | 29 | 11 files | Compiler handles; remove post-2d |
| `useCallback` | 66 | 11 files | Compiler handles; remove post-2d |
| `Context.Provider` | 9 | 6 shadcn/ui files | Handled by shadcn regeneration |
| `useRef` | 44 | 11 files | No change needed |
| `React.lazy` | 11 | routes.tsx | No change needed |
| `useEffect` | 88 | 29 files | No change needed (side effects, not data fetching) |
| Deprecated APIs | 0 | - | Clean |

#### Hotspot Files (most memoization to remove post-compiler)

1. `src/app/components/figma/VideoPlayer.tsx` — 24 useCallback, 15 useRef
2. `src/app/components/figma/PdfViewer.tsx` — 12 useCallback
3. `src/app/pages/LessonPlayer.tsx` — 11 useCallback, 3 useMemo
4. `src/app/pages/MyClass.tsx` — 7 useMemo
5. `src/app/pages/Courses.tsx` — 5 useMemo

#### shadcn/ui Component Inventory

- **46 components** in `src/app/components/ui/`
- **27 use Radix UI** primitives (will benefit from unified package migration)
- **1 uses forwardRef** (button.tsx only)
- **6 use Context.Provider** (carousel, chart, form, sidebar, toggle-group, tooltip)
- **Custom `data-slot` attributes** on all components (LevelUp-specific, preserved during regen)
- **shadcn config**: `new-york` style, RSC disabled, Tailwind v4

#### next-themes Usage (5 files — keep as-is)

- `src/app/App.tsx` — ThemeProvider wrapper
- `src/app/pages/Settings.tsx` — useTheme for toggle
- `src/app/components/Layout.tsx` — useTheme for header
- `src/app/pages/Reports.tsx` — resolvedTheme for charts
- `src/app/components/ui/sonner.tsx` — useTheme for toast theming

#### Recharts Usage (minimal — 3 files)

- `src/app/pages/Reports.tsx` — BarChart, PieChart, LineChart
- `src/app/components/charts/ProgressChart.tsx` — LineChart
- `src/app/components/ui/chart.tsx` — shadcn wrapper (`RechartsPrimitive`)
- No `Customized` component or `CategoricalChartState` usage (clean for v3 migration)

#### Bundle Splitting (already configured)

`vite.config.ts:88-133` has `manualChunks` splitting: vendor-react, vendor-router, vendor-radix, vendor-charts, vendor-pdf, vendor-motion, vendor-ai, vendor-data, vendor-markdown, vendor-misc.

---

## Phase 2a: Pre-Migration (safe, no React upgrade)

> **Status**: Not started

These changes are independent of React 19 and establish a green baseline.

### 2a.1 — Upgrade date-fns v3 → v4

- [ ] Run `npm install date-fns@4`
- [ ] Check `src/app/components/ui/calendar.tsx` for any import changes
- [ ] Verify: date-fns v4 is ESM-only with better tree-shaking; named imports stay the same
- **Risk**: Low — date-fns v4 has no API changes for our usage patterns
- **Rollback**: `npm install date-fns@3.6.0`

### 2a.2 — Update lucide-react

- [ ] Run `npm install lucide-react@latest`
- [ ] Verify icon imports still resolve (names occasionally change)
- **Risk**: Low
- **Rollback**: `npm install lucide-react@0.487.0`

### 2a.3 — npm update (minor/patch bumps)

- [ ] Run `npm update` to pull latest patches for all `^` ranges
- [ ] This covers motion, ai SDK, react-pdf, react-resizable-panels, etc.
- **Risk**: Low

### 2a.4 — Capture baseline metrics

- [ ] `npm run build` — record chunk sizes and any warnings
- [ ] `npm run test:unit` — ensure all tests pass
- [ ] `npm run test:e2e` — ensure all E2E tests pass
- [ ] `npm run storybook && npm run build-storybook` — verify stories render
- [ ] Commit clean baseline: `git commit -m "chore: pre-migration baseline"`

---

## Phase 2b: React 19 Core Upgrade

> **Status**: Not started
> **Depends on**: Phase 2a complete

### 2b.1 — Upgrade React

- [ ] Run `npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19`
- [ ] Verify `src/main.tsx` `createRoot` still works (it will — already modern API)
- **Risk**: Medium — potential runtime warnings from libraries with outdated peer deps
- **Rollback**: `npm install react@18.3.1 react-dom@18.3.1 @types/react@18 @types/react-dom@19`

### 2b.2 — Migrate Radix UI to unified package

- [ ] Run `npx shadcn@latest migrate radix`
  - Transforms all `@radix-ui/react-*` imports → `radix-ui` unified package
  - Adds `radix-ui` to dependencies
- [ ] Remove all individual `@radix-ui/react-*` packages from package.json (20+ entries)
- [ ] Update `vite.config.ts:100-101` manualChunks: change `@radix-ui/` match to `radix-ui`
- **Risk**: Low — shadcn CLI handles this automatically
- **Rollback**: `git checkout -- src/app/components/ui/ package.json`

### 2b.3 — Regenerate shadcn/ui components for React 19

- [ ] Run `npx shadcn@latest add --all --overwrite`
  - This regenerates all 46 components targeting React 19
  - forwardRef removed from button.tsx
  - Context.Provider → Context shorthand in carousel, chart, form, sidebar, toggle-group
- [ ] **CRITICAL**: Re-apply `data-slot` attributes if lost (these are LevelUp-specific)
- [ ] **CRITICAL**: Check for custom modifications in these files that may get overwritten:
  - `src/app/components/ui/card.tsx` — has CardAction export
  - `src/app/components/ui/slider.tsx` — has custom useMemo logic
  - `src/app/components/ui/sidebar.tsx` — has custom useSidebar hook, localStorage
- [ ] Alternative safer approach: Only regenerate components that use forwardRef/Provider:
  ```
  npx shadcn@latest add button carousel chart form sidebar toggle-group tooltip --overwrite
  ```
- **Risk**: Medium — custom modifications may be lost
- **Rollback**: `git checkout -- src/app/components/ui/`

### 2b.4 — Fix any React 19 breaking changes

- [ ] Run `npm run typecheck` — fix any type errors from @types/react@19
- [ ] Run `npm run build` — fix any build errors
- [ ] Run `npm run test:unit` — fix any test failures
- [ ] Common issue: `ref` is now a regular prop — check for `ref` conflicts in component interfaces
- **Risk**: Low-Medium

### 2b.5 — Verify and commit

- [ ] `npm run ci` (typecheck + lint + format check + build + unit tests)
- [ ] `npm run test:e2e`
- [ ] Commit: `feat: upgrade to React 19 with unified Radix UI`

---

## Phase 2c: Ecosystem Upgrades (after React 19 stable)

> **Status**: Not started
> **Depends on**: Phase 2b complete
> **Can run in parallel with**: Phase 2d

### 2c.1 — Upgrade recharts 2 → 3

- [ ] Run `npm install recharts@3`
- [ ] Check `src/app/pages/Reports.tsx` for breaking changes:
  - `accessibilityLayer` is now `true` by default (review behavior)
  - No `Customized` or `CategoricalChartState` usage in our code (clean)
- [ ] Check `src/app/components/ui/chart.tsx` — uses `RechartsPrimitive` namespace import
- [ ] Check `src/app/components/charts/ProgressChart.tsx`
- [ ] Run unit tests for Reports page
- **Risk**: Medium — Recharts 3 has real breaking changes but our usage is simple
- **Rollback**: `npm install recharts@2.15.4`

### 2c.2 — Upgrade react-day-picker 8 → 9

- [ ] Run `npm install react-day-picker@9`
- [ ] Update `src/app/components/ui/calendar.tsx` — v9 has API changes
  - Or regenerate: `npx shadcn@latest add calendar --overwrite`
- [ ] v9 drops forwardRef internally, uses new prop names
- [ ] Review https://daypicker.dev/upgrading migration guide
- **Risk**: Medium — API changes require shadcn component update
- **Rollback**: `npm install react-day-picker@8.10.1`

### 2c.3 — Verify ecosystem stability

- [ ] `npm run ci`
- [ ] `npm run test:e2e`
- [ ] `npm run storybook` — verify all stories render
- [ ] Commit: `feat: upgrade recharts 3 and react-day-picker 9`

---

## Phase 2d: React Compiler Integration

> **Status**: Not started
> **Depends on**: Phase 2b complete
> **Can run in parallel with**: Phase 2c

### 2d.1 — Install React Compiler

- [ ] Run `npm install --save-dev --save-exact babel-plugin-react-compiler@1.0.0`
- [ ] Update `vite.config.ts:80`:
  ```typescript
  react({
    babel: {
      plugins: [['babel-plugin-react-compiler', {}]],
    },
  }),
  ```
- **Risk**: Low — compiler is additive, doesn't break existing code

### 2d.2 — Verify compiler works

- [ ] `npm run dev` — check console for compiler warnings
- [ ] `npm run build` — verify production build succeeds
- [ ] `npm run test:unit` — verify all tests pass
- [ ] Check DevTools for `Memo` badges on components (compiler auto-memoizes)

### 2d.3 — Remove manual memoization (optional, improves readability)

- [ ] Remove unnecessary `useCallback` wrappers (66 total across 11 files):
  - `src/app/components/figma/VideoPlayer.tsx` — 24 useCallback
  - `src/app/components/figma/PdfViewer.tsx` — 12 useCallback
  - `src/app/pages/LessonPlayer.tsx` — 11 useCallback
  - `src/app/components/figma/SearchCommandPalette.tsx` — 3
  - `src/app/components/notes/NoteEditor.tsx` — 3
  - `src/app/components/figma/ChapterProgressBar.tsx` — 2
  - `src/app/components/Layout.tsx` — 2
  - `src/app/components/ui/carousel.tsx` — 4 (shadcn)
  - `src/app/components/ui/sidebar.tsx` — 2 (shadcn)
  - `src/hooks/useCourseCardPreview.ts` — 2
  - `src/hooks/useHoverPreview.ts` — 1
- [ ] Remove unnecessary `useMemo` wrappers (29 total across 11 files):
  - `src/app/pages/MyClass.tsx` — 7
  - `src/app/pages/Courses.tsx` — 5
  - `src/app/pages/Library.tsx` — 3
  - `src/app/pages/LessonPlayer.tsx` — 3
  - `src/app/components/figma/SearchCommandPalette.tsx` — 2
  - `src/app/components/figma/TranscriptPanel.tsx` — 2
  - `src/app/components/ui/carousel.tsx` — 2 (shadcn)
  - `src/app/components/ui/sidebar.tsx` — 2 (shadcn)
  - `src/app/components/ui/chart.tsx` — 1 (shadcn)
  - `src/app/components/ui/slider.tsx` — 1 (shadcn)
  - `src/hooks/useHoverPreview.ts` — 1
- [ ] **Note**: Only remove memoization from custom files. Leave shadcn/ui files as-is (they get regenerated).
- **Risk**: Low — compiler already handles optimization; removal is cosmetic
- **Rollback**: `git checkout -- <file>`

### 2d.4 — Benchmark and commit

- [ ] `npm run build` — compare chunk sizes to Phase 2a baseline
- [ ] Run Lighthouse on key pages — compare performance scores
- [ ] Commit: `feat: enable React Compiler, remove manual memoization`

---

## Phase 2e: Final Validation

> **Status**: Not started
> **Depends on**: Phases 2c and 2d complete

### Full Test Suite

- [ ] `npm run typecheck` — zero type errors
- [ ] `npm run lint` — zero lint errors
- [ ] `npm run build` — successful, compare bundle sizes to baseline
- [ ] `npm run test:unit` — all passing
- [ ] `npm run test:e2e` — all passing
- [ ] `npm run storybook && npm run build-storybook` — all stories render

### Manual Smoke Test

- [ ] Overview page — charts render, data loads
- [ ] My Class page — course cards, filters work
- [ ] Courses page — tag filtering, search
- [ ] Lesson Player — video playback, progress, notes, transcript
- [ ] Reports — all chart types render correctly
- [ ] Settings — theme toggle (next-themes) works
- [ ] Messages — AI chat works (AI SDK)
- [ ] Sidebar — collapse/expand, mobile sheet, tablet behavior
- [ ] Dark mode — all pages render correctly

### Bundle Size Comparison

- [ ] Record final chunk sizes vs Phase 2a baseline
- [ ] Expected: vendor-radix chunk smaller (unified package), slight reduction from compiler

---

## Phase Dependencies

```
Phase 2a (pre-migration) ─────────────────────────────┐
                                                       v
Phase 2b (React 19 core) ─────────────────────────────┐
                                                       v
Phase 2c (ecosystem) + Phase 2d (compiler) ──── parallel ──┐
                                                            v
                                                     Phase 2e (validation)
```

- 2a must complete before 2b (establishes baseline)
- 2b must complete before 2c or 2d (React 19 is prerequisite)
- 2c and 2d can run in parallel (independent concerns)
- 2e runs after both 2c and 2d complete

---

## Rollback Strategy

Each phase is independently reversible:
- **Nuclear rollback**: `git reset --hard <pre-migration-commit>` + `npm install`
- **Per-phase rollback**: Each phase ends with a commit; `git revert` any phase
- **Package rollback**: Specific `npm install package@version` commands listed per step

---

## Key References

- [Radix UI unified package migration](https://ui.shadcn.com/docs/changelog/2026-02-radix-ui)
- [shadcn/ui React 19 guide](https://ui.shadcn.com/docs/react-19)
- [React Compiler v1.0 announcement](https://react.dev/blog/2025/10/07/react-compiler-1)
- [React Compiler installation](https://react.dev/learn/react-compiler/installation)
- [Recharts 3.0 migration guide](https://github.com/recharts/recharts/wiki/3.0-migration-guide)
- [react-day-picker v9 upgrade guide](https://daypicker.dev/upgrading)
- [React 19 changelog](https://react.dev/blog/2025/10/01/react-19-2)
