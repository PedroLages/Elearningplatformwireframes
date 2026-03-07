# E06-S01: Create Learning Challenges — Implementation Plan

## Context

Epic 6 introduces gamification beyond daily streaks. Story 6.1 creates the foundation: a Challenges page where users create custom learning challenges with a name, type (completion/time/streak), target metric, and deadline. This data model also serves E06-S02 (progress tracking) and E06-S03 (milestone celebrations), so the schema must be forward-compatible.

All Epic 5 dependencies (streaks) are complete. No blockers.

---

## Task 1: Challenge type + Dexie schema (v8)

**Files:**
- `src/data/types.ts` — add `Challenge` interface
- `src/db/schema.ts` — add `challenges` table at version 8

**Challenge type:**
```typescript
export type ChallengeType = 'completion' | 'time' | 'streak'

export interface Challenge {
  id: string
  name: string                    // 1-60 chars
  type: ChallengeType
  targetValue: number             // > 0
  deadline: string                // ISO 8601 date
  createdAt: string               // ISO 8601 timestamp
  currentProgress: number         // starts at 0 (updated by E06-S02)
  celebratedMilestones: number[]  // [25, 50, 75, 100] (used by E06-S03)
  completedAt?: string            // ISO 8601 (set when 100% reached)
}
```

**Dexie v8:**
```
challenges: 'id, type, deadline, createdAt'
```

Add `challenges: EntityTable<Challenge, 'id'>` to the db type.

**Commit after this task.**

---

## Task 2: Zustand challenge store

**File:** `src/stores/useChallengeStore.ts` (new)

Follow `useBookmarkStore.ts` pattern with `persistWithRetry`:
- `challenges: Challenge[]`, `isLoading`, `error`
- `loadChallenges()` — load all from Dexie, sorted by createdAt desc
- `addChallenge(data)` — generate UUID, set createdAt/currentProgress/celebratedMilestones, persist to Dexie, optimistic update
- `deleteChallenge(id)` — for future use (minimal, optional)

**Commit after this task.**

---

## Task 3: Challenges page + route + navigation

**Files:**
- `src/app/pages/Challenges.tsx` (new) — page component
- `src/app/routes.tsx` — add lazy route at `/challenges`
- `src/app/config/navigation.ts` — add to **Track** group with `Target` icon from lucide-react

**Page structure:**
- `<h1>Challenges</h1>` heading
- "Create Challenge" button (top right)
- Challenge list (cards) — initially empty state: "No challenges yet. Create your first challenge to get started!" with CTA button
- Each card shows: name, type badge, target, deadline, progress bar (at 0% for now)

**Commit after this task.**

---

## Task 4: Create Challenge form (Dialog)

**File:** `src/app/components/challenges/CreateChallengeDialog.tsx` (new)

**UI:** shadcn Dialog containing the form. Fields:
1. **Challenge Name** — `<Input>` with `<Label>`, max 60 chars
2. **Challenge Type** — `<Select>` with 3 options: Completion (videos), Time (hours), Streak (days)
3. **Target Value** — `<Input type="number">` with dynamic label that updates based on type selection (e.g., "Target (videos)")
4. **Deadline** — Date input via `<Input type="date">` (simplest, accessible, native validation support)

**Submit button:** "Create Challenge"

Wire to `useChallengeStore.addChallenge()`. On success: `toast.success('Challenge created')`, close dialog. On error: `toast.error('Failed to create challenge')`.

**User contribution opportunity:** The dynamic label logic for type → unit mapping is a design choice (simple object lookup vs. something more elaborate).

**Commit after this task.**

---

## Task 5: Form validation

**In same file:** `CreateChallengeDialog.tsx`

Validation rules (on submit):
- Name: required, 1-60 characters
- Target: required, must be > 0
- Deadline: required, must be in the future (compare with today's date)
- Type: required (default to first option or force selection)

Display inline error messages below each field. Wrap errors in `<p role="alert">` for screen reader announcement (AC5 — aria-live).

**Commit after this task.**

---

## Task 6: Accessibility polish

**In same file:** `CreateChallengeDialog.tsx` + `Challenges.tsx`

- Verify all `<Label htmlFor>` associations work with `getByLabel()` in tests
- Tab order: Name → Type → Target → Deadline → Create button
- Error messages use `role="alert"` (acts as implicit `aria-live="assertive"`)
- Dialog uses shadcn Dialog which already handles focus trap + Escape key

**Commit after this task (or combine with Task 5 if small).**

---

## Key Files Summary

| File | Action |
|------|--------|
| `src/data/types.ts` | Add `Challenge`, `ChallengeType` |
| `src/db/schema.ts` | Add v8 with `challenges` table |
| `src/stores/useChallengeStore.ts` | New Zustand store |
| `src/app/pages/Challenges.tsx` | New page component |
| `src/app/components/challenges/CreateChallengeDialog.tsx` | New form dialog |
| `src/app/routes.tsx` | Add `/challenges` route |
| `src/app/config/navigation.ts` | Add nav entry in Track group |
| `tests/e2e/story-e06-s01.spec.ts` | Already created (ATDD) |

## Existing Code to Reuse

- `persistWithRetry` from `src/lib/persistWithRetry.ts` — DB write resilience
- `useBookmarkStore` pattern — Zustand + Dexie integration
- shadcn components: Dialog, Input, Select, Label, Button, Card, Badge, Progress
- `toast` from `sonner` — success/error feedback
- Navigation config pattern from `src/app/config/navigation.ts`
- Route pattern from `src/app/routes.tsx` (React.lazy + SuspensePage)

## Verification

1. **ATDD tests:** `npx playwright test tests/e2e/story-e06-s01.spec.ts` — all 10 tests should pass
2. **Build:** `npm run build` — no TypeScript errors
3. **Manual:** Navigate to `/challenges`, create a challenge, verify it persists after page reload
4. **Accessibility:** Tab through the form, submit empty to see error announcements
