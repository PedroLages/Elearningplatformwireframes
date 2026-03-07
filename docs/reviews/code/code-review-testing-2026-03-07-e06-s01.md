# Test Coverage Review: E06-S01 — Create Learning Challenges (Round 2)

**Date**: 2026-03-07
**Reviewer**: Test Coverage Agent

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Form displays name, type, target, deadline | None | `story-e06-s01.spec.ts:42` | Covered |
| 2 | Type selection updates target metric label | None | `story-e06-s01.spec.ts:54,60,66` | Covered |
| 3 | Valid submission saves to IndexedDB; success toast | `useChallengeStore.test.ts:43,66` | `story-e06-s01.spec.ts:73` | Covered |
| 4 | Invalid inputs show inline errors; form not submitted | None | `story-e06-s01.spec.ts:129,150,171,191` | Covered |
| 5 | Labels, aria-live errors, keyboard navigable | None | `story-e06-s01.spec.ts:210,234` | Partial |

**Coverage**: 4/5 ACs fully covered | 1 partial | 0 gaps

## Findings

### High Priority

- **`story-e06-s01.spec.ts:210` (confidence: 87)**: Keyboard nav test doesn't Tab to Cancel/Submit buttons — AC5 says "fully keyboard-navigable."
- **`story-e06-s01.spec.ts:234` (confidence: 82)**: aria-live test doesn't assert `aria-invalid` on inputs — regression could remove it silently.
- **`story-e06-s01.spec.ts:33` (confidence: 80)**: No IndexedDB cleanup between tests — AC3 writes a challenge that persists into subsequent tests.

### Medium

- **`story-e06-s01.spec.ts:19` (confidence: 78)**: `.first()` positional selector for dialog button — fragile if page structure changes.
- **`story-e06-s01.spec.ts:94` (confidence: 76)**: Toast assertion uses internal Sonner `[data-sonner-toast]` attribute — not stable across upgrades.
- **No challenge factory** (confidence: 75): Every other domain entity has a factory; challenges use inline objects.
- **`useChallengeStore.test.ts:6` (confidence: 74)**: DB cleanup relies on module singleton — fragile if `vi.resetModules()` added later.
- **`story-e06-s01.spec.ts:12` (confidence: 72)**: `.catch(() => {})` in helper silently swallows page load failures.

### Nits

- **`story-e06-s01.spec.ts:57` (confidence: 65)**: Label regex `/target.*videos/i` slightly over-permissive.
- **`useChallengeStore.test.ts:82` (confidence: 62)**: Fake timers not restored in finally block.
- **`schema.test.ts:201` (confidence: 58)**: Inline `makeChallenge()` duplicates shape — should use shared factory.

### Edge Cases Not Tested

1. Name at exactly 60 chars (valid) vs 61 chars (should error)
2. Today's date as deadline (boundary — implementation rejects it)
3. Non-numeric target input (e.g., "abc")
4. Dialog state reset on dismiss without submit
5. IndexedDB persistence failure at E2E layer

---
ACs: 4/5 fully covered, 1 partial | Findings: 11 | High: 3 | Medium: 5 | Nits: 3
