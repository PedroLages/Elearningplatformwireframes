---
story_id: E02-S07
story_name: "Skip Controls, Picture-in-Picture & Shortcuts Help"
status: in-progress
started: 2026-02-21
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 2.7: Skip Controls, Picture-in-Picture & Shortcuts Help

## Story

As a learner,
I want visible skip buttons, picture-in-picture mode, and a shortcuts reference,
So that I can navigate video content quickly, multitask while watching, and discover keyboard shortcuts.

## Acceptance Criteria

**AC1: Skip Controls**

**Given** the user is watching a video
**When** the controls are visible
**Then** skip-back (-10s) and skip-forward (+10s) buttons appear in the bottom-left control group
**And** pressing J skips back 10 seconds, L skips forward 10 seconds (YouTube convention)
**And** each skip action triggers an ARIA announcement ("Skipped back 10 seconds")

**AC2: Picture-in-Picture**

**Given** the browser supports Picture-in-Picture
**When** the user clicks the PiP button or presses P
**Then** the video enters PiP mode (floating window)
**And** the PiP button shows active state while in PiP
**And** exiting PiP (via button or browser chrome) returns to inline playback

**Given** the browser does not support Picture-in-Picture
**When** the controls render
**Then** the PiP button is not shown

**AC3: Shortcuts Help Overlay**

**Given** the user presses ? while the video player has focus
**When** the shortcuts overlay appears
**Then** all available keyboard shortcuts are displayed in a two-column grid overlay
**And** pressing ? again or Escape dismisses the overlay
**And** the Layout-level ? handler does NOT also fire (event propagation stopped)

## Tasks / Subtasks

- [ ] Task 1: Skip Controls — Buttons + Keyboard Shortcuts (AC: 1)
  - [ ] 1.1 Add J/L keyboard shortcuts to handleKeyDown
  - [ ] 1.2 Add skip-back and skip-forward buttons to left control group
  - [ ] 1.3 Add ARIA announcements for skip actions
- [ ] Task 2: Picture-in-Picture (AC: 2)
  - [ ] 2.1 Add PiP toggle callback with browser API
  - [ ] 2.2 Add PiP event listeners for state sync
  - [ ] 2.3 Add P keyboard shortcut
  - [ ] 2.4 Add PiP button to right control group with browser guard
- [ ] Task 3: Video Shortcuts Overlay (AC: 3)
  - [ ] 3.1 Create VideoShortcutsOverlay.tsx component
  - [ ] 3.2 Integrate into VideoPlayer with ? shortcut
  - [ ] 3.3 Add stopPropagation to prevent Layout handler from firing
  - [ ] 3.4 Pause auto-hide timeout when overlay is open

## Implementation Notes

- New file: `src/app/components/figma/VideoShortcutsOverlay.tsx`
- Import `SkipBack`, `SkipForward`, `PictureInPicture2` from lucide-react
- PiP: `video.requestPictureInPicture()` / `document.exitPictureInPicture()`
- Listen to `enterpictureinpicture` / `leavepictureinpicture` events for state sync
- Guard PiP button render with `document.pictureInPictureEnabled`
- Shortcuts overlay: absolute-positioned inside AspectRatio, `e.stopPropagation()` on `?`

## Implementation Plan

See [plan](../../.claude/plans/stateless-cuddling-hejlsberg.md) for implementation approach.

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story]

## Code Review Feedback

[Populated by /review-story]

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
