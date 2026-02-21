## Design Review Report: E02-S07 — Skip Controls, Picture-in-Picture & Shortcuts Help

**Review Date**: 2026-02-21
**Branch**: `feature/e02-s07-skip-controls-pip-shortcuts-help`
**Viewports Tested**: 1440px (desktop), 768px (tablet), 375px (mobile)

### What Works Well

1. **Touch target compliance**: Skip back, skip forward, and PiP buttons all measure 44x44px at every viewport.
2. **ARIA implementation**: Descriptive `aria-label` on all buttons, `aria-pressed` on PiP toggle, live region announcements for every action.
3. **No hardcoded values**: All styling uses Tailwind utilities. No inline styles or hex colors.
4. **Hover states verified**: `bg-white/20` feedback confirmed on all new buttons at desktop.

### Findings

#### High Priority

- **H1 — Missing `handleAddBookmark` in useEffect dependency** (`VideoPlayer.tsx:533-545`): Keyboard `B` handler will use stale closure for bookmark timestamp.
- **H2 — Shortcuts overlay lacks dialog ARIA semantics** (`VideoShortcutsOverlay.tsx:62-101`): No `role="dialog"`, `aria-modal`, `aria-labelledby`, or focus management. Screen readers won't announce it.

#### Medium Priority

- **M1 — Close button 36x36px** (`VideoShortcutsOverlay.tsx:67-75`): `size-9` is below 44x44px minimum. Change to `size-11`.
- **M2 — Two-column layout wraps at mobile** (`VideoShortcutsOverlay.tsx:80`): 10/14 labels wrap. Use `grid-cols-1 sm:grid-cols-2`.
- **M3 — Phantom Shift+Arrow shortcut** (`VideoShortcutsOverlay.tsx:30`): Documents non-existent shortcut. Remove entry.
- **M4 — Footer text contrast** (`VideoShortcutsOverlay.tsx:98`): `text-white/40` ~3.74:1 fails WCAG AA. Use `text-white/60`.
- **M5 — No `prefers-reduced-motion` guard** on transitions in both files.

#### Nits

- **N1**: Category labels `text-white/50` borderline but passes for large text.
- **N2**: Duplicate announce calls in button onClick and keyboard handlers.
- **N3**: Inline style on bookmark marker is intentional.

### Accessibility Checklist

| Check | Status |
|-------|--------|
| Text contrast (descriptions) | Pass |
| Text contrast (footer hint) | Fail (M4) |
| Touch targets ≥44px | Fail (M1, close button only) |
| Keyboard navigation | Partial (buttons reachable, overlay no focus trap) |
| ARIA labels on buttons | Pass |
| `aria-pressed` on PiP | Pass |
| Dialog semantics on overlay | Fail (H2) |
| `prefers-reduced-motion` | Fail (M5) |

### Responsive Verification

- **Mobile (375px)**: Partial — controls pass, overlay layout wraps (M2), close button small (M1).
- **Tablet (768px)**: Pass.
- **Desktop (1440px)**: Pass.
