---
story_id: E02-S08
story_name: "Chapter Progress Bar & Transcript Panel"
status: in-progress
started: 2026-02-21
completed:
reviewed: false          # false | in-progress | true
review_started:          # YYYY-MM-DD — set when /review-story begins
review_gates_passed: []  # tracks completed gates: [build, lint, unit-tests, e2e-tests, design-review, code-review]
---

# Story 2.8: Chapter Progress Bar & Transcript Panel

## Story

As a learner,
I want chapter markers on the progress bar and a synchronized transcript panel,
so that I can quickly navigate to specific topics and follow along with spoken content.

## Acceptance Criteria

**AC1 — Chapter markers on progress bar:**
Given a video resource with `metadata.chapters` data,
When the lesson player loads,
Then chapter marker lines appear on the progress bar at the correct percentage positions, and hovering a marker shows a tooltip with the chapter title and timestamp.

**AC2 — Backward compatibility (no chapters):**
Given a video resource without `metadata.chapters`,
When the lesson player loads,
Then the progress bar renders identically to the current implementation with no chapter markers.

**AC3 — Transcript tab with synchronized cues:**
Given a video resource with `metadata.captions[0].src` pointing to a `.vtt` file,
When the lesson player loads,
Then a "Transcript" tab is visible in the sidebar; clicking it shows a scrollable list of cues that auto-scrolls to highlight the currently active cue as the video plays, and clicking a cue seeks the video to that cue's start time.

**AC4 — Transcript tab hidden when no captions:**
Given a video resource without `metadata.captions`,
When the lesson player loads,
Then no "Transcript" tab is shown in the sidebar.

## Tasks / Subtasks

- [ ] Task 1: Add Chapter and TranscriptCue types to types.ts (AC: 1, 3)
  - [ ] 1.1 Add `Chapter { time: number; title: string }` interface
  - [ ] 1.2 Add `TranscriptCue { startTime: number; endTime: number; text: string }` interface
  - [ ] 1.3 Extend `Resource.metadata` with `chapters?: Chapter[]`

- [ ] Task 2: Create ChapterProgressBar component (AC: 1, 2)
  - [ ] 2.1 Build visual track with fill bar and hover-expand behaviour
  - [ ] 2.2 Add chapter marker lines at correct percentage positions
  - [ ] 2.3 Add Radix Tooltip on each chapter marker
  - [ ] 2.4 Move bookmark marker buttons here from VideoPlayer
  - [ ] 2.5 Add hidden `<input type="range">` overlay for keyboard a11y
  - [ ] 2.6 Wire `onSeek` callback on mouse click

- [ ] Task 3: Integrate ChapterProgressBar into VideoPlayer (AC: 1, 2)
  - [ ] 3.1 Add `chapters?: Chapter[]` prop to VideoPlayerProps
  - [ ] 3.2 Replace Slider-based progress bar with `<ChapterProgressBar>`

- [ ] Task 4: Create TranscriptPanel component (AC: 3, 4)
  - [ ] 4.1 Implement inline VTT fetch + parser (no library)
  - [ ] 4.2 Render scrollable cue list with active cue highlighting
  - [ ] 4.3 Auto-scroll active cue into view via useRef
  - [ ] 4.4 Wire click-to-seek callback
  - [ ] 4.5 Handle fetch error state

- [ ] Task 5: Integrate Transcript tab into LessonPlayer (AC: 3, 4)
  - [ ] 5.1 Add `videoCurrentTime` state updated on every `onTimeUpdate`
  - [ ] 5.2 Add conditional Transcript TabsTrigger + TabsContent
  - [ ] 5.3 Pass `chapters` to VideoPlayer

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
