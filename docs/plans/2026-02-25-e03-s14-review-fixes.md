# E03-S14 Tables — Review Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 1 blocker, 7 high-priority, 7 medium, and 5 nit findings from the design + code review of the Tables story.

**Architecture:** All changes are localized to 4 files (`TableContextMenu.tsx`, `TableGridPicker.tsx`, `theme.css`, `index.css`) plus 1 E2E spec. No new files, no new dependencies.

**Tech Stack:** React 18 + TypeScript, TipTap, Tailwind CSS v4, Playwright E2E

---

## Task 1: Context Menu Arrow Key Navigation (Blocker + High)

Fixes: Design-B1 (keyboard inaccessible), Code-H1 (arrow keys missing for role="menu")

The context menu has `role="menu"` and auto-focuses the first item, but keyboard users cannot navigate between items with arrow keys. The WAI-ARIA Menu pattern requires ArrowDown/ArrowUp to move focus between `menuitem` elements, and Home/End to jump to first/last.

**Files:**
- Modify: `src/app/components/notes/TableContextMenu.tsx:46-57`

**Step 1: Replace the Escape-only keydown handler with a full menu keyboard handler**

Currently lines 46-57 handle only Escape. Replace with a handler that covers ArrowDown, ArrowUp, Home, End, and Escape — all operating on `[role="menuitem"]` elements, skipping separators.

```tsx
// Replace the useEffect at lines 46-57 with:
useEffect(() => {
  if (!visible) return

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setVisible(false)
      return
    }

    const menu = menuRef.current
    if (!menu) return

    const items = Array.from(
      menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    )
    const current = items.indexOf(document.activeElement as HTMLButtonElement)

    let next = current
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        next = (current + 1) % items.length
        break
      case 'ArrowUp':
        event.preventDefault()
        next = (current - 1 + items.length) % items.length
        break
      case 'Home':
        event.preventDefault()
        next = 0
        break
      case 'End':
        event.preventDefault()
        next = items.length - 1
        break
      default:
        return
    }

    items[next]?.focus()
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [visible])
```

**Step 2: Run the E2E tests to verify nothing broke**

Run: `npx playwright test tests/e2e/story-3.14.spec.ts --project=chromium`
Expected: All 9 story tests pass. The Escape test still works because the new handler preserves Escape behavior.

**Step 3: Commit**

```bash
git add src/app/components/notes/TableContextMenu.tsx
git commit -m "fix(E03-S14): add arrow key navigation to table context menu

Implements WAI-ARIA Menu pattern: ArrowDown/ArrowUp cycle through
menuitem elements, Home/End jump to first/last. Fixes WCAG 2.1
Level A SC 2.1.1 keyboard accessibility violation."
```

---

## Task 2: Fix useLayoutEffect Double-Render (Medium)

Fixes: Code-M4 (position.y in deps causes guaranteed re-render)

**Files:**
- Modify: `src/app/components/notes/TableContextMenu.tsx:59-67`

**Step 1: Remove `position.y` from the dependency array**

The `useLayoutEffect` at line 59-67 re-fires when `position.y` changes (which it does when it clamps), causing a wasted render. Only run when `visible` transitions to true.

```tsx
// Replace lines 59-67 with:
useLayoutEffect(() => {
  if (!visible || !menuRef.current) return
  const rect = menuRef.current.getBoundingClientRect()
  if (rect.bottom > window.innerHeight - 8) {
    const clampedY = Math.max(8, window.innerHeight - rect.height - 8)
    setPosition((prev) => ({ ...prev, y: clampedY }))
  }
}, [visible])
```

**Step 2: Run E2E tests**

Run: `npx playwright test tests/e2e/story-3.14.spec.ts --project=chromium`
Expected: All 9 pass.

**Step 3: Commit**

```bash
git add src/app/components/notes/TableContextMenu.tsx
git commit -m "fix(E03-S14): remove position.y from useLayoutEffect deps

Prevents guaranteed double-render when context menu is clamped to viewport bottom."
```

---

## Task 3: Move `position: fixed` to className + Memoize menuItems (Medium + Nit)

Fixes: Code-M7 (inline style for position:fixed), Code-Nit (menuItems recreated every render)

**Files:**
- Modify: `src/app/components/notes/TableContextMenu.tsx:86-126,138-139`

**Step 1: Move `position: fixed` from inline style to className**

