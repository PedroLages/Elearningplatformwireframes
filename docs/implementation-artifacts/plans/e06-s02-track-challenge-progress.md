# E06-S02: Track Challenge Progress — Implementation Plan

## Context

E06-S01 created the challenges infrastructure: Dexie schema (v8), Zustand store, Challenges page with cards, and CreateChallengeDialog. However, `currentProgress` is always 0 — no actual progress is calculated. E06-S02 adds the progress calculation engine that reads from existing data stores (contentProgress, studySessions, study-log) and updates each challenge's progress in real-time.

## Architecture Decision

**Compute-on-load + persist**: Create progress calculation utilities that query source data directly from Dexie/localStorage, then update `currentProgress` on each challenge. Called when the Challenges page mounts. The `currentProgress` field already exists on the Challenge type (planned for this purpose).

Why: The ChallengeCard already renders from `challenge.currentProgress`. Progress only needs recalculation when the user views challenges, not continuously. Persisting avoids recomputation and enables E06-S03 (milestones) to detect threshold crossings.

## Tasks

### Task 1: Progress calculation utilities
**File**: `src/lib/challengeProgress.ts` (new)

Three pure-ish functions that query data sources and return raw progress values:

```typescript
// Completion: count completed items from contentProgress table since challenge.createdAt
async function calculateCompletionProgress(challenge: Challenge): Promise<number>
// → db.contentProgress.where('status').equals('completed').filter(p => p.updatedAt >= challenge.createdAt).count()

// Time: sum studySession durations since challenge.createdAt, convert to hours
async function calculateTimeProgress(challenge: Challenge): Promise<number>
// → db.studySessions.filter(s => s.startTime >= challenge.createdAt && s.endTime).toArray()
// → sum durations / 3600

// Streak: read current streak from study-log localStorage
function calculateStreakProgress(_challenge: Challenge): number
// → getCurrentStreak() from src/lib/studyLog.ts
// Note: streak is global, not scoped to creation date per AC wording

// Dispatcher
async function calculateProgress(challenge: Challenge): Promise<number>
```

**Reuse**: `getCurrentStreak()` from `src/lib/studyLog.ts`, `db` from `src/db/schema.ts`

### Task 2: Store method — refreshAllProgress
**File**: `src/stores/useChallengeStore.ts` (modify)

Add `refreshAllProgress()` method to ChallengeState:
- Iterate over all loaded challenges
- Call `calculateProgress(challenge)` for each
- Update `currentProgress` in state
- If `currentProgress >= targetValue` and no `completedAt`, set `completedAt`
- Batch-persist updated challenges to Dexie via `db.challenges.bulkPut()`
- No optimistic update needed — this is a read-then-write, not user-triggered

### Task 3: Page integration — refresh on mount + expired grouping
**File**: `src/app/pages/Challenges.tsx` (modify)

- Call `refreshAllProgress()` in useEffect on mount (after `loadChallenges()`)
- Split challenges into two groups: **active** (not expired OR expired but completed) and **expired** (deadline passed AND not completed)
- Render active challenges first in the existing grid
- Add an "Expired" collapsible section below with muted styling
- Empty state already exists — no changes needed for AC6

### Task 4: Unit tests for progress calculations
**File**: `src/lib/__tests__/challengeProgress.test.ts` (new)

- Test each calculation type with mocked Dexie data
- Test capping at target value
- Test date filtering (only count data after challenge.createdAt)
- Test edge cases: no data, zero target, expired challenge

### Task 5: Refine ATDD tests
**File**: `tests/e2e/story-e06-s02.spec.ts` (modify)

Adjust selectors and assertions based on actual implementation details (data-testids, text patterns for expired section heading, etc.)

## Key Files

| File | Action |
|------|--------|
| `src/lib/challengeProgress.ts` | Create — progress calculation engine |
| `src/stores/useChallengeStore.ts` | Modify — add `refreshAllProgress()` |
| `src/app/pages/Challenges.tsx` | Modify — call refresh + expired grouping |
| `src/lib/__tests__/challengeProgress.test.ts` | Create — unit tests |
| `tests/e2e/story-e06-s02.spec.ts` | Modify — refine ATDD tests |

## Existing Code to Reuse

- `getCurrentStreak()` from `src/lib/studyLog.ts` — streak calculation
- `db.contentProgress` table — completion queries via Dexie
- `db.studySessions` table — time queries via Dexie
- `parseLocalDate()` from `Challenges.tsx` — date parsing (extract to shared util if needed)
- `createChallenge()` factory — test data
- `createStudySession()` and `createContentProgress()` factories — test data

## Verification

1. **Unit tests**: `npx vitest run src/lib/__tests__/challengeProgress.test.ts`
2. **E2E tests**: `npx playwright test tests/e2e/story-e06-s02.spec.ts --project=chromium`
3. **Manual**: Create challenges of each type, accumulate progress (watch videos, study), navigate to /challenges and verify progress bars update
4. **Build**: `npm run build` — no type errors
