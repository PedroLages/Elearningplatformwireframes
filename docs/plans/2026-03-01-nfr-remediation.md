# NFR Remediation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all actionable issues from the Epic 3 NFR assessment to achieve clean CI gates (0 TS errors, 0 ESLint errors, stable test suite, reduced bundle warnings)

**Architecture:** Fix TypeScript type errors via TipTap module augmentation, resolve ESLint regex false-positive, harden Vitest config for CI stability, record coverage baseline, and reduce bundle chunk sizes via TipTap extension splitting.

**Tech Stack:** TypeScript, TipTap/@tiptap/core, Vitest, Vite rollup config, ESLint

---

## Status Update (Pre-Planning Verification)

Two of the original 5 "high priority" NFR issues are **already resolved**:

- **CI Pipeline** — Fully implemented (`.github/workflows/ci.yml` + `test.yml`)
- **CSP** — Fully implemented (`index.html` meta tag with Unsplash, YouTube, blob allowlists)

Remaining issues recalibrated to current state:

| # | Issue | Count | Blocks CI? |
|---|-------|-------|------------|
| 1 | TypeScript `Storage` type collision in TipTap editor.storage | 4 errors | Yes (typecheck) |
| 2 | TypeScript null mock type in frameCapture.test.ts | 1 error | Yes (typecheck) |
| 3 | ESLint `no-control-regex` in sanitizeFilename | 1 error | Yes (lint) |
| 4 | Vitest no testTimeout/hookTimeout — CI flakiness risk | config gap | Yes (unit-tests) |
| 5 | NoteEditor chunk 823KB (Vite warns >500KB) | 1 chunk | No (warning only) |
| 6 | Vendor index chunk 799KB | 1 chunk | No (warning only) |
| 7 | No coverage threshold set | config gap | No |

---

### Task 1: Fix TipTap Storage Type Errors (4 TS errors)

**Files:**
- Modify: `src/app/components/notes/frame-capture/FrameCaptureExtension.ts:10-16`

**Context:** TipTap's `editor.storage` is typed as the DOM `Storage` interface by default. The `FrameCaptureExtension` defines custom storage via `addStorage()` but doesn't augment the TipTap `Storage` type, so accessing `editor.storage.frameCapture` causes TS2339 in `FrameCaptureView.tsx:47,50` and `NoteEditor.tsx:519,524`.

**Step 1: Add Storage module augmentation**

In `src/app/components/notes/frame-capture/FrameCaptureExtension.ts`, the existing module augmentation at lines 10-16 only augments `Commands`. Add a parallel `Storage` augmentation in the same `declare module` block:

```typescript
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    frameCapture: {
      insertFrameCapture: (attrs: FrameCaptureAttributes) => ReturnType
    }
  }
  // Fix TS2339: tell TypeScript that editor.storage has a frameCapture key
  interface Storage {
    frameCapture: {
      onSeek: ((timestamp: number) => void) | null
    }
  }
}
```

**Step 2: Run typecheck to verify 4 errors resolved**

Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"`
Expected: `1` (only the frameCapture.test.ts mock error remains)

**Step 3: Commit**

```bash
git add src/app/components/notes/frame-capture/FrameCaptureExtension.ts
git commit -m "fix(types): augment TipTap Storage interface for frameCapture

Adds module augmentation for @tiptap/core Storage interface so
editor.storage.frameCapture is properly typed. Resolves 4 TS2339 errors
in FrameCaptureView.tsx and NoteEditor.tsx."
```

---

### Task 2: Fix frameCapture.test.ts Mock Type Error (1 TS error)

**Files:**
- Modify: `src/lib/__tests__/frameCapture.test.ts:173`

**Context:** At line 191, `canvas.getContext.mockReturnValue(null)` fails because TypeScript infers `getContext`'s return type from the mock factory `vi.fn(() => ctx)` as `{ drawImage: Mock }`, which doesn't accept `null`. Fix: widen the mock's type at creation.

**Step 1: Widen the getContext mock return type**

In `src/lib/__tests__/frameCapture.test.ts`, change line 173 from:

```typescript
      getContext: vi.fn(() => ctx),
```

to:

```typescript
      getContext: vi.fn((): typeof ctx | null => ctx),
```