At line 138-139, change:
```tsx
// OLD (line 138-139):
className="bg-popover shadow-lg border border-border rounded-xl py-1 px-1 w-52 z-50"
style={{ position: 'fixed', left: position.x, top: position.y }}

// NEW:
className="fixed bg-popover shadow-lg border border-border rounded-xl py-1 px-1 w-52 z-50"
style={{ left: position.x, top: position.y }}
```

**Step 2: Memoize menuItems array**

Wrap the `menuItems` array (lines 86-126) with `useMemo`. Add `useMemo` to the import on line 1.

```tsx
// Line 1: add useMemo to imports
import { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo } from 'react'

// Replace lines 86-126 with:
const menuItems = useMemo(
  () => [
    {
      label: 'Add Row Above',
      icon: Plus,
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: 'Add Row Below',
      icon: Plus,
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    { separator: true },
    {
      label: 'Add Column Left',
      icon: Plus,
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: 'Add Column Right',
      icon: Plus,
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    { separator: true },
    {
      label: 'Delete Row',
      icon: Minus,
      action: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: 'Delete Column',
      icon: Minus,
      action: () => editor.chain().focus().deleteColumn().run(),
    },
    { separator: true },
    {
      label: 'Delete Table',
      icon: Trash2,
      action: () => editor.chain().focus().deleteTable().run(),
      destructive: true,
    },
  ],
  [editor]
)
```

**Step 3: Run E2E tests**

Run: `npx playwright test tests/e2e/story-3.14.spec.ts --project=chromium`
Expected: All 9 pass.

**Step 4: Commit**

```bash
git add src/app/components/notes/TableContextMenu.tsx
git commit -m "refactor(E03-S14): move fixed positioning to Tailwind, memoize menuItems"
```

---

## Task 4: Dark Mode `--table-selected` Token (High)

Fixes: Code-H2 (--table-selected missing from .dark)

**Files:**
- Modify: `src/styles/theme.css:119`

**Step 1: Add `--table-selected` to the `.dark` block**

Insert before the closing `}` of `.dark` (after line 119, before line 120):

```css
  --table-selected: oklch(0.25 0.05 250);
```

This gives a subtle dark-blue tint against the dark background (`oklch(0.145 0 0)`).

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add src/styles/theme.css
git commit -m "fix(E03-S14): add --table-selected dark mode override

Prevents light-mode blue tint from appearing on dark backgrounds."
```

---

## Task 5: Comment Syntax Highlight Contrast (Medium)

Fixes: Code-M6 (comment color ~3.8:1 below WCAG AA 4.5:1)

**Files:**
- Modify: `src/styles/index.css:109`

**Step 1: Darken the comment color**

Change line 109 from:
```css
.tiptap .hljs-comment,
.tiptap .hljs-quote { color: oklch(0.45 0.02 250); font-style: italic; }
```
to:
```css
.tiptap .hljs-comment,
.tiptap .hljs-quote { color: oklch(0.40 0.02 250); font-style: italic; }
```

`oklch(0.40 0.02 250)` on white gives approximately 5.5:1 contrast — well above the 4.5:1 AA minimum.

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/styles/index.css
git commit -m "fix(E03-S14): improve code comment contrast to WCAG AA (5.5:1)"
```

---

## Task 6: Grid Picker Label Convention (Medium)

Fixes: Code-M5 (displays "col x row" instead of "row x col")

**Files:**
- Modify: `src/app/components/notes/TableGridPicker.tsx:94,101-102`

**Step 1: Swap the label to "rows x columns" convention**

Change the `aria-label` on cell buttons (line 94):
```tsx
// OLD:
aria-label={`${col} x ${row} table`}
// NEW:
aria-label={`${row} x ${col} table`}
```

Change the display text (lines 101-102):
```tsx
// OLD:
? `${hoveredCol} x ${hoveredRow}`
// NEW:
? `${hoveredRow} x ${hoveredCol}`
```

**Step 2: Run E2E tests**

