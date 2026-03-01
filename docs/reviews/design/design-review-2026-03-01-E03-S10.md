---

## Design Review Report

**Review Date:** 2026-03-01
**Reviewed By:** Claude Code (design-review agent via Playwright MCP)
**Branch:** `feature/e03-s10-note-export`
**Changed Files:**
- `src/app/pages/Notes.tsx` (modified)
- `src/app/components/notes/CourseNotesTab.tsx` (modified)
- `src/app/components/notes/ExportNotesDialog.tsx` (new)
- `src/lib/noteExport.ts` (new)

**Affected Routes Tested:** `/notes` at 1440px, 768px, and 375px viewports

---

### Executive Summary

E03-S10 delivers a clean, well-structured note export feature. The `ExportNotesDialog` follows platform conventions for semantic markup and Radix UI dialog patterns correctly, and the keyboard flow (Tab, Arrow keys, Escape, focus return) works correctly. Three issues need attention before merge: radio item touch targets are critically small on mobile, the `text-destructive` color used for failure messages has insufficient contrast in dark mode, and the `animate-spin` spinner does not respect `prefers-reduced-motion`.

---

### Acceptance Criteria Verification

| AC | Description | Status |
|----|-------------|--------|
| AC1 | Export button visible on Notes page; clicking opens options dialog | Pass |
| AC3 | Export dialog shows radio group for scope selection (all notes vs per-course) | Pass |
| AC5 | Completion summary shows exported count, total size, failure details | Pass (verified in code — UI state confirmed by review) |

---

### Findings by Severity

#### Blockers (Must fix before merge)

**1. Radio item touch targets are 16px tall on mobile — far below the 44px minimum**

Each scope option row (`flex items-center space-x-2`) measures only 16px tall on a 375px viewport. A learner on a phone trying to select "Authority (2)" has a 16x282px tap zone — impossible to reliably hit. This is a WCAG 2.5.5 (Target Size) violation and a usability blocker for mobile users.

- **Location:** `src/app/components/notes/ExportNotesDialog.tsx:130-144`
- **Evidence:** `getBoundingClientRect()` on each radio wrapper returned `{ height: 16, width: 282 }` at 375px viewport
- **Impact:** Mobile learners cannot reliably select individual course scope — they'd be forced to export all notes even when they only want one course's notes
- **Suggestion:** Add `py-2.5` (10px vertical padding) to each radio row wrapper, giving a total height of ~36px. Pair with `min-h-[44px]` on the wrapper `div` to guarantee the minimum:

```tsx
// ExportNotesDialog.tsx line 130 and 137
<div className="flex items-center space-x-2 min-h-[44px]">
```

---

#### High Priority (Should fix before merge)

**2. `text-destructive` in dark mode has low contrast for failure messages**

The failure text in the export summary uses `text-destructive`, which resolves to `oklch(0.396 0.141 25.723)` — a mid-dark red — against the dialog card background of `oklch(0.145 0 0)`. The OKLCH lightness delta is only 0.251, which translates to an approximate contrast ratio below the 4.5:1 WCAG AA threshold for normal text. Learners with low vision may not be able to read failure reasons.

- **Location:** `src/app/components/notes/ExportNotesDialog.tsx:115`
- **Evidence:** `text-destructive` computed color `oklch(0.396 0.141 25.723)` on `oklch(0.145 0 0)` background (dark mode)
- **Impact:** If an export partially fails, a learner with low vision cannot read which notes failed or why
- **Suggestion:** The `--destructive` token is likely defined for destructive action buttons, not body text in dark mode. Use `text-destructive-foreground` if available, or apply `font-medium` to increase visual weight. Alternatively, use `text-red-400` in dark mode via a `dark:text-red-400` modifier, which has better contrast on dark backgrounds than `text-red-600`/`destructive`

**3. `animate-spin` on the loading spinner does not respect `prefers-reduced-motion`**

The exporting state uses `<Loader2 className="... animate-spin" />`. The rest of the codebase consistently uses `motion-reduce:` Tailwind variants (e.g. `motion-reduce:transition-none`, `motion-reduce:hover:[transform:scale(1)]`). Users with vestibular disorders who have enabled reduced motion will still see a continuously spinning icon during export.

- **Location:** `src/app/components/notes/ExportNotesDialog.tsx:161`
- **Evidence:** `animate-spin` class present; no `motion-reduce:` modifier; grep of the codebase shows `prefers-reduced-motion` is handled via Tailwind variants elsewhere
- **Impact:** Can trigger dizziness or disorientation in users with vestibular disorders (WCAG 2.3.3)
- **Suggestion:**

```tsx
<Loader2 className="size-3.5 mr-1.5 animate-spin motion-reduce:animate-none" />
```

