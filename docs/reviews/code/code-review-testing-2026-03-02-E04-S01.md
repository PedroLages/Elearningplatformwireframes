# Test Coverage Review: E04-S01 — Mark Content Completion Status

**Date:** 2026-03-02
**Reviewer:** code-review-testing agent

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Status selector with 3 options and per-option color coding | None | `story-e04-s01.spec.ts:62-76` | Partial — color coding not asserted |
| 2 | Optimistic update + IndexedDB persistence + rollback on failure | None | `story-e04-s01.spec.ts:79-91` | Partial — no persistence/rollback test |
| 3 | Color-coded indicators + WCAG 2.1 AA + text label/tooltip | None | `story-e04-s01.spec.ts:94-105` | Partial — no color/contrast assertion |
| 4 | Auto-complete parent chapter | None | `story-e04-s01.spec.ts:108-123` | Covered |
| 5 | Auto-revert parent chapter | None | `story-e04-s01.spec.ts:126-148` | Partial — only tests revert to in-progress, not not-started |

**Coverage**: 1/5 ACs fully covered | 4 partial

## Findings

### High Priority

**H1 (confidence: 95):** AC2 rollback on IndexedDB failure has no test. The `catch` branch at `useContentProgressStore.ts:113-116` is entirely untested.

**H2 (confidence: 92):** AC2 IndexedDB persistence of cascade records untested. No reload-and-verify in E2E.

**H3 (confidence: 90):** AC3 color assertion entirely absent. Tests check `data-status` attribute but not visual color/icon.

**H4 (confidence: 88):** AC1 color coding of selector options not asserted. Only text labels verified.

**H5 (confidence: 82):** AC5 revert to "Not Started" not tested. Only "In Progress" revert exercised. The `deriveModuleStatus` all-not-started path is untested.

### Medium

**M1 (confidence: 78):** Schema test does not exercise `contentProgress` table CRUD — only existence.

**M2 (confidence: 75):** `loadCourseProgress` has no unit test. Error branch, loading state transitions untested.

**M3 (confidence: 72):** `beforeEach` uses raw IndexedDB API instead of project's `indexedDB` fixture.

**M4 (confidence: 70):** Zustand store state not explicitly cleared between E2E tests. `loadCourseProgress` merge pattern could leak state.

### Nits

**N1:** Hardcoded `DAY1_LESSON_IDS` array could diverge from actual course data silently.
**N2:** Missing `data-status` assertion inside the AC4 loop for per-step verification.
**N3:** `expect(label).toBeTruthy()` is weaker than `expect(label).not.toBeNull()`.
**N4:** Store lacks `resetStore` action for test cleanup.

## Edge Cases Not Covered

1. Module with zero lessons (deriveModuleStatus empty array)
2. Re-selecting the current status (no-op/redundant write)
3. Rapid status changes (race condition with two in-flight writes)
4. Single-lesson module (immediate cascade)
5. Tooltip visibility on hover/keyboard focus

---
ACs: 1/5 covered | Findings: 13 | High: 5 | Medium: 4 | Nits: 4