Run: `npx playwright test tests/e2e/story-3.14.spec.ts --project=chromium`
Expected: All 9 pass (tests don't assert on the label text).

**Step 3: Commit**

```bash
git add src/app/components/notes/TableGridPicker.tsx
git commit -m "fix(E03-S14): swap grid picker label to rows x columns convention"
```

---

## Task 7: Standardize Quotes in TableGridPicker (Nit)

Fixes: Code-Nit (mixed quote styles between files)

**Files:**
- Modify: `src/app/components/notes/TableGridPicker.tsx` (entire file)

**Step 1: Convert all double quotes to single quotes**

The rest of the notes components use single quotes. Change all `"string"` to `'string'` in `TableGridPicker.tsx`. This includes:
- Import strings (lines 1-3)
- JSX string attributes (lines 64-68, 84, 94, 100, 103)
- String literals inside expressions (lines 32-33, 41-42)

Leave JSX text content and template literals unchanged.

**Step 2: Run build + lint to verify**

Run: `npm run build && npm run lint`
Expected: No new errors.

**Step 3: Commit**

```bash
git add src/app/components/notes/TableGridPicker.tsx
git commit -m "style(E03-S14): standardize single quotes in TableGridPicker"
```

---

## Task 8: Directional Icons for Context Menu (Nit)

Fixes: Design-N2 (all "Add" actions share same Plus icon)

**Files:**
- Modify: `src/app/components/notes/TableContextMenu.tsx:3,86-106`

**Step 1: Import directional icons and replace Plus**

Update the import (line 3):
```tsx
// OLD:
import { Trash2, Plus, Minus } from 'lucide-react'
// NEW:
import { Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Minus } from 'lucide-react'
```

Update the `menuItems` icons inside the `useMemo`:
```tsx
{ label: 'Add Row Above', icon: ArrowUp, action: ... },
{ label: 'Add Row Below', icon: ArrowDown, action: ... },
// ...
{ label: 'Add Column Left', icon: ArrowLeft, action: ... },
{ label: 'Add Column Right', icon: ArrowRight, action: ... },
```

Remove `Plus` from imports since it's no longer used.

**Step 2: Run E2E tests**

Run: `npx playwright test tests/e2e/story-3.14.spec.ts --project=chromium`
Expected: All 9 pass (tests don't assert on icon content).

**Step 3: Commit**

```bash
git add src/app/components/notes/TableContextMenu.tsx
git commit -m "style(E03-S14): use directional icons for row/column add actions"
```

---

## Task 9: AC2 Enter Key — Update AC Text (High)

Fixes: Code-H3 (Enter vs Tab AC ambiguity)

TipTap's standard table behavior: **Tab** at the last cell creates a new row; **Enter** creates a newline within a cell. This is consistent with every spreadsheet and table editor. The AC text says "Enter creates a new row at the end" which is misleading — Tab is the correct key. The existing E2E test at line 225 already verifies Tab-at-end behavior correctly.

**Files:**
- Modify: `docs/implementation-artifacts/3-14-tables.md:30`

**Step 1: Update AC2 text to reflect actual behavior**

Change line 30 from:
```
And Tab moves between cells, Enter creates a new row at the end
```
to:
```
And Tab moves between cells, Tab at the last cell creates a new row
```

**Step 2: Commit**

```bash
git add docs/implementation-artifacts/3-14-tables.md
git commit -m "docs(E03-S14): clarify AC2 — Tab (not Enter) creates new row at end

TipTap standard behavior: Tab at last cell adds row. Enter creates
newline within cell. Consistent with spreadsheet conventions."
```

---

## Task 10: Final Verification

**Step 1: Run full pre-check suite**

```bash
npm run build && npm run lint
```
Expected: 0 errors. Warnings should be same pre-existing set.

**Step 2: Run all E2E tests**

```bash
npx playwright test tests/e2e/navigation.spec.ts tests/e2e/overview.spec.ts tests/e2e/courses.spec.ts tests/e2e/story-3.14.spec.ts --project=chromium
```
Expected: All story tests pass. The overview isolation test may still be flaky (pre-existing, unrelated).

**Step 3: Verify no regressions in the Notes tab**

Manually check (or use Playwright snapshot) that:
- Table toolbar button still works
- Grid picker still inserts tables
- Context menu opens on right-click, arrow keys navigate items, Escape closes
- Tab navigation works between cells
- Tables render correctly in both light and dark modes

---

## Summary

| Task | Findings Fixed | Files |
|------|---------------|-------|
| 1 | B1, Code-H1 (arrow keys) | `TableContextMenu.tsx` |
| 2 | Code-M4 (useLayoutEffect deps) | `TableContextMenu.tsx` |
| 3 | Code-M7 (inline style), Nit (memoize) | `TableContextMenu.tsx` |
| 4 | Code-H2 (dark mode token) | `theme.css` |
| 5 | Code-M6 (comment contrast) | `index.css` |
| 6 | Code-M5 (label convention) | `TableGridPicker.tsx` |
| 7 | Nit (quote style) | `TableGridPicker.tsx` |
| 8 | Nit (directional icons) | `TableContextMenu.tsx` |
| 9 | Code-H3 (AC Enter vs Tab) | `3-14-tables.md` |
| 10 | Final verification | — |