This tells TypeScript the mock can return either the context object OR null, which is what the real `getContext` does.

**Step 2: Run typecheck to verify 0 errors remain**

Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"`
Expected: `0`

**Step 3: Run the frameCapture tests to verify no regressions**

Run: `npx vitest run src/lib/__tests__/frameCapture.test.ts`
Expected: All 17 tests pass including "rejects when canvas context is null"

**Step 4: Commit**

```bash
git add src/lib/__tests__/frameCapture.test.ts
git commit -m "fix(test): widen getContext mock type to accept null

The mock return type was inferred too narrowly, preventing
mockReturnValue(null) from compiling. Resolves the last TS2345 error."
```

---

### Task 3: Fix ESLint no-control-regex Error (1 ESLint error)

**Files:**
- Modify: `src/lib/noteExport.ts:182`

**Context:** The `sanitizeFilename` function at line 182 uses `/[\x00-\x1f\x7f<>:"/\\|?*]/g` to strip control characters from filenames. This is **intentional behavior** verified by a passing test (`strips control characters`). The ESLint `no-control-regex` rule flags it as an error because control characters in regex are usually accidental — but here it's the whole point.

**Step 1: Add targeted eslint-disable with explanation**

In `src/lib/noteExport.ts`, change line 182 from:

```typescript
    .replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g, '-') // Replace illegal chars
```

to:

```typescript
    // eslint-disable-next-line no-control-regex -- Intentional: strip ASCII control chars (0x00-0x1F, 0x7F) from filenames
    .replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g, '-')
```

**Step 2: Run ESLint to verify 0 errors remain**

Run: `npx eslint src/lib/noteExport.ts`
Expected: Only warnings (no-explicit-any), zero errors

**Step 3: Run the sanitizeFilename tests to confirm behavior unchanged**

Run: `npx vitest run src/lib/__tests__/noteExport.test.ts`
Expected: All tests pass including "strips control characters"

**Step 4: Commit**

```bash
git add src/lib/noteExport.ts
git commit -m "fix(lint): suppress intentional control-regex in sanitizeFilename

The regex intentionally strips ASCII control characters from filenames.
Added eslint-disable with explanation rather than changing the regex."
```

---

### Task 4: Add Vitest Timeout Configuration for CI Stability

**Files:**
- Modify: `vite.config.ts:94-106`

**Context:** All 366 tests pass locally in ~14s, but CI runners (cold GitHub Actions) can be 3-5x slower. The 7 Dexie/IndexedDB test files do `vi.resetModules()` + dynamic re-imports in `beforeEach`, which is expensive. Without explicit timeouts, Vitest defaults to 5000ms per test / 10000ms per hook — tight for CI. The NFR report documented 23 timeouts from a prior run.

**Step 1: Add testTimeout and hookTimeout**

In `vite.config.ts`, update the test config block (lines 94-106) from:

```typescript
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/**/*.stories.*'],
      }
    }]
  }
```

to:

```typescript
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    testTimeout: 10_000,
    hookTimeout: 15_000,
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/**/*.stories.*'],
      }
    }]
  }
```

**Why these values:** 10s test / 15s hook gives 2x headroom over local timing while still catching genuinely hung tests. The `beforeEach` hooks with `vi.resetModules()` + Dexie re-init are the bottleneck.

**Step 2: Run tests to verify no regressions**

Run: `npx vitest run --project unit`
Expected: All 366 tests pass

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "fix(test): add explicit timeouts to prevent CI flakiness

testTimeout: 10s, hookTimeout: 15s. The Dexie/IndexedDB test files do
vi.resetModules() in beforeEach which can exceed default 5s on cold CI."
```

---

### Task 5: Record Coverage Baseline and Set Threshold

**Files:**
- Modify: `vite.config.ts:94-106`

**Context:** The last coverage measurement was 64.85% from Epic 1. Epic 3 added ~80 tests. Current coverage is unknown. Recording a baseline and setting a threshold prevents regression.

**Step 1: Run coverage and record the number**

Run: `npx vitest run --project unit --coverage`
Expected: Coverage report printed. Note the `% Lines` value.

**Step 2: Add coverage config to vitest**

In `vite.config.ts`, add a `coverage` block inside the test config. The exact threshold depends on the Step 1 result. Use the measured value minus 2% as the threshold floor (to avoid false failures from refactors):

```typescript
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    testTimeout: 10_000,
    hookTimeout: 15_000,
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 60,   // Replace with (measured - 2), rounded down
      },
    },
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/**/*.stories.*'],
      }
    }]
  }