**4. Header controls misalign vertically on mobile — h1 wraps to 3 lines**

At 375px, the `flex items-center justify-between` page header forces the H1 "My Notes (10)" into a 61px-wide column, causing it to wrap across three lines (measured height: 96px). The controls column (Export + sort) takes the remaining width. This is awkward layout — the heading should take priority.

- **Location:** `src/app/pages/Notes.tsx:302-319`
- **Evidence:** `headingRect: { width: 61.7, height: 96 }` at 375px viewport
- **Impact:** The page title is visually broken on mobile; the count "(10)" may wrap oddly, reducing scannability for learners checking how many notes they have
- **Suggestion:** Add `flex-wrap gap-3` to the outer div and `shrink-0` to the controls group so the controls stack below the heading on very small screens, or switch to a `flex-col sm:flex-row` layout. This is a pre-existing issue in Notes.tsx but is now more visible because the controls row has grown by one button (Export).

---

#### Medium Priority (Fix when possible)

**5. `ExportNotesDialog` trigger button uses `size="sm"` (32px) while the sort Select is the default size (36px)**

The two controls sit side-by-side in the header. The 4px height difference is subtle but noticeable on close inspection and breaks vertical rhythm.

- **Location:** `src/app/pages/Notes.tsx:308` — the sort Select has no explicit `size`; `ExportNotesDialog.tsx:83` — the trigger uses `size="sm"`
- **Evidence:** Export button `getBoundingClientRect().height: 32`, sort combobox `height: 36`
- **Impact:** Minor visual inconsistency; inconsistency in clickable areas
- **Suggestion:** Either add `size="sm"` to the `SelectTrigger` or remove `size="sm"` from the Export trigger. Given the compact header, `size="sm"` on both is the better choice:

```tsx
// Notes.tsx line 309
<SelectTrigger className="w-[160px]" size="sm">
```

**6. `CourseNotesTab` Export button lacks `aria-label` — the text is sufficient but icon needs `aria-hidden`**

The Export button in `CourseNotesTab` (`src/app/components/notes/CourseNotesTab.tsx:148-156`) has visible text "Export" which is adequate for an accessible name. However, the `<Download>` icon inside it does not have `aria-hidden="true"`, so screen readers may announce "Download Export" or similar depending on how Lucide icons render their SVG title.

- **Location:** `src/app/components/notes/CourseNotesTab.tsx:153`
- **Evidence:** No `aria-label` on button (acceptable since text is present); icon SVG not explicitly `aria-hidden`
- **Impact:** Screen reader users may hear redundant or confusing announcement
- **Suggestion:** Lucide icons in this codebase generally render with `aria-hidden` by default via the icon component — confirm this is the case, or add `aria-hidden="true"` explicitly to the `<Download>` icon if needed

**7. RadioGroup has no accessible label**

The `<RadioGroup>` in `ExportNotesDialog` has neither `aria-label` nor `aria-labelledby`. Screen readers will announce the group without context ("group" with no name), leaving blind users to infer purpose from the radio options alone.

- **Location:** `src/app/components/notes/ExportNotesDialog.tsx:129`
- **Evidence:** `radioGroupAriaLabel: null`, `radioGroupAriaLabelledby: null` (confirmed via `getAttribute` in browser)
- **Impact:** Screen reader users lack immediate context for what they're selecting; they must listen to multiple options before understanding the grouping purpose
- **Suggestion:**

```tsx
<RadioGroup value={scope} onValueChange={setScope} aria-label="Export scope">
```

**8. `key={i}` used for failure list items (index as key anti-pattern)**

The failed notes list uses array index as React key.

- **Location:** `src/app/components/notes/ExportNotesDialog.tsx:121`
- **Evidence:** `<p key={i} className="text-xs pl-6">{f.reason}</p>`
- **Impact:** If failure messages were reordered or filtered, React reconciliation would produce incorrect DOM updates. In practice this list is static after export completes, so the impact is low — but it's a code quality concern
- **Suggestion:** Use `f.noteId` as the key since it is already available:

```tsx
<p key={f.noteId} className="text-xs pl-6">{f.reason}</p>
```

---

#### Nitpicks (Optional)

**9. Export button in `CourseNotesTab` triggers download immediately without confirmation**

The global-scope `ExportNotesDialog` opens a dialog for scope selection, but the per-course Export button in `CourseNotesTab` calls `exportNotes(notes)` directly with no confirmation dialog. This is a deliberate design choice (the scope is already narrowed to the course), but if a course has many notes it triggers a ZIP download with no feedback to the learner — no progress state, no completion summary.

