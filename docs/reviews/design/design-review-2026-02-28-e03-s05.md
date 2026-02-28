# Design Review: E03-S05 — Full-Text Note Search

**Date:** 2026-02-28
**Viewports Tested:** 1440px, 768px, 375px
**Pages Tested:** `/` (Overview + command palette), `/courses/operative-six/op6-introduction?panel=notes`

## What Works Well

1. Notes group placement — appears above Pages/Courses/Lessons, giving user content priority
2. Visual consistency — amber StickyNote icon, 14px snippet, 12px sublabel, selection highlight all match existing groups
3. Tag badges — compact `text-[10px] h-4 px-1.5` with excellent contrast
4. Empty state — correctly shows "No notes found. Try different keywords or browse by tag."
5. Deep-link — `?panel=notes` opens notes panel, `?t=` seeks video
6. Custom cmdk filter — bypasses built-in filtering for `note:` prefixed values
7. State cleanup on close — all search state reset when palette closes
8. Accessibility — correct combobox/listbox ARIA pattern

## Findings

### High Priority

**H1 — Raw markdown link syntax visible in note snippets**
- `SearchCommandPalette.tsx:144–148`: `truncateSnippet` strips HTML but not markdown. Notes with TipTap timestamp links show `[0:08](video://...)` as raw text.
- Fix: Extend with `.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')` before HTML strip.

**H2 — Close button on mobile is 16x16px (fails 44x44px touch target)**
- Pre-existing Radix Dialog close button issue. Affects palette dismissal on mobile.
- Fix: Add `p-3 -m-3` or `size-11 flex items-center justify-center` on close button wrapper.

### Medium Priority

**M1 — `buildSearchIndex()` called on every render**
- `SearchCommandPalette.tsx:197`: No `useMemo` — rebuilds index on every keystroke re-render.
- Fix: Hoist to module scope or wrap with `useMemo(() => buildSearchIndex(), [])`.

**M2 — "No notes found" message scope ambiguity**
- Empty state says "No notes found" even when pages/courses/lessons also had no matches.
- Fix: Use "No results found. Try different keywords or browse by tag."

**M3 — 300px max-height may clip results**
- Pre-existing `CommandList` constraint. With Notes group first, 4+ notes push other groups below fold.

## Verdict

No blockers. 2 high-priority, 3 medium findings.