```

**Step 3: Re-run with coverage to verify threshold passes**

Run: `npx vitest run --project unit --coverage`
Expected: All tests pass, coverage above threshold

**Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "chore: set coverage threshold baseline at N%

Recorded current coverage and set vitest threshold to prevent regression.
Prior baseline was 64.85% (Epic 1)."
```

---

### Task 6: Reduce NoteEditor Bundle Chunk (823KB → target <500KB)

**Files:**
- Modify: `src/app/components/notes/NoteEditor.tsx:1-30`
- Modify: `vite.config.ts` (rollupOptions)

**Context:** The NoteEditor chunk is 823KB because all TipTap extensions, lowlight (with 6 language grammars), and emoji data are statically imported. The NoteEditor IS already lazy-loaded at the route level (LessonPlayer is `React.lazy`), so it's a separate chunk — but Vite warns about chunks >500KB. The main cost centers are:
- TipTap core + StarterKit + 14 extensions (~300KB)
- lowlight + highlight.js language grammars (~150KB)
- Emoji data (~100KB)
- Other extension UI (~270KB)

**Approach:** Use Vite's `build.rollupOptions.output.manualChunks` to split the NoteEditor's heavy dependencies into separate parallel-loaded chunks. This doesn't change any runtime behavior — Vite will load them in parallel when the route is visited.

**Step 1: Add manualChunks to vite.config.ts**

Add a `build` section to `vite.config.ts` (after the `test` block):

```typescript
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split TipTap extensions into their own chunk
          if (id.includes('@tiptap/')) {
            return 'tiptap'
          }
          // Split lowlight + highlight.js into their own chunk
          if (id.includes('lowlight') || id.includes('highlight.js')) {
            return 'syntax-highlight'
          }
        },
      },
    },
  },
```

**Step 2: Run build to verify chunk sizes**

Run: `npm run build 2>&1 | grep -E "kB|warning"`
Expected: No single chunk >500KB (tiptap, syntax-highlight, and NoteEditor each smaller)

**Step 3: Run dev server smoke test**

Run: `npm run dev` — open the app, navigate to a lesson, verify the NoteEditor loads and is functional. Kill the server.

**Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "perf: split NoteEditor chunk via manualChunks

Moves TipTap extensions and lowlight/highlight.js into separate parallel
chunks. Reduces the largest chunk from 823KB to under 500KB.
No runtime behavior change — all chunks load in parallel on route visit."
```

---

### Task 7: Final Verification — Full CI Simulation

**Files:** None (verification only)

**Step 1: Run the full local CI check**

Run: `npm run ci`
Expected: All 4 gates pass — typecheck (0 errors), lint (0 errors), format, build (0 warnings >500KB), unit tests (366/366 pass)

**Step 2: Run build and verify chunk sizes**

Run: `npm run build 2>&1`
Expected: No chunks trigger the 500KB Vite warning

**Step 3: Commit all together if any uncommitted changes remain**

If there are uncommitted changes from adjustments during verification:

```bash
git add -A
git commit -m "chore: final adjustments from NFR remediation verification"
```

---

## Summary

| Task | What | Effort | CI Impact |
|------|------|--------|-----------|
| 1 | TipTap Storage type augmentation | ~5 min | Fixes 4 TS errors |
| 2 | frameCapture.test.ts mock type | ~5 min | Fixes 1 TS error |
| 3 | ESLint control-regex disable | ~5 min | Fixes 1 ESLint error |
| 4 | Vitest timeout config | ~5 min | Prevents 23 CI timeouts |
| 5 | Coverage baseline + threshold | ~10 min | Adds coverage gate |
| 6 | NoteEditor chunk splitting | ~15 min | Eliminates bundle warning |
| 7 | Full CI simulation | ~5 min | Validates all fixes |
| **Total** | | **~50 min** | **Clean CI gates** |

**Expected outcome:** `npm run ci` passes with 0 errors, 0 warnings, 366/366 tests, coverage threshold set, no bundle chunks >500KB.
