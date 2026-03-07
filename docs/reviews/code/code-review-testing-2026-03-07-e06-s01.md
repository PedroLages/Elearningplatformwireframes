# Test Coverage Review: E06-S01 — Create Learning Challenges

**Date**: 2026-03-07
**Reviewer**: Test Coverage Agent (Opus)

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Form displays name, type, target value, and deadline fields | None | `tests/e2e/story-e06-s01.spec.ts:42` | Covered |
| 2 | Type selection updates target metric label (videos/hours/days) | None | `tests/e2e/story-e06-s01.spec.ts:54,60,66` | Covered |
| 3 | Valid submission saves to IndexedDB with unique ID, timestamp, progress=0; toast | None | `tests/e2e/story-e06-s01.spec.ts:73` | Partial |
| 4 | Invalid inputs show inline errors; form not submitted | None | `tests/e2e/story-e06-s01.spec.ts:103,124,143` | Partial |
| 5 | Labels, aria-live errors, keyboard navigation | None | `tests/e2e/story-e06-s01.spec.ts:162,178` | Partial |

**Coverage**: 2/5 ACs fully covered | 3 partial | 0 gaps

## Findings

### High Priority

- **`story-e06-s01.spec.ts:73` (confidence: 92)**: AC3 test doesn't verify IndexedDB fields (id, createdAt, currentProgress=0). Optimistic update means UI shows the challenge even if persistence fails.

- **`story-e06-s01.spec.ts:124` (confidence: 90)**: AC4 only tests target=0, not negative values. The AC explicitly says "zero or negative."

- **`story-e06-s01.spec.ts:178` (confidence: 88)**: AC5 aria-live test asserts `role="alert"` count=4 but doesn't verify `aria-live` attribute directly. Count-based assertion is fragile.

- **`story-e06-s01.spec.ts:162` (confidence: 85)**: Keyboard navigation test only tabs from field 1→2. Doesn't verify full Tab sequence through all fields to submit button.

- **`schema.test.ts` (confidence: 85)**: No CRUD tests for `challenges` table. Every other table has a describe block with add/retrieve/query tests.

### Medium

- **`story-e06-s01.spec.ts:34` (confidence: 78)**: No `indexedDB.clearStore('challenges')` between tests. AC3 creates a real challenge that persists for subsequent tests.

- **`story-e06-s01.spec.ts:19` (confidence: 75)**: `.first()` positional selector for dual "Create Challenge" buttons is fragile. Use `data-testid` instead.

- **`story-e06-s01.spec.ts:84` (confidence: 74)**: No assertion that deadline value is actually accepted before submitting.

- **`story-e06-s01.spec.ts:103` (confidence: 72)**: Missing type selection validation test — the empty type path exists in code but has no test.

### Nits

- **`story-e06-s01.spec.ts:12` (confidence: 65)**: `goToChallenges` swallows `waitForSelector` error with `.catch(() => {})`.
- **`story-e06-s01.spec.ts:94-95` (confidence: 60)**: `[data-sonner-toast]` is internal Sonner attribute. Prefer `getByRole('status')`.
- **`schema.test.ts` (confidence: 55)**: Missing `makeChallenge()` factory for future v8 describe block.

## Edge Cases Not Tested

1. Name at exact 60-char boundary (valid) vs 61-char (invalid)
2. Non-numeric target input (alphabetic → NaN)
3. Today's date as deadline (boundary condition)
4. Dialog form state reset after dismiss without submitting
5. IndexedDB persistence failure (rollback path)
6. `loadChallenges` error state (silently swallowed in UI)

## Summary

ACs: 2/5 fully covered | 3 partial | Findings: 12 | High: 5 | Medium: 4 | Nits: 3