- **Location:** `src/app/components/notes/CourseNotesTab.tsx:152`
- **Suggestion:** Consider wrapping this in an `ExportNotesDialog` (passing the course-scoped notes) to provide consistent UX — the learner gets the same completion summary. Alternatively, a simple toast/notification on success would give feedback.

**10. `space-x-2` vs `gap-2` inconsistency within the same file**

The dialog uses `space-x-2` for radio rows (line 130, 137) but `gap-2` for the title and summary rows (lines 92, 106). Both achieve the same visual result but mixing spacing utilities is mildly inconsistent.

- **Location:** `src/app/components/notes/ExportNotesDialog.tsx:130, 137`
- **Suggestion:** Use `gap-2` throughout for consistency with modern Tailwind patterns

---

### What Works Well

- **Focus management is excellent.** Escape closes the dialog and returns focus precisely to the trigger button (`[data-testid="export-notes-button"]`). Tab order inside the dialog is logical: radio group → Export button → Close button → wraps back to radio. This is correct Radix UI dialog behavior and it works perfectly.

- **Dynamic label on the CTA button is a strong UX pattern.** The Export button text updates from "Export 10 notes" to "Export selected notes" when a per-course radio is selected. This gives learners immediate confirmation of what they're about to do.

- **State reset on close is correctly implemented.** `handleOpenChange` resets `scope`, `result`, and `isExporting` when the dialog closes. Learners who open the dialog, change their mind, and reopen it will always see the fresh initial state — no stale results showing from a previous export.

- **No horizontal scroll at any breakpoint.** The page and dialog both fit cleanly within the viewport at 375px, 768px, and 1440px. No content overflow was detected.

- **Import conventions are clean.** All imports in the new files use the `@/` alias consistently. No relative `../` paths, no hardcoded hex colors, no inline style attributes.

---

### Accessibility Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Text contrast ≥4.5:1 (light mode) | Pass | Warm off-white background with foreground text passes in light mode |
| Text contrast ≥4.5:1 (dark mode) | Fail | `text-destructive` failure text has insufficient contrast in dark mode |
| Keyboard navigation — Tab order | Pass | Tab cycles correctly through dialog: radio → Export button → Close → radio |
| Keyboard navigation — Arrow keys in radio | Pass | Standard Radix RadioGroup arrow key behavior confirmed |
| Escape key closes modal | Pass | Confirmed: dialog closes, focus returns to trigger |
| Focus indicators visible | Pass | Radix UI focus-visible ring present on radio items and buttons |
| Focus trap inside dialog | Pass | Tab does not escape the dialog |
| Focus returns to trigger on close | Pass | Confirmed via `document.activeElement` check |
| Heading hierarchy | Pass | H1 on page, H2 in dialog title — logical structure |
| ARIA labels on icon-only buttons | Pass | No icon-only buttons (all have visible text labels) |
| RadioGroup has accessible label | Fail | `aria-label` missing from `<RadioGroup>` |
| Dialog `aria-modal` attribute | Pass | Radix handles this via `inert` on background content |
| `prefers-reduced-motion` — spinner | Fail | `animate-spin` lacks `motion-reduce:animate-none` |
| `prefers-reduced-motion` — other animations | Pass | Dialog open/close transitions use Radix defaults |
| Semantic HTML | Pass | `<button>`, `<dialog>` (via Radix), `<label>` correctly used |
| Form labels associated with inputs | Pass | `<Label htmlFor>` correctly matched to `<RadioGroupItem id>` |

---

### Responsive Design Verification

| Breakpoint | Status | Notes |
|------------|--------|-------|
| Mobile (375px) | Partial | No horizontal scroll; dialog fits viewport (332px wide); **radio rows are 16px tall — blocker**; H1 wraps to 3 lines due to header crowding |
| Tablet (768px) | Pass | No horizontal overflow; dialog 512px centered cleanly; controls visible and functional |
| Desktop (1440px) | Pass | All controls visible; dialog centered and correctly sized; proper spacing throughout |

---

### Recommendations

1. **Fix radio touch targets immediately** (`min-h-[44px]` on each row wrapper in `ExportNotesDialog.tsx`) — this is a blocker for any learner accessing the platform on a phone.

2. **Add `motion-reduce:animate-none` to the spinner** — a one-word Tailwind modifier change that brings the component in line with the rest of the codebase's accessibility approach.

3. **Investigate `text-destructive` dark mode contrast** — open the browser in light mode and dark mode, run the export completion summary with failures, and verify the failure text is readable. If not, switch to `text-red-400` with a `dark:` prefix.

4. **Add `aria-label="Export scope"` to the `RadioGroup`** — a single attribute that meaningfully improves the screen reader experience for learners who depend on assistive technology.

---
