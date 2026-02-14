---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '/Volumes/SSD/Dev/Apps/Elearningplatformwireframes/docs/planning-artifacts/prd.md'
  - '/Volumes/SSD/Dev/Apps/Elearningplatformwireframes/docs/planning-artifacts/architecture.md'
  - '/Volumes/SSD/Dev/Apps/Elearningplatformwireframes/docs/planning-artifacts/ux-design-specification.md'
  - '/Volumes/SSD/Dev/Apps/Elearningplatformwireframes/docs/PHASE_5_SUMMARY.md'
---

# Elearningplatformwireframes - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Elearningplatformwireframes, decomposing the requirements from the PRD, UX Design, Architecture, and Phase 5 implementation into implementable stories.

## FR Numbering Governance

> **Important:** During epic decomposition, some FRs were renumbered or redefined from their original PRD definitions. This table documents all deviations.

| Epics FR# | PRD FR# | Status | Notes |
|-----------|---------|--------|-------|
| FR20 | FR20 | Redefined | PRD: "Create notes using Markdown syntax" → Epics: "Create timestamped notes linked to specific video moments" |
| FR21 | FR21 | Redefined | PRD: "User can link notes to specific courses and videos" → Epics: "Support markdown formatting in notes using @uiw/react-md-editor" |
| FR24 | FR24 | Redefined | PRD: "User can timestamp notes to exact video positions" → Epics: "Display notes in chronological or timestamp order" |
| FR25 | FR25 | Redefined | PRD: "User can navigate to specific video position from timestamped note" → Epics: "Edit and delete existing notes" |
| FR45 | FR45 | Reassigned | PRD: "User can view learning velocity metrics" → Epics: "Track bookmarks for quick access to important lessons." Original requirement covered by new FR78. |
| FR62 | — | Duplicate | FR62 appears twice: once as PiP mode (line 47), once as timestamp insertion (line 67). Timestamp insertion renumbered to FR76. |
| FR76 | — | New | Not in PRD. Created during epic decomposition for "Insert video timestamp into note via keyboard shortcut (Alt+T in editor)." Derived from PRD FR24. |
| FR77 | — | New | Not in PRD. Created during epic decomposition for "Side-by-side layout on desktop (video player + note editor), stacked on mobile." Derived from UX Design Specification. |
| FR78 | — | New | Not in PRD. Created to preserve original FR45: "User can view learning velocity metrics (completion rate over time, content consumed per hour, progress acceleration/deceleration trends)." Deferred to future epic. |

## Requirements Inventory

### Functional Requirements

**Course Import & Management (8 Requirements):**

FR1: Import course via ZIP file containing index.json manifest + video/PDF assets
FR2: Parse index.json to extract course metadata (name, description, modules, lessons, tags)
FR3: Store imported assets in IndexedDB (videos, PDFs, metadata)
FR4: Display list of all imported courses with metadata
FR5: Allow course deletion with confirmation dialog
FR6: Support course tagging and filtering
FR54: Validate ZIP structure on import with detailed error messages
FR55: Support course import via File System Access API (Chrome/Edge) with fallback to input[type=file]

**Video Playback (14 Requirements):**

FR7: Play video files from IndexedDB using react-player
FR8: Display video title, duration, and current timestamp
FR9: Implement playback controls (play, pause, seek, volume, mute, fullscreen)
FR10: Track current playback position per video
FR11: Resume playback from last position
FR12: Mark videos as complete when watched to 95%+ or manually marked
FR13: Support common video formats (MP4, WebM, OGG)
FR56: Support keyboard shortcuts (Space = play/pause, Arrow keys = seek ±5s, T = timestamp, C = captions, F = fullscreen, M = mute)
FR57: Support WebVTT caption files with toggle, language selection, and font size adjustment (14pt-20pt)
FR58: Display video completion celebration micro-moment (green checkmark scale bounce animation, 300ms)
FR59: Show video progress bar with watched segments visualization
FR60: Support playback speed control (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
FR61: Auto-advance to next video in module with 5-second countdown and cancel option
FR62: Picture-in-picture mode support for multitasking

**Progress Tracking (6 Requirements):**

FR14: Track completion status per video (not started, in progress, completed)
FR15: Calculate course completion percentage based on completed videos
FR16: Track total watch time per course
FR17: Display progress indicators on course/module cards
FR18: Persist progress data locally in IndexedDB
FR19: Export progress data as JSON for backup

**Note-Taking (8 Requirements):**

FR20: Create timestamped notes linked to specific video moments
FR21: Support markdown formatting in notes using @uiw/react-md-editor
FR22: Tag notes for organization and retrieval
FR23: Search notes by content, tags, or course
FR24: Display notes in chronological or timestamp order
FR25: Edit and delete existing notes
FR26: Export notes as markdown file
FR27: Auto-save notes with 3-second debounce and 10-second max wait
FR76: Insert video timestamp into note via keyboard shortcut (T key)
FR77: Side-by-side layout on desktop (video player + note editor), stacked on mobile

**Bookmarks (1 Requirement):**

FR45: Track bookmarks for quick access to important lessons _(PRD deviation: FR45 originally "User can view learning velocity metrics"; reassigned to bookmarks. Original requirement preserved as FR78, deferred to future epic. See FR Numbering Governance table.)_

**Study Streaks & Habits (8 Requirements):**

FR28: Track daily study time (minutes per day)
FR29: Calculate study streak (consecutive days with ≥10 minutes study time)
FR30: Display streak calendar with visual indicators
FR31: Show streak count and longest streak
FR32: Send celebration notifications for streak milestones
FR33: Track weekly study goals and show progress
FR34: Display "days since last study" if streak broken
FR35: Visualize study consistency over time (weekly/monthly heatmap)

**Momentum & Analytics (11 Requirements):**

FR36: Calculate momentum score per course (recency × 0.4 + completion × 0.3 + frequency × 0.3)
FR37: Categorize courses as hot (≥70), warm (40-69), or cold (<40)
FR38: Display momentum indicators on course cards (🔥/⚡/❄️ icons)
FR39: Show "Continue Learning" smart resume suggestion
FR40: Track study sessions (start time, end time, course, duration)
FR41: Calculate average session length and total study hours
FR42: Display recent activity timeline (last 7 days)
FR43: Show time-of-day study patterns (morning, afternoon, evening, night)
FR44: Visualize completion rate by course category
FR46: Display "most studied" and "least studied" courses
FR47: Show estimated time to complete remaining content
FR64: Display momentum score visually on course cards with color-coded indicators
FR65: Show momentum trend (↑ improving, → stable, ↓ declining) based on 7-day comparison
FR78: View learning velocity metrics — completion rate over time, content consumed per hour, progress acceleration/deceleration trends (deferred to future epic; see FR Numbering Governance)

**AI Assistance (14 Requirements):**

FR48: Generate study plan recommendations based on progress and goals
FR49: Summarize video content from captions/transcripts
FR50: Answer questions about course content using RAG
FR51: Suggest related courses based on study history
FR52: Generate quiz questions from video content
FR53: Provide study tips and learning strategies
FR66: Support multiple AI providers (OpenAI, Anthropic) via Vercel AI SDK v2.0.31
FR67: AI context limit of 32K tokens with automatic chunking for long videos
FR68: AI response streaming with cancellation support
FR69: AI-assisted note enhancement (organize, restructure, suggest tags)
FR70: Suggest concept connections across different courses
FR72: Display contextual AI coaching suggestions (rule-based core; AI-enhanced when provider configured)
FR73: Add notes and course content to search results in command palette
FR74: Show/hide dashboard widgets via Settings toggles with preference persistence

### NonFunctional Requirements

**Performance (13 Requirements):**

NFR1: Initial app load time <2 seconds
NFR2: Video playback startup <500ms
NFR3: IndexedDB query time <100ms for typical operations
NFR4: Page navigation transition <200ms
NFR5: Search results return <300ms
NFR6: Note autosave within 3 seconds of last edit
NFR7: Course import processing time <5 seconds for typical course
NFR8: Video seek operation <200ms
NFR9: UI animations run at 60fps
NFR10: Bundle size <500KB (gzipped, excluding videos)
NFR11: Time to Interactive (TTI) <3 seconds on desktop
NFR12: First Contentful Paint (FCP) <1.5 seconds
NFR13: Lazy load non-critical components to optimize initial load

**Reliability (6 Requirements):**

NFR14: Zero data loss on browser crash or unexpected shutdown
NFR15: Graceful degradation if IndexedDB unavailable
NFR16: Auto-save notes every 3 seconds with 10-second max wait
NFR17: Validate data integrity on import
NFR18: Handle offline scenarios with appropriate messaging
NFR19: Recover from corrupt IndexedDB with user notification and data export option
NFR57: Automatic backup of critical data (progress, notes) to localStorage as failsafe
NFR58: Error boundary components to catch and display React errors gracefully
NFR59: Retry logic for failed IndexedDB operations (3 attempts with exponential backoff)

**Usability (10 Requirements):**

NFR20: Zero-click resume from last lesson (smart "Continue Learning" button)
NFR21: <3 clicks to reach any core workflow
NFR22: Intuitive navigation with clear visual hierarchy
NFR23: Consistent design language across all pages
NFR24: Helpful error messages with actionable next steps
NFR25: Loading states for all async operations
NFR26: Confirmation dialogs for destructive actions
NFR27: Empty states with clear guidance
NFR28: Progressive disclosure for advanced features
NFR29: Onboarding tutorial for first-time users
NFR60: Celebration micro-moments for achievements (streak milestones, course completion, first note)
NFR61: Animation timing: 150ms micro-interactions, 300ms transitions, 500ms celebrations
NFR62: Respect prefers-reduced-motion for accessibility

**Integration (6 Requirements):**

NFR30: Support OpenAI API for AI features
NFR31: Support Anthropic API as alternative AI provider
NFR32: Handle API rate limits gracefully
NFR33: AI request timeout of 30 seconds
NFR34: Cache AI responses to minimize API calls
NFR35: Fallback to local processing if API unavailable
NFR63: Vercel AI SDK v2.0.31 for unified AI provider abstraction
NFR64: Support for streaming AI responses with abort controller
NFR71: AI request retry strategy: 3 retries with exponential backoff (1s, 2s, 4s) for transient errors (429, timeout, network)
NFR72: Context window management: prioritize current content, trim intelligently when exceeding token limits
NFR73: Privacy controls: user can clear all cached AI responses via "Clear AI Data" in Settings
NFR74: AI response caching in localStorage with TTL (24h for study plans, 7d for summaries), invalidate on source data change
NFR75: Token usage counter: track total tokens consumed, display simple total in Settings
NFR76: AI feature toggle: Settings switch to enable/disable all AI features, graceful degradation when disabled
NFR77: Partial streaming: if stream interrupts, display content received so far with retry option

**Accessibility (14 Requirements):**

NFR36: WCAG 2.1 AA+ compliance
NFR37: Keyboard navigation for all interactive elements
NFR38: Screen reader support with proper ARIA labels
NFR39: Text contrast ratio ≥4.5:1 (normal text), ≥3:1 (large text)
NFR40: Focus indicators visible and clear
NFR41: Alt text for all images
NFR42: Captions for video content
NFR43: Resizable text up to 200% without breaking layout
NFR44: No content flashing faster than 3 times per second
NFR45: Semantic HTML structure
NFR46: Form labels properly associated with inputs
NFR47: Touch targets ≥44x44px on mobile
NFR48: Skip navigation links
NFR49: Color not sole indicator of meaning
NFR65: Support system dark mode with OKLCH color space
NFR66: High contrast mode support for visually impaired users

**Security (7 Requirements):**

NFR50: All data stored locally (no server transmission without consent)
NFR51: Input validation to prevent XSS attacks
NFR52: CSP headers to prevent script injection
NFR53: Sanitize markdown content before rendering
NFR54: Secure handling of API keys (no hardcoding)
NFR55: No sensitive data in console logs (production)
NFR56: Regular dependency updates to patch vulnerabilities
NFR67: Content Security Policy (CSP) with strict-dynamic for inline scripts
NFR68: Sanitize user-generated content with rehype-sanitize in markdown editor
NFR69: No localStorage storage of sensitive data (API keys stored in memory only)
NFR70: Regular security audits with npm audit and dependency scanning

### Additional Requirements

**Technology Stack (from Architecture):**

- React 18.3.1 with TypeScript for type safety
- Vite 6.3.5 for build tooling with fast HMR
- Tailwind CSS v4 via @tailwindcss/vite plugin
- shadcn/ui component library with Radix UI primitives
- React Router v7 for client-side routing
- Zustand v5.0.11 for state management (selector-based subscriptions)
- Dexie.js v4.3.0 for IndexedDB abstraction
- react-player v3.4.0 for video playback
- react-pdf v10.3.0 for PDF viewing
- @uiw/react-md-editor for note-taking with react-markdown + rehype-sanitize
- MiniSearch for client-side full-text search
- Vercel AI SDK v2.0.31 with @ai-sdk/openai for AI features
- Framer Motion v12.34.0 with LazyMotion for animations
- date-fns for date formatting
- Lucide React for icons
- Vitest v4.0.18 for unit testing
- React Testing Library v16.3.2 for component testing
- fake-indexeddb for testing IndexedDB code
- Playwright for E2E testing

**Database Schema (Dexie.js):**

```javascript
db.version(1).stores({
  courses: '++id, name, importedAt, *tags',
  videos: '++id, courseId, filename, duration, completionStatus',
  pdfs: '++id, courseId, filename, pageCount',
  notes: 'id, courseId, videoId, *tags, createdAt, updatedAt',
  progress: '++id, courseId, videoId, currentTime, completionPercentage',
  streaks: '++id, date, minutesStudied',
  studySessions: '++id, courseId, startTime, endTime, duration',
  courseMomentum: 'courseId, score, category, lastStudied',
  bookmarks: 'id, courseId, lessonId, createdAt'
})

// Note: `notes` and `bookmarks` tables use manual ID (crypto.randomUUID())
// per Architecture convention. All other tables use ++id (auto-increment).
```

**Course Import Format:**

ZIP file structure:
```
course-name.zip
├── index.json (manifest with course metadata)
├── videos/
│   ├── lesson-1.mp4
│   ├── lesson-2.mp4
│   └── captions/
│       ├── lesson-1.en.vtt
│       └── lesson-2.en.vtt
├── pdfs/
│   ├── slides-1.pdf
│   └── handout.pdf
└── assets/
    └── thumbnail.jpg
```

index.json schema:
```json
{
  "name": "Course Title",
  "description": "Course description",
  "instructor": "Instructor Name",
  "tags": ["tag1", "tag2"],
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1",
      "lessons": [
        {
          "id": "lesson-1",
          "title": "Lesson Title",
          "type": "video",
          "filename": "videos/lesson-1.mp4",
          "duration": 930,
          "captions": ["videos/captions/lesson-1.en.vtt"]
        }
      ]
    }
  ]
}
```

**Responsive Design Specifications (from UX):**

- Desktop: 1440px+ (primary target, side-by-side layouts)
- Tablet: 768px-1439px (single column, collapsible sidebar)
- Mobile: 375px-767px (stacked layouts, hamburger menu)
- Spacing: 8px base grid (0.5rem increments in Tailwind)
- Border radius: 24px for cards, 12px for buttons/inputs
- Background: #FAF5EE (warm off-white, never hardcoded)
- Primary color: blue-600 for CTAs and active states
- Typography: System font stack, line-height 1.5-1.7, no center-aligned body text
- Touch targets: Minimum 44x44px on mobile
- Sidebar: Persistent on desktop, collapsible drawer on mobile/tablet

**Animation Specifications:**

- Micro-interactions: 150ms (hover states, button presses)
- Page transitions: 300ms (route changes, modal open/close)
- Celebrations: 500ms (streak milestones, course completion)
- Respect prefers-reduced-motion media query
- Use Framer Motion's LazyMotion for code splitting
- Maximum 3 concurrent animations to avoid visual overwhelm

**Code Conventions:**

- Component names: PascalCase (VideoPlayer, NoteEditor)
- Utility functions: camelCase (calculateMomentum, formatDuration)
- Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE, DEFAULT_PLAYBACK_SPEED)
- File naming: kebab-case (video-player.tsx, use-progress.ts)
- Custom hooks: usePascalCase (useProgress, useStudyStreak)
- Date handling: Always use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- ID generation: Use crypto.randomUUID() for all entity IDs
- Error handling: Custom error classes extending Error
- Testing: Vitest for unit tests, Playwright for E2E, fake-indexeddb for IndexedDB mocking

**Celebration Milestones:**

1. First course import → Welcome toast with confetti
2. First video completion → Green checkmark scale bounce (300ms)
3. 7-day study streak → 🔥 Fire badge unlock
4. 30-day study streak → ⚡ Lightning badge unlock
5. Course 100% completion → 🎉 Confetti animation (500ms) + completion certificate
6. First 10 notes created → 📝 Note-taker badge
7. 100 hours total study time → 🏆 Dedication badge

**Momentum Score Formula:**

```typescript
function calculateMomentumScore(course: Course): MomentumScore {
  const daysSinceLastStudy = (Date.now() - course.lastStudied) / (1000 * 60 * 60 * 24)
  const recencyScore = 100 * Math.exp(-daysSinceLastStudy / 7) // Decay over 7 days
  const completionScore = course.completionPercentage
  const weeklySessionCount = course.sessionsThisWeek
  const frequencyScore = Math.min(100, (weeklySessionCount / 4) * 100) // 4 sessions/week = 100%

  const totalScore = recencyScore * 0.4 + completionScore * 0.3 + frequencyScore * 0.3

  return {
    score: totalScore,
    category: totalScore >= 70 ? 'hot' : totalScore >= 40 ? 'warm' : 'cold',
    trend: calculateTrend(course) // Compare to 7 days ago
  }
}
```

**Error Recovery Patterns:**

1. IndexedDB corruption → Export data to JSON, clear DB, offer re-import
2. Course import failure → Show detailed validation errors, allow partial import
3. Video playback error → Fallback to native video element, log error
4. AI API failure → Show cached response if available, otherwise graceful degradation
5. Network timeout → Retry with exponential backoff (3 attempts), then fail gracefully

**API Integration (from Phase 5):**

- Mock API already implemented using Mockoon
- 6 REST endpoints: GET /api/courses, GET /api/courses/:id, GET /api/lessons/:id, POST /api/progress, GET /api/user/profile, GET /api/reports
- TypeScript types in src/types/api.ts
- API client library in src/lib/api.ts
- Docker integration with health checks
- CORS enabled for local development
- 25+ automated tests covering all endpoints
- Environment variable: VITE_API_URL=http://localhost:3000/api

**File System Access API (Greenfield Feature):**

- Use File System Access API for course import (Chrome/Edge only)
- Fallback to input[type=file] for Firefox/Safari
- Support drag-and-drop for ZIP files
- Show browser compatibility warning if File System Access API unavailable
- Store file handles for future access (with permission prompts)

### FR Coverage Map

**Epic 1 (Course Library & Video Learning):**
- FR1: Import course via ZIP file containing index.json manifest + video/PDF assets
- FR2: Parse index.json to extract course metadata (name, description, modules, lessons, tags)
- FR3: Store imported assets in IndexedDB (videos, PDFs, metadata)
- FR4: Display list of all imported courses with metadata
- FR54: Validate ZIP structure on import with detailed error messages
- FR55: Support course import via File System Access API (Chrome/Edge) with fallback to input[type=file]
- FR7: Play video files from IndexedDB using react-player
- FR8: Display video title, duration, and current timestamp
- FR9: Implement playback controls (play, pause, seek, volume, mute, fullscreen)
- FR10: Track current playback position per video
- FR11: Resume playback from last position
- FR12: Mark videos as complete when watched to 95%+ or manually marked
- FR13: Support common video formats (MP4, WebM, OGG)
- FR14: Track completion status per video (not started, in progress, completed)
- FR15: Calculate course completion percentage based on completed videos
- FR16: Track total watch time per course
- FR56: Support keyboard shortcuts (Space = play/pause, Arrow keys = seek ±5s, T = timestamp, C = captions, F = fullscreen, M = mute)
- FR57: Support WebVTT caption files with toggle, language selection, and font size adjustment (14pt-20pt)
- FR58: Display video completion celebration micro-moment (green checkmark scale bounce animation, 300ms)
- FR59: Show video progress bar with watched segments visualization
- FR60: Support playback speed control (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- FR61: Auto-advance to next video in module with 5-second countdown and cancel option
- FR62: Picture-in-picture mode support for multitasking
- FR17: Display progress indicators on course/module cards
- FR18: Persist progress data locally in IndexedDB
- FR19: Export progress data as JSON for backup

**Epic 2 (Learning Paths & Course Organization):**
- FR69: Import learning path from folder structure containing multiple course subfolders
- FR70: Auto-detect sequential path ordering from folder naming/numbering conventions
- FR71: Navigate through path courses with visual progress indicators showing completion
- FR72: Prevent circular path references with cycle detection (max 4 nesting levels: Path → Course → Module → Lesson)
- FR73: Storage quota validation before path import (reject if exceeds 80% available quota)
- FR74: Course deletion protection (prevent deletion if course belongs to any active path)
- FR75: Export learning paths and progress data as JSON for backup/sharing
- FR5: Allow course deletion with confirmation dialog (with path membership protection)
- FR6: Support course tagging and filtering

**Epic 3 (Active Learning Tools):**
- FR20: Create timestamped notes linked to specific video moments
- FR21: Support markdown formatting in notes using @uiw/react-md-editor
- FR22: Tag notes for organization and retrieval
- FR23: Search notes by content, tags, or course
- FR24: Display notes in chronological or timestamp order
- FR25: Edit and delete existing notes
- FR26: Export notes as markdown file
- FR27: Auto-save notes with 3-second debounce and 10-second max wait
- FR76: Insert video timestamp into note via keyboard shortcut (T key)
- FR77: Side-by-side layout on desktop (video player + note editor), stacked on mobile
- FR45: Track bookmarks for quick access to important lessons

**Epic 4 (Habit Formation & Streaks):**
- FR28: Track daily study time (minutes per day)
- FR29: Calculate study streak (consecutive days with ≥10 minutes study time)
- FR30: Display streak calendar with visual indicators
- FR31: Show streak count and longest streak
- FR32: Send celebration notifications for streak milestones
- FR33: Track weekly study goals and show progress
- FR34: Display "days since last study" if streak broken
- FR35: Visualize study consistency over time (weekly/monthly heatmap)

**Epic 5 (Insights & Learning Analytics):**
- FR36: Calculate momentum score per course (recency × 0.4 + completion × 0.3 + frequency × 0.3)
- FR37: Categorize courses as hot (≥70), warm (40-69), or cold (<40)
- FR38: Display momentum indicators on course cards (🔥/⚡/❄️ icons)
- FR39: Show "Continue Learning" smart resume suggestion
- FR40: Track study sessions (start time, end time, course, duration)
- FR41: Calculate average session length and total study hours
- FR42: Display recent activity timeline (last 7 days)
- FR43: Show time-of-day study patterns (morning, afternoon, evening, night)
- FR44: Visualize completion rate by course category
- FR46: Display "most studied" and "least studied" courses
- FR47: Show estimated time to complete remaining content
- FR64: Display momentum score visually on course cards with color-coded indicators
- FR65: Show momentum trend (↑ improving, → stable, ↓ declining) based on 7-day comparison

**Epic 6 (AI-Powered Learning Assistant):**
- FR48: Generate study plan recommendations based on progress and goals → Story 6.6
- FR49: Summarize video content from captions/transcripts → Story 6.3
- FR50: Answer questions about course content using RAG → Story 6.4
- FR51: Suggest related courses based on study history → Story 6.7
- FR52: Generate quiz questions from video content → Story 6.5
- FR53: Provide study tips and learning strategies → Story 6.6
- FR66: Support multiple AI providers (OpenAI, Anthropic) via Vercel AI SDK v2.0.31 → Story 6.1 (infrastructure), Story 6.2 (settings UI)
- FR67: AI context limit of 32K tokens with automatic chunking for long videos → Story 6.1, 6.3, 6.4
- FR68: AI response streaming with cancellation support → Story 6.1
- FR69: AI-assisted note enhancement (organize, restructure, suggest tags) → Story 6.8
- FR70: Suggest concept connections across different courses → Story 6.8
- FR72: Display contextual AI coaching suggestions (rule-based core; AI-enhanced when provider configured) → Story 6.9
- FR73: Add notes and course content to search results in command palette → Story 6.9
- FR74: Show/hide dashboard widgets via Settings toggles with preference persistence → Story 6.10

**Deferred (Future Epic):**

- FR78: View learning velocity metrics (deferred; original FR45 requirement)

**Coverage Status:** ✅ All 76 FRs mapped (100% coverage — includes 68 original FRs + FR76-77 renumbered from Note-Taking + FR78 deferred + FR69-70, FR72-74 added for Epic 6)

## Epic List

### Epic 1: Course Library & Video Learning

**Goal:** Enable users to import courses from folders/ZIP files and consume video content with professional-grade playback controls, progress tracking, and persistence in a fully functional offline-first learning environment.

**User Outcome:** Users can import their course libraries, watch videos with advanced playback features (keyboard shortcuts, captions, speed control, PiP), track completion progress, resume where they left off, and export their progress data.

**FRs Covered:** FR1-6, FR7-13, FR14-19, FR54-62 (26 FRs)

**NFRs Addressed:**
- NFR1-3: Initial load <2s, navigation <200ms, video playback <500ms (via Vite code splitting, Dexie.js optimization)
- NFR17-19: Zero-click resume, <3 clicks to core workflows (via smart "Continue Learning")
- NFR26-29: File System Access API integration, file format support (MP4/WebM/OGG)
- NFR36-49: WCAG 2.1 AA+ compliance foundation (semantic HTML, keyboard nav, ARIA labels)
- NFR50-52: XSS prevention, CSP headers, input validation on course import
- NFR37: Keyboard accessibility for all video controls (Space, arrows, F, M, C, T)
- NFR42: Captions for video content (WebVTT support)
- NFR60-62: Celebration micro-moments with proper animation timing (150ms/300ms/500ms), prefers-reduced-motion respect
- NFR9: UI animations at 60fps (via Framer Motion LazyMotion)
- NFR18: IndexedDB persistence for progress data export

---

### Epic 2: Learning Paths & Course Organization

**Goal:** Enable users to import and navigate multi-course learning paths with sequential progression, organize course libraries with tagging/filtering, and maintain data integrity with deletion safeguards.

**User Outcome:** Users can import structured learning journeys (paths containing multiple courses), navigate through courses sequentially, see path-level progress, organize their library with tags/filters, and safely delete courses with protection against breaking active paths.

**FRs Covered:** FR5, FR6, FR69-75 (9 FRs: 7 greenfield + FR5 deletion + FR6 tagging/filtering)

**Stories:** 2.1 Import, 2.2 Navigation, 2.3 Tagging, 2.4 Filtering, 2.5 Data Protection & Export

**Greenfield Learning Path FRs:**
- FR69: Import learning path from folder structure containing multiple course subfolders
- FR70: Auto-detect sequential path ordering from folder naming/numbering conventions
- FR71: Navigate through path courses with visual progress indicators showing completion
- FR72: Prevent circular path references with cycle detection (max 4 nesting levels: Path → Course → Module → Lesson)
- FR73: Storage quota validation before path import (reject if exceeds 80% available quota)
- FR74: Course deletion protection (prevent deletion if course belongs to any active path)
- FR75: Export learning paths and progress data as JSON for backup/sharing

**NFRs Addressed:**
- NFR3: IndexedDB queries <100ms for path navigation
- NFR14: Zero data loss on browser crash (Dexie.js transactions)
- NFR24: Helpful error messages for circular references, storage limits, deletion conflicts
- NFR26: Confirmation dialogs for destructive actions (course deletion)
- NFR51: Input validation on path import to prevent XSS

---

### Epic 3: Active Learning Tools

**Goal:** Transform passive video watching into active learning through timestamped notes, markdown support, tagging, search, and bookmarks.

**User Outcome:** Users can capture insights during videos with timestamp links, organize notes with tags, search their knowledge base, bookmark important lessons, and export their notes.

**Stories:** 3.1 Note Editor, 3.2 Timestamps, 3.3 Autosave, 3.4a Delete, 3.4b Course Notes List, 3.5 Tagging & Search, 3.6 Export, 3.7a Bookmark Toggle, 3.7b Bookmarks Page

**FRs Covered:** FR20-27, FR45, FR76-77 (11 FRs) _(FR45 redefined from PRD "learning velocity metrics" to "bookmarks" — see Requirements Inventory)_

**NFRs Addressed:**
- NFR6: Note autosave <3 seconds with 10-second max wait (3-second debounce)
- NFR5: Search results <300ms (via MiniSearch full-text indexing)
- NFR51: Sanitize markdown to prevent XSS (rehype-sanitize)
- NFR20-22: Zero-click resume to notes, intuitive navigation, <3 clicks to core workflows
- NFR43: Resizable text without breaking layout (markdown editor responsive design)

---

### Epic 4: Habit Formation & Streaks

**Goal:** Motivate consistent learning habits through daily streak tracking, milestone celebrations, and habit analytics visualization.

**User Outcome:** Users build sustainable study habits with streak tracking, receive motivational celebrations at milestones, and visualize their learning consistency over time.

**FRs Covered:** FR28-35 (8 FRs)

**NFRs Addressed:**
- NFR15: Atomic progress state changes for streak calculations (Dexie.js transactions)
- NFR32: Celebration notifications for milestones (via Web Notifications API)
- NFR60: Celebration micro-moments (🔥 fire badge, ⚡ lightning badge)
- NFR4: Page navigation <200ms for streak calendar interactions

---

### Epic 5: Insights & Learning Analytics

**Goal:** Provide data-driven insights through momentum scoring, study pattern analytics, and smart recommendations to optimize learning strategy.

**User Outcome:** Users understand which courses need attention (hot/warm/cold momentum), see study patterns (time-of-day, session analytics), get smart resume suggestions, and make informed decisions about what to study next.

**FRs Covered:** FR36-44, FR46-47, FR64-65 (13 FRs — FR45 belongs to Epic 3)

**NFRs Addressed:**
- Architecture performance target (§ Performance Optimization, line 874): IndexedDB queries <100ms for momentum calculations (via compound indexes). **Note:** This target originates from the Architecture document, not from PRD NFR3. PRD NFR3 is "Video playback starts instantly with no buffering for local files" and does not apply to this epic.
- NFR15: Atomic progress state changes — IndexedDB failure handling with in-memory fallback
- NFR17: Zero-click resume via "Continue Learning" smart suggestion (hot course detection)
- NFR21: <3 clicks to reach analytics dashboard
- NFR7: Stable memory footprint for large analytics datasets (efficient aggregation algorithms)

---

### Epic 6: AI-Powered Learning Assistant

**Goal:** Enhance learning with AI-powered features including study plans, content summaries, Q&A, course recommendations, quiz generation, note enhancement, concept connections, and contextual coaching suggestions.

**User Outcome:** Users get personalized study plans, instant summaries of video content, answers to questions about course material, relevant course suggestions, auto-generated quizzes, AI-assisted note organization, cross-course concept connections, and contextual coaching nudges. Dashboard widgets can be customized and search results include notes.

**FRs Covered:** FR48-53, FR66-70, FR72-74 (14 FRs)

**NFRs Addressed:**
- NFR30-35, NFR63-64: OpenAI/Anthropic API support via Vercel AI SDK, 30s timeout, graceful fallback, response caching, streaming
- NFR53-54: Data locality (all data remains local except AI API calls), no PII in API calls
- NFR71: Retry with exponential backoff for transient AI errors
- NFR72: Context window management (prioritize current content within token limits)
- NFR73: Privacy controls (clear cached AI data)
- NFR74: Response caching with TTL
- NFR75: Token usage tracking
- NFR76: AI feature toggle with graceful degradation
- NFR77: Partial streaming response handling

---

**Coverage Status:** ✅ All 78 FRs mapped (100% coverage — 68 original FRs + 7 greenfield Learning Path FRs + FR76-77 renumbered from Note-Taking collision + FR78 deferred)

---

## Epic 1: Course Library & Video Learning

Enable users to import courses from folders/ZIP files and consume video content with professional-grade playback controls, progress tracking, and persistence in a fully functional offline-first learning environment.

### Story 1.1: Course Import from Folder with Auto-Detection

As a learner,
I want to import my course library from a folder on my SSD/NAS/HDD,
So that I can access all my learning materials in one place without duplicating files or consuming browser storage.

**Acceptance Criteria:**

**Given** I have courses stored in nested folder structures on my file system (SSD, NAS, or HDD)
**When** I click "Import Course" and select a course root folder
**Then** The system uses File System Access API (Chrome/Edge) to store a persistent file handle (not file contents)
**And** The folder structure is scanned for index.json manifest files at any nesting level (up to 6 folder levels deep)
**And** If index.json is found, course metadata is extracted (name, description, modules, lessons, tags)
**And** If index.json is missing, folder structure is used to auto-generate course metadata (folder name = course name, subfolders = modules, video/PDF files = lessons)
**And** All metadata is stored in IndexedDB (~1-5MB per course) but video/PDF files remain on original file system
**And** Chrome/Edge users can re-access courses on future sessions without re-importing (permissions persist until explicitly revoked)
**And** Firefox/Safari users see a warning: "Your browser requires re-importing courses each session. For persistent access, use Chrome or Edge."
**And** Firefox/Safari users can import via `<input type="file" webkitdirectory>` for one-time folder read (requires drag-drop or re-import each session)

**Given** A folder structure exceeds 6 nesting levels
**When** Import is attempted
**Then** Import fails with error message: "Course structure too deep (>6 levels). Maximum supported: Path → Course → Module → Chapter → Section → Subsection → File. Please reorganize your course folders."
**And** No partial import occurs (transaction rollback)

**Given** Metadata storage would exceed 80% of available IndexedDB quota
**When** Import is attempted
**Then** Import is rejected with error: "Insufficient storage for course metadata. Please free up space or delete unused courses."
**And** Current quota usage and required space are displayed

**Given** User drags and drops a ZIP file onto the import area
**When** ZIP is dropped
**Then** The system extracts ZIP contents to temporary directory, validates structure, imports course, then cleans up temporary files
**And** Same folder nesting rules apply (max 6 levels, index.json detection)
**And** ZIP validation errors are shown before extraction begins (invalid structure, exceeds 6 levels, missing manifest)

**Given** User has successfully imported a course
**When** Course appears in "My Courses" library
**Then** Course card displays name, description, thumbnail (if provided), module count, total lessons, and tags
**And** Total estimated duration is calculated from video file metadata
**And** Import timestamp is recorded

**Technical Requirements:**
- Use File System Access API (`window.showDirectoryPicker()`) for Chrome/Edge with persistent permission storage
- Fallback to `<input type="file" webkitdirectory>` for Firefox/Safari with session-only access
- Use Dexie.js v4.3.0 for IndexedDB operations with transaction safety
- Store file handles in `courseFiles` table (id, courseId, fileHandle, filePath, fileType, fileSize, lastModified)
- Store course metadata in `courses` table (id, name, description, thumbnail, tags, modules[], importedAt, lastAccessedAt, totalDuration)
- Validate folder nesting depth before processing (reject at >6 levels)
- Check IndexedDB quota via `navigator.storage.estimate()` before import
- Support index.json schema: `{ name: string, description: string, modules: { name: string, lessons: { title: string, file: string, duration?: number }[] }[], tags?: string[] }`

**FRs Fulfilled:** FR1, FR2, FR3, FR4, FR54, FR55

---

### Story 1.2: Video Playback with Progress Tracking

As a learner,
I want to play videos from my imported courses with automatic progress tracking,
So that I can resume where I left off and see my learning progress without manual intervention.

**Acceptance Criteria:**

**Given** I have imported a course with video files (MP4, WebM, or OGG)
**When** I click on a lesson video from the course module list
**Then** The video player opens with the video file streamed from its original file system location (via stored file handle)
**And** Video title, total duration, and current timestamp (00:00 / 12:34) are displayed above the player
**And** react-player v3.4.0 renders the video with browser-native controls initially enabled

**Given** The video player is open
**When** I interact with playback controls
**Then** I can play, pause, seek (via progress bar drag or click), adjust volume (0-100%), mute/unmute, and toggle fullscreen
**And** All controls are keyboard accessible (Space = play/pause, Left/Right arrows = seek ±5s, M = mute, F = fullscreen)
**And** Control interactions update the current timestamp display in real-time

**Given** I am watching a video
**When** Playback position changes (via seeking, natural playback, or scrubbing)
**Then** Current position is tracked in Zustand store state (`currentVideo: { videoId, position, duration, status }`)
**And** Every 5 seconds during playback, position is persisted to IndexedDB `videoProgress` table
**And** `videoProgress` schema: `{ id: videoId, courseId, lessonId, position: number (seconds), duration: number, status: 'not-started' | 'in-progress' | 'completed', lastWatchedAt: timestamp, totalWatchTime: number }`

**Given** I have previously watched part of a video
**When** I reopen the same video
**Then** Playback automatically resumes from last saved position (within ±2 seconds)
**And** A toast notification appears: "Resuming from [timestamp]" (dismissible after 3 seconds)
**And** If last position is within 10 seconds of end, video starts from beginning instead

**Given** I watch a video to 95%+ of its duration OR manually click "Mark Complete"
**When** Completion threshold is reached
**Then** Video status changes to `completed` in IndexedDB `videoProgress` table
**And** Lesson card in module list shows green checkmark icon
**And** Completion timestamp is recorded in `completedAt` field

**Given** I have completed multiple videos in a course
**When** Course completion percentage is calculated
**Then** Percentage = (completed videos / total videos) × 100
**And** Course card in library displays progress bar with percentage (e.g., "65% complete")
**And** Module cards show per-module completion (e.g., "Module 1: 3/5 videos complete")

**Given** I watch videos across multiple sessions
**When** Total watch time is tracked
**Then** Each video's `totalWatchTime` accumulates actual playback duration (pauses excluded)
**And** Course-level total watch time is sum of all video watch times
**And** Watch time is displayed on course analytics page (e.g., "12.5 hours watched")

**Given** A video file format is unsupported by react-player
**When** Playback is attempted
**Then** Error message displays: "Video format not supported. Supported formats: MP4, WebM, OGG."
**And** Video is marked as "unsupported" in lesson list with warning icon

**Technical Requirements:**
- Use react-player v3.4.0 with `file` player for local file playback
- Stream videos from file handles using `URL.createObjectURL(file)` pattern (memory-efficient, no full file load)
- Use Zustand v5.0.11 for playback state management (currentVideo, playbackRate, volume, muted)
- Debounce position updates to IndexedDB (max 1 write per 5 seconds during active playback)
- Use Dexie.js transaction-safe writes for progress persistence
- Implement completion detection: `(currentTime / duration) >= 0.95` OR manual button click
- Calculate course completion reactively using Dexie.js `liveQuery()` for real-time updates
- Support file formats: MP4 (H.264/AAC), WebM (VP8/VP9/Vorbis), OGG (Theora/Vorbis)
- Handle file access errors gracefully (show "File no longer accessible. Re-import course to restore access.")

**FRs Fulfilled:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR18

---

### Story 1.3: Advanced Video Features - Keyboard Shortcuts & Accessibility

As a learner,
I want to control video playback using keyboard shortcuts and access captions,
So that I can learn efficiently without relying on mouse interactions and understand content in different languages or contexts.

**Acceptance Criteria:**

**Given** I am watching a video in the player
**When** I press keyboard shortcuts
**Then** The following actions are triggered:
- **Space**: Toggle play/pause
- **Left Arrow**: Seek backward 5 seconds
- **Right Arrow**: Seek forward 5 seconds
- **Up Arrow**: Increase volume 10%
- **Down Arrow**: Decrease volume 10%
- **M**: Toggle mute/unmute
- **F**: Toggle fullscreen mode
- **C**: Toggle captions on/off
- **T**: Copy current timestamp to clipboard (e.g., "12:34") with toast notification "Timestamp copied"
- **0-9**: Seek to 0%-90% of video duration (e.g., "5" = 50% position)
**And** All shortcuts work regardless of which UI element has focus (except when typing in text fields)
**And** Keyboard shortcuts are documented in a "?" help overlay accessible via "?" key press

**Given** A course folder contains WebVTT caption files (*.vtt) alongside video files
**When** Video is loaded
**Then** Caption files matching video filename are auto-detected (e.g., `video.mp4` → `video.en.vtt`, `video.es.vtt`)
**And** Caption tracks are parsed and loaded into react-player
**And** If multiple caption files exist, language codes are extracted from filenames (e.g., `.en.vtt` = English, `.es.vtt` = Spanish)
**And** Caption availability is indicated by "CC" badge on video player controls

**Given** Captions are available for the current video
**When** I click the "CC" button or press "C" key
**Then** Captions toggle on/off
**And** Caption on/off state persists per video in IndexedDB `videoProgress` table (new field: `captionsEnabled: boolean`)
**And** When captions are on, current caption text displays in standard position (bottom-center of video, semi-transparent black background, white text)

**Given** Multiple caption tracks are available (different languages)
**When** I click the captions settings icon (gear icon next to CC button)
**Then** A popover menu displays:
- Caption language options (e.g., "English", "Spanish", "Off")
- Font size slider (14pt - 20pt, default 16pt)
**And** Selected language and font size persist in `videoProgress` table (new fields: `captionLanguage: string`, `captionFontSize: number`)
**And** Caption language selection updates immediately without video reload

**Given** I am watching a video with captions enabled
**When** Caption font size is adjusted
**Then** Caption text size updates in real-time (14pt-20pt range)
**And** Font size setting persists across all videos in the same course
**And** Caption text remains readable with proper contrast (white text on semi-transparent black, min 7:1 contrast ratio per WCAG AAA)

**Given** I am using keyboard navigation
**When** I tab through video player controls
**Then** All interactive elements receive visible focus indicators (blue outline, 2px solid)
**And** ARIA labels are present on all icon-only buttons:
  - Play/Pause: "Play video" / "Pause video"
  - Volume: "Volume control"
  - Fullscreen: "Enter fullscreen" / "Exit fullscreen"
  - Captions: "Toggle captions"
  - Settings: "Caption settings"
**And** Screen readers announce playback state changes ("Playing", "Paused", "Buffering")

**Given** A video does not have caption files
**When** Video player loads
**Then** "CC" button is disabled with tooltip: "No captions available for this video"
**And** Pressing "C" key shows toast notification: "No captions available"

**Technical Requirements:**
- Implement global keyboard event listener at video player component level (capture phase to override browser defaults)
- Use `event.preventDefault()` to prevent default browser behaviors (e.g., Space = scroll page)
- Exclude keyboard shortcuts when focus is inside text inputs (check `event.target.tagName`)
- Parse WebVTT files using standard browser `<track>` element or library (e.g., `webvtt-parser` if custom parsing needed)
- Auto-detect caption files with naming convention: `{videoFilename}.{languageCode}.vtt` (e.g., `lecture1.en.vtt`, `lecture1.es.vtt`)
- Store caption preferences in `videoProgress` table: `captionsEnabled: boolean`, `captionLanguage: string`, `captionFontSize: number` (default 16)
- Apply caption styling via CSS: `background: rgba(0,0,0,0.8)`, `color: white`, `font-size: var(--caption-font-size)`, `padding: 4px 8px`, `border-radius: 4px`
- Implement keyboard shortcut help overlay (modal) with table of all shortcuts (dismissible via "?" or "Esc")
- Ensure WCAG 2.1 AA+ compliance: focus indicators visible, ARIA labels present, keyboard navigable
- Use react-player's `onProgress`, `onPlay`, `onPause` callbacks to announce state changes to screen readers via `aria-live` regions

**FRs Fulfilled:** FR56, FR57

---

### Story 1.4: Enhanced Playback & Progress Visualization

As a learner,
I want advanced playback controls (speed, auto-advance, picture-in-picture), visual progress tracking, and data export,
So that I can learn at my own pace, see my achievements, and back up my progress.

**Acceptance Criteria:**

**Playback Speed Control:**

**Given** I am watching a video
**When** I click the playback speed button (displays current speed, e.g., "1x")
**Then** A dropdown menu appears with speed options: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
**And** Selecting a speed changes playback rate immediately without interrupting video
**And** Selected speed is indicated with checkmark in dropdown
**And** Current speed is displayed on the button (e.g., "1.5x")
**And** Playback speed persists per user (applies to all videos) in localStorage `preferredPlaybackSpeed`
**And** Audio pitch remains unchanged at all speeds (browser's native pitch correction)

**Auto-Advance to Next Video:**

**Given** A video completes (reaches end or 95%+ watched)
**When** There is a next video in the current module's lesson sequence
**Then** A 5-second countdown overlay appears: "Next video: [title] in 5... 4... 3... 2... 1..."
**And** User can click "Cancel" button to stop auto-advance
**And** User can click "Play Now" button to skip countdown and play immediately
**And** If countdown completes without cancellation, next video loads and plays automatically
**And** Auto-advance preference is stored in localStorage `autoAdvanceEnabled: boolean` (default: true)
**And** Settings page includes toggle: "Auto-advance to next video"

**Given** A video completes but it's the last video in the module
**When** Auto-advance countdown would trigger
**Then** Overlay shows: "Module complete! 🎉" (no countdown, only close button)
**And** Course/module completion stats are displayed (e.g., "3/5 modules complete")

**Picture-in-Picture Mode:**

**Given** I am watching a video
**When** I click the Picture-in-Picture (PiP) button or press "P" key
**Then** Video enters PiP mode (floating window, browser-native)
**And** PiP window shows video with basic controls (play/pause, close)
**And** I can navigate to other tabs/applications while video continues playing in PiP
**And** Progress tracking continues in background (position saved every 5 seconds)
**And** Closing PiP window returns video to normal player view
**And** PiP mode availability is indicated by button enabled state (disabled in Firefox if unsupported)

**Progress Bar with Watched Segments:**

**Given** I am watching a video with partial watch history
**When** Video player renders the progress bar
**Then** The progress bar shows:
- **Gray background**: Unwatched segments
- **Light blue**: Watched segments (previously viewed portions)
- **Dark blue**: Current playback position indicator
**And** Watched segments are stored in IndexedDB `videoProgress` table as `watchedSegments: { start: number, end: number }[]`
**And** Hovering over progress bar shows timestamp tooltip (e.g., "12:34 / 45:00")
**And** Clicking progress bar seeks to that position and updates watched segments

**Course/Module Progress Indicators:**

**Given** I am viewing my course library or course detail page
**When** Course/module cards are rendered
**Then** Each card displays:
- **Progress bar** (horizontal, full width, height 4px) showing completion percentage
- **Percentage text** above bar (e.g., "65% complete")
- **Completion fraction** (e.g., "13/20 videos complete")
**And** Course cards in library show course-level progress: `(completed videos / total videos) × 100`
**And** Module cards in course detail show module-level progress: `(completed module videos / total module videos) × 100`
**And** Completed courses/modules show green checkmark icon + "100% complete"
**And** Progress bars use color coding:
  - 0-33%: Red (`bg-red-500`)
  - 34-66%: Yellow (`bg-yellow-500`)
  - 67-99%: Blue (`bg-blue-500`)
  - 100%: Green (`bg-green-500`)

**Video Completion Celebration:**

**Given** I complete a video (reach 95%+ or click "Mark Complete")
**When** Completion is triggered
**Then** A green checkmark icon (✓) appears center-screen with scale bounce animation:
- **Animation**: Scale from 0 → 1.2 → 1.0 over 300ms (ease-out cubic-bezier)
- **Icon size**: 64px × 64px
- **Background**: Semi-transparent white circle (80% opacity)
- **Duration**: Visible for 1.5 seconds then fade out (200ms)
**And** Animation respects `prefers-reduced-motion` (if enabled, shows instant checkmark without animation)
**And** Lesson card in module list updates to show persistent green checkmark (16px, next to lesson title)
**And** If course completion reaches 100%, additional celebration appears: "🎉 Course Complete!" toast notification (5-second duration)

**Progress Data Export:**

**Given** I want to back up my learning progress
**When** I navigate to Settings → Data Export and click "Export Progress Data"
**Then** A JSON file is generated and downloaded: `levelup-progress-{YYYY-MM-DD}.json`
**And** JSON includes:
```json
{
  "exportedAt": "2026-02-14T10:30:00Z",
  "courses": [
    {
      "courseId": "uuid",
      "courseName": "Course Name",
      "progress": {
        "completedVideos": 13,
        "totalVideos": 20,
        "completionPercentage": 65,
        "totalWatchTime": 45000,
        "videos": [
          {
            "videoId": "uuid",
            "lessonTitle": "Lesson 1",
            "status": "completed",
            "position": 1234,
            "duration": 1500,
            "completedAt": "2026-02-13T15:20:00Z",
            "totalWatchTime": 1500,
            "watchedSegments": [{"start": 0, "end": 1500}]
          }
        ]
      }
    }
  ]
}
```
**And** Export completes in <2 seconds for libraries with up to 100 courses
**And** Success toast notification appears: "Progress data exported successfully"

**Technical Requirements:**

**Playback Speed:**
- Use react-player's `playbackRate` prop (0.5-2.0 range)
- Store in localStorage: `preferredPlaybackSpeed: number` (default: 1.0)
- Validate speed selection (only allow preset values)

**Auto-Advance:**
- Implement countdown timer using `setInterval` (1-second updates)
- Use react-player's `onEnded` callback to trigger countdown
- Determine next video from course `modules[].lessons[]` array (current index + 1)
- Store preference in localStorage: `autoAdvanceEnabled: boolean`

**Picture-in-Picture:**
- Use browser PiP API: `videoElement.requestPictureInPicture()`
- Detect PiP support: `document.pictureInPictureEnabled`
- Handle `enterpictureinpicture` and `leavepictureinpicture` events
- Continue progress tracking in background (no pause on PiP enter)

**Progress Visualization:**
- Store watched segments in `videoProgress.watchedSegments: { start: number, end: number }[]`
- Update segments on seek/playback using interval tracking (every 5 seconds)
- Merge overlapping segments to optimize storage
- Render progress bar using CSS gradients: `background: linear-gradient(to right, ...)`
- Calculate completion percentage reactively using Dexie.js `liveQuery()`

**Celebration Animation:**
- Use Framer Motion for animation: `motion.div` with `initial={{ scale: 0 }}`, `animate={{ scale: [0, 1.2, 1] }}`
- Timing: `transition={{ duration: 0.3, ease: "easeOut" }}`
- Respect `prefers-reduced-motion`: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Use Lucide React `Check` icon component

**Data Export:**
- Query all courses and video progress from Dexie.js
- Generate JSON using `JSON.stringify(data, null, 2)` for readable formatting
- Trigger download using Blob + URL.createObjectURL pattern
- Filename format: `levelup-progress-${new Date().toISOString().split('T')[0]}.json`

**FRs Fulfilled:** FR17, FR19, FR58, FR59, FR60, FR61, FR62

---

## Epic 2: Learning Paths & Course Organization

Enable users to import and navigate multi-course learning paths with sequential progression, organize course libraries with tagging/filtering, and maintain data integrity with deletion safeguards.

### Story 2.1: Learning Path Import & Structure Detection

As a learner,
I want to import multi-course learning paths from folder structures,
So that I can follow structured learning journeys across multiple courses with automatic sequencing.

**Acceptance Criteria:**

**Given** I have a folder structure containing multiple course subfolders (e.g., `/Web Development Path/01-HTML Basics/`, `/Web Development Path/02-CSS Fundamentals/`, `/Web Development Path/03-JavaScript Intro/`)
**When** I click "Import Learning Path" and select the parent folder
**Then** The system uses File System Access API (Chrome/Edge) to scan the folder structure
**And** Each subfolder is identified as a course within the path (same detection logic as Story 1.1: index.json or folder-based)
**And** Sequential ordering is auto-detected from folder naming conventions:
  - Numeric prefixes: `01-`, `02-`, `03-`
  - Letter prefixes: `A-`, `B-`, `C-`
  - No prefix: Alphabetical order
**And** Path metadata is stored in IndexedDB `learningPaths` table: `{ id, name, description, courses: [{ courseId, order, name }], createdAt }`

**Given** A learning path folder structure is being imported
**When** Folder structure is analyzed
**Then** System validates nesting depth does not exceed 4 levels: `Path → Course → Module → Lesson`
**And** If nesting exceeds 4 levels, import is rejected with error: "Learning path structure too deep. Maximum allowed: Path → Course → Module → Lesson (4 levels). Detected [X] levels."
**And** Nesting validation occurs before any course import begins (early validation)

**Given** A learning path is being created or imported
**When** System validates path structure
**Then** Circular reference detection algorithm runs before import:
1. Build directed graph of path → course relationships
2. Perform depth-first search (DFS) to detect cycles
3. If cycle detected, reject import with error:
   - "Circular reference detected: [Path A] → [Course X] → [Path B] → [Course Y] → [Path A]. Learning paths cannot reference each other in cycles."
**And** Circular detection applies to nested paths (paths containing other paths as courses)
**And** Max allowed nesting: 4 levels (Path → Course → Module → Lesson)

**Given** A learning path contains 10 courses averaging 2GB metadata each
**When** Import is initiated
**Then** System checks total metadata storage requirement (sum of all course metadata)
**And** If import would exceed 80% of available IndexedDB quota, import is rejected with error:
  - "Insufficient storage for learning path. Required: [X] MB, Available: [Y] MB. Please delete unused courses or reduce path size."
**And** Storage check uses `navigator.storage.estimate()` for available quota
**And** Current quota usage percentage is displayed (e.g., "Currently using 45% of storage")

**Given** A learning path import passes all validations
**When** Import proceeds
**Then** Each course in the path is imported sequentially (not in parallel) to avoid quota race conditions
**And** Import progress is displayed: "Importing course 3 of 10: JavaScript Intro..."
**And** If any single course import fails, entire path import rolls back (transaction-safe)
**And** On successful import, path appears in "My Learning Paths" section of library
**And** Path card displays: name, course count, total estimated duration, overall completion percentage (0% initially)

**Given** I am importing a path where some courses already exist in my library
**When** Duplicate courses are detected (matching course name or folder path)
**Then** System shows dialog: "3 courses already imported. Reuse existing (recommended) or import duplicates?"
**And** If "Reuse existing" selected, path links to existing course entries (no duplication)
**And** If "Import duplicates" selected, new course entries are created with "(Copy)" suffix in name

**Given** A learning path has successfully imported
**When** I view the path detail page
**Then** All courses in the path are listed in sequential order
**And** Each course card shows: name, module count, lesson count, completion percentage, "Start" or "Continue" button
**And** Clicking a course card navigates to that course's detail page
**And** Path-level stats are displayed: "5/10 courses complete", "45 hours total content", "65% overall completion"

**Technical Requirements:**
- Use File System Access API (`window.showDirectoryPicker()`) for folder selection (Chrome/Edge)
- Fallback to `<input type="file" webkitdirectory multiple>` for Firefox/Safari (requires re-import each session)
- Detect course ordering using regex patterns: `/^(\d+)[-.]\s*/` (numeric), `/^([A-Z])[-.]\s*/` (letter)
- Store learning paths in `learningPaths` table: `{ id, name, description, courses: { courseId, order }[], createdAt, lastAccessedAt }`
- Create junction table `pathCourses`: `{ pathId, courseId, order, addedAt }` for many-to-many relationship
- Validate nesting depth by counting path separators in file paths (reject if >4 levels from path root)
- Calculate storage requirement: Sum of all course metadata sizes + path metadata (~10KB per path)
- Use Dexie.js transactions to ensure atomic path import (all courses or none)
- Implement progress tracking using async iterator with yield for UI updates
- Query duplicate courses using indexed search on `courses.name` and `courses.folderPath` fields

**FRs Fulfilled:** FR69, FR70, FR73

---

### Story 2.2: Path Navigation & Progress Tracking

As a learner,
I want to navigate through learning path courses sequentially with visual progress tracking and circular reference protection,
So that I can follow a structured learning journey without confusion or infinite loops.

**Acceptance Criteria:**

**Given** I am viewing a learning path detail page
**When** Path courses are displayed
**Then** Each course card shows:
- Course name and description
- Module count and total lesson count
- Completion percentage (calculated from video progress)
- Visual progress bar (same color coding as Story 1.4: red/yellow/blue/green)
- Status indicator: "Not Started", "In Progress (X%)", or "Completed ✓"
- Sequential numbering (e.g., "1.", "2.", "3.")
**And** Completed courses show green checkmark icon (✓) and 100% badge
**And** Current course (first incomplete) is highlighted with blue border + "Continue Learning" button
**And** Future courses (after current) show "Locked" state with lock icon if sequential mode enabled

**Given** Sequential mode is enabled for the path (default)
**When** I try to start a locked course (any course after the first incomplete course)
**Then** Dialog appears: "Complete [First Incomplete Course] to unlock this course. Sequential mode ensures you progress through the path in order."
**And** "Start Anyway" button allows override (unlocks only this specific course, others remain locked)
**And** Sequential mode can be toggled in path settings: "Enforce sequential order"
**And** Sequential lock logic: Only the first incomplete course is unlocked. All completed courses remain accessible. Future courses (after first incomplete) are locked.

**Given** I complete a course in a learning path
**When** Course completion reaches 100%
**Then** Path-level completion percentage is recalculated: `(completed courses / total courses) × 100`
**And** Path card in library updates to show new completion percentage
**And** Celebration toast appears: "🎉 Course complete! [X/Y] courses in path finished."
**And** If all courses complete, additional toast: "🏆 Learning Path Complete! [Path Name] finished."
**And** Next course in path is automatically highlighted with "Continue Learning" button

**Given** A course belongs to multiple learning paths
**When** I view the course detail page
**Then** "Part of Learning Paths" section displays all paths containing this course
**And** Each path shows: path name, current position (e.g., "Course 3 of 10"), path completion percentage
**And** Clicking a path badge navigates to that path's detail page

**Given** I am navigating within a learning path
**When** I finish watching a video or complete a course
**Then** Breadcrumb navigation displays current position: "Web Dev Path > JavaScript Intro > Module 2 > Lesson 5"
**And** Breadcrumb is clickable to navigate up hierarchy levels
**And** "Previous Course" and "Next Course" buttons appear in header (if applicable)
**And** Keyboard shortcuts work: "[" = previous course, "]" = next course (with confirmation if current course incomplete)
**And** Path navigation shortcuts are disabled when video player is focused or PiP is active (Story 1.4 video shortcuts take precedence)

**Given** A learning path contains 20 courses with various completion states
**When** I view the path progress overview
**Then** Visual progress timeline is displayed showing all courses in sequence:
- Completed courses: Green checkmark + filled circle
- Current course: Blue highlight + half-filled circle
- Future courses: Gray + empty circle
**And** Clicking any course in timeline navigates to that course
**And** Timeline is horizontally scrollable on mobile, grid layout on desktop

**Technical Requirements:**
- Calculate path completion: Query all `videoProgress` entries for courses in path, aggregate completion percentages
- Use Dexie.js `liveQuery()` for reactive path progress updates (updates in real-time as videos complete)
- Store path settings in `learningPaths` table: `{ enforceSequential: boolean }` (default: true)
- Create bidirectional index: `pathCourses` table indexed on both `pathId` and `courseId` for efficient lookups
- Breadcrumb state managed in Zustand store: `currentPath`, `currentCourse`, `currentModule`, `currentLesson`
- Sequential lock logic: Disable "Start" button if `enforceSequential === true` AND course order > (first incomplete course order)
- Timeline component uses CSS Grid for desktop (5 columns), Flexbox with horizontal scroll for mobile
- Keyboard navigation: Global event listener for "[" / "]" keys (only active when viewing path courses, disabled when video player focused or PiP active)

**FRs Fulfilled:** FR71, FR72

---

### Story 2.3: Course Tagging & Autocomplete

As a learner,
I want to add, remove, and manage tags on my courses with autocomplete suggestions,
So that I can organize my course library and prepare for filtering and search.

**Acceptance Criteria:**

**Given** I am viewing a course detail page or editing course metadata
**When** I click "Add Tag" in the course metadata section
**Then** A tag input field appears with autocomplete suggestions from existing tags
**And** I can type a new tag name (alphanumeric + hyphen, max 20 characters)
**And** Pressing Enter or clicking "+" button adds the tag to the course
**And** Tag appears as colored chip/badge with "×" remove button
**And** Tags are stored in `courses` table as `tags: string[]` array
**And** Tag list updates immediately without page reload (optimistic UI update)
**And** Maximum 10 tags per course. Attempting to add an 11th shows: "Tag limit reached (10). Remove a tag to add a new one."

**Given** I am adding tags to a course
**When** I start typing in the tag input
**Then** Autocomplete dropdown shows existing tags matching the input (case-insensitive search)
**And** Autocomplete shows tag usage frequency (e.g., "JavaScript (12 courses)")
**And** I can click an autocomplete suggestion to add it
**And** Autocomplete dropdown shows max 10 suggestions sorted by frequency (most used first)
**And** If the tag already exists on this course, it is not added again (deduplication)

**Given** I am managing tags across my library
**When** I navigate to Settings → Course Tags
**Then** Tag management page displays all tags with usage counts
**And** I can:
- Rename tags (updates all courses using that tag)
- Merge tags (e.g., "JS" → "JavaScript", updates all courses; deduplicates automatically if a course has both tags)
- Delete tags (removes from all courses, requires confirmation)
- Assign colors to tags (12 preset colors: blue, green, red, yellow, purple, pink, orange, teal, indigo, gray, brown, cyan)
**And** Tag color changes reflect immediately across all course cards

**Given** I am viewing my course library
**When** Course cards are displayed
**Then** Each course card shows its tags as colored chips below the course title
**And** Tag colors match the assigned color from Settings → Course Tags
**And** Courses with no tags show no chip area (no empty space)

**Technical Requirements:**
- Store tags in `courses.tags: string[]` array with Dexie.js MultiEntry index on `tags` field for fast lookups
- Implement autocomplete using Dexie.js query: `courses.where('tags').startsWithIgnoreCase(input).limit(10)`
- Generate tag frequency map using aggregation: `Map<string, number>` (tag → course count)
- Store tag colors in `tagColors` table: `{ tag: string, color: string }` (default: random from preset list)
- Tag chips use Tailwind color classes: `bg-blue-100 text-blue-800`, `bg-green-100 text-green-800`, etc.
- Tag management page uses batch updates via Dexie.js transactions (rename/merge/delete operations)
- Enforce max 10 tags per course at application level (validate before insert)
- Merge deduplication: When merging tag A into tag B, filter duplicates from `courses.tags` arrays using `[...new Set(tags)]`

**FRs Fulfilled:** FR6 (partial: tagging)

---

### Story 2.4: Course Filtering & Search

As a learner,
I want to filter my course library by tags, completion status, duration, and search by keyword,
So that I can quickly find courses in large libraries.

**Acceptance Criteria:**

**Given** I have tagged multiple courses (via Story 2.3)
**When** I view the course library page
**Then** A "Filter" button appears in the toolbar (next to search bar)
**And** Clicking "Filter" opens a filter panel (sidebar on desktop, bottom sheet on mobile)
**And** Filter panel displays:
- **Tags section**: List of all tags with course counts (e.g., "JavaScript (12)", "Python (8)")
- **Completion status**: Not Started, In Progress, Completed checkboxes
- **Duration**: Sliders for min/max hours (e.g., "5h - 50h")
- **Date added**: Date range picker (imported date)
**And** All filter controls support multi-select (tags are OR logic within tags, AND logic across filter types)

**Given** Filter panel is open
**When** I select multiple tags (e.g., "JavaScript" + "Advanced")
**Then** Course library updates in real-time to show only courses matching ANY selected tag (OR logic)
**And** Active filter count badge appears on Filter button (e.g., "Filter (3)")
**And** Filter chips display above course grid showing active filters (e.g., "JavaScript", "Advanced", "Completed")
**And** Each filter chip has "×" button to remove that filter
**And** "Clear All Filters" button appears when any filters are active

**Given** I have applied filters to the course library
**When** Filters are active
**Then** URL query parameters update to reflect filters (e.g., `?tags=javascript,python&status=completed`)
**And** Filters persist when navigating away and returning (stored in URL state via React Router)
**And** Course count updates: "Showing 8 of 45 courses"

**Given** I am viewing the course library with tags displayed
**When** I click a tag chip on a course card
**Then** Tag filter is automatically applied showing all courses with that tag
**And** Filter panel opens with the tag pre-selected
**And** I can add more tags to the filter or clear it

**Given** Multiple filters are active (e.g., tags + completion status + duration)
**When** Courses are filtered
**Then** Filtering logic is applied as:
- Tags: OR within tags (JavaScript OR Python)
- Status: OR within status (In Progress OR Completed)
- Duration: AND range (5h - 50h)
- Date: AND range (last 30 days)
- **Cross-filter**: AND across filter types (Tags AND Status AND Duration AND Date)
**And** No results message appears if no courses match: "No courses found. Try adjusting your filters."

**Given** I am searching courses using the search bar
**When** I type a search query
**Then** Search includes course name, description, module names, and tags
**And** Tag matches are highlighted in search results (e.g., "Matched tag: JavaScript")
**And** Search results can be further filtered using the filter panel
**And** Search query persists in URL: `?search=react&tags=frontend`

**Technical Requirements:**
- Filter logic: Use Dexie.js `where('tags').anyOf(selectedTags)` (MultiEntry index) for tag filtering, then chain `.and()` filter functions for status and duration (in-memory filtering, acceptable for <1000 courses)
- Use URL state management via React Router `useSearchParams()` for filter persistence
- Debounce search input (300ms) to prevent excessive queries
- Filter panel uses shadcn/ui Sheet component (sidebar on desktop, bottom sheet on mobile)
- Search implementation: Query `courses` table, filter in-memory on `name`, `description`, `modules[].name`, and `tags` fields
- Tag chip click handler: Update URL params and trigger filter re-evaluation

**FRs Fulfilled:** FR6 (partial: filtering & search)

---

### Story 2.5: Data Protection & Export

As a learner,
I want to safely delete courses with protection against breaking learning paths, and export my path data,
So that I can manage my library without losing progress or path relationships, and back up my learning journey.

**Acceptance Criteria:**

**Given** I want to delete a course from my library
**When** I click "Delete Course" button on a course card or detail page
**Then** System checks if course belongs to any learning paths
**And** If course is in one or more paths, deletion is blocked with dialog:
- "Cannot Delete Course"
- "This course is part of [X] learning path(s): [Path 1], [Path 2]"
- "Remove the course from these paths first, or delete the paths to proceed."
- "View Paths" button navigates to list of paths containing this course
**And** Delete button is disabled until course is removed from all paths

**Given** A course belongs to learning paths
**When** I view the course detail page
**Then** "Part of [X] Learning Paths" section is prominently displayed
**And** Each path is shown with:
- Path name
- "Remove from Path" button (confirmation required)
- Link to path detail page
**And** Clicking "Remove from Path" opens confirmation dialog:
- "Remove from [Path Name]?"
- "This course will be removed from the path but not deleted from your library."
- "Cancel" and "Remove" buttons
**And** After removal, remaining courses in the path are re-sequenced automatically (e.g., Course 1, 2, 4 becomes Course 1, 2, 3)
**And** Path completion percentage recalculates based on new total course count

**Given** I remove a course from all paths
**When** Course is no longer in any learning path
**Then** "Delete Course" button becomes enabled
**And** Clicking "Delete Course" shows confirmation dialog:
- "Delete [Course Name]?"
- "This will permanently delete the course and all its progress data."
- "Completed videos: [X], Total watch time: [Y] hours"
- Checkbox: "I understand this action cannot be undone"
- "Cancel" and "Delete Permanently" buttons (red, destructive)

**Given** I confirm course deletion
**When** "Delete Permanently" is clicked with checkbox checked
**Then** System deletes in this order (transaction-safe):
1. All video progress records (`videoProgress` table where `courseId = X`)
2. All course files references (`courseFiles` table where `courseId = X`)
3. Course metadata (`courses` table where `id = X`)
**And** File handles are revoked (no file system cleanup - files stay on user's disk)
**And** IndexedDB space is reclaimed immediately
**And** Toast notification appears: "Course deleted successfully. [X] MB storage freed."
**And** User is redirected to course library page
**And** Note: When notes and bookmarks features are added (Epic 3), deletion cascade will be extended to include those tables

**Given** I have multiple learning paths with progress data
**When** I navigate to Settings → Data Export and click "Export Learning Paths"
**Then** A JSON file is generated and downloaded: `levelup-paths-{YYYY-MM-DD}.json`
**And** JSON includes all learning paths, course relationships, and path-level progress:

```json
{
  "exportedAt": "2026-02-14T10:30:00Z",
  "version": "1.0",
  "learningPaths": [
    {
      "pathId": "uuid",
      "pathName": "Web Development Master Path",
      "description": "Complete web development journey",
      "createdAt": "2026-01-15T08:00:00Z",
      "enforceSequential": true,
      "courses": [
        {
          "courseId": "uuid",
          "courseName": "HTML Basics",
          "order": 1,
          "completionPercentage": 100,
          "addedToPathAt": "2026-01-15T08:00:00Z"
        },
        {
          "courseId": "uuid",
          "courseName": "CSS Fundamentals",
          "order": 2,
          "completionPercentage": 65,
          "addedToPathAt": "2026-01-15T08:00:00Z"
        }
      ],
      "pathProgress": {
        "completedCourses": 1,
        "totalCourses": 10,
        "overallCompletion": 10,
        "totalWatchTime": 18000,
        "lastAccessedAt": "2026-02-14T09:00:00Z"
      }
    }
  ]
}
```

**And** Export completes in <2 seconds for up to 50 paths
**And** Success toast appears: "Learning paths exported successfully"

**Given** A course deletion fails due to IndexedDB error
**When** Deletion transaction fails mid-process
**Then** All changes are rolled back (Dexie.js transaction rollback)
**And** Error message displays: "Deletion failed. Please try again. If the issue persists, export your data and contact support."
**And** No partial deletion occurs (course remains fully intact)

**Given** I am viewing the library with many courses
**When** I want to bulk delete courses
**Then** "Select Multiple" mode can be enabled via checkbox in toolbar
**And** Checkboxes appear on all course cards
**And** I can select multiple courses and click "Delete Selected (X courses)"
**And** Same path membership protection applies: Dialog shows which courses cannot be deleted and why
**And** Only courses not in paths are deleted; others remain selected for user review

**Technical Requirements:**

**Path Membership Check:**
- Query `pathCourses` table: `pathCourses.where('courseId').equals(courseId).toArray()`
- If result length > 0, course is in paths → block deletion
- Show path names via join query: `pathCourses → learningPaths` (indexed lookup)

**Course Removal from Path:**
- Delete `pathCourses` record for the course being removed
- Re-sequence remaining courses: Update `order` field for all courses with `order > removedCourseOrder` (decrement by 1)
- Recalculate path completion: `(completed courses / new total courses) × 100`
- Use Dexie.js transaction to ensure atomic reorder + recalculate

**Cascading Deletion:**
- Use Dexie.js transaction: `db.transaction('rw', [courses, videoProgress, courseFiles], async () => { ... })`
- Delete in order: child records first (videoProgress, courseFiles), then parent (course)
- Calculate storage freed: Sum of `courseFiles` sizes before deletion
- Handle transaction errors with rollback (automatic in Dexie.js)
- Note: Epic 3 will extend this transaction to include `notes` and `bookmarks` tables when those features are implemented

**Data Export:**
- Query all paths: `db.learningPaths.toArray()`
- For each path, query courses: `db.pathCourses.where('pathId').equals(pathId).toArray()`
- Aggregate progress: Sum completion percentages, calculate overall path completion
- Generate JSON using `JSON.stringify(data, null, 2)`
- Trigger download: `new Blob([json], { type: 'application/json' })` + `URL.createObjectURL()`

**Bulk Operations:**
- Use `Promise.all()` for parallel path membership checks
- Filter deletable courses: `courses.filter(c => !pathMemberships.has(c.id))`
- Show summary dialog: "X of Y courses can be deleted. Z courses are in learning paths."
- Execute deletions sequentially (not parallel) to avoid quota race conditions

**FRs Fulfilled:** FR5, FR74, FR75

---

## Epic 3: Active Learning Tools

Transform passive video watching into active learning through timestamped notes, markdown support, tagging, search, and bookmarks.

**Stories:** 3.1 Note Editor, 3.2 Timestamps, 3.3 Autosave, 3.4a Delete, 3.4b Course Notes List, 3.5 Tagging & Search, 3.6 Export, 3.7a Bookmark Toggle, 3.7b Bookmarks Page

### Story 3.1: Note Editor with Side-by-Side Layout

As a learner,
I want to take markdown-formatted notes alongside my video in a responsive side-by-side layout,
So that I can capture insights while watching without leaving the video context.

**Acceptance Criteria:**

**Side-by-Side Layout:**

**Given** I am watching a video in the lesson player (Story 1.2)
**When** the lesson player page loads
**Then** the layout displays:

- Desktop (1440px+): Side-by-side split — video player 60% left, note editor 40% right
- Tablet (768px-1439px): Side-by-side split — video player 55% left, note editor 45% right, with collapsible note panel via toggle button
- Mobile (<768px): Stacked layout — video player full width on top, note editor below with tab toggle ("Video" / "Notes")

**And** the split is implemented using CSS Grid (`grid-template-columns: 3fr 2fr` on desktop)
**And** the note editor panel has a minimum width of 320px on desktop (panel collapses to icon button below this)

**Markdown Editor:**

**Given** the note editor panel is visible
**When** I view the editor area
**Then** @uiw/react-md-editor renders with:

- Toolbar: Bold, Italic, Heading, List, Code, Link, Preview toggle
- Editor area: Monospace font, line numbers disabled, minimum height 200px
- Preview pane: Rendered markdown using react-markdown with rehype-sanitize (XSS prevention)
- Placeholder text: "Start taking notes..."

**And** the editor supports standard markdown: headings, bold, italic, lists, code blocks, links, blockquotes
**And** all user-generated markdown is sanitized through rehype-sanitize before rendering (NFR51)

**One Note Per Video Model:**

**Given** I open a lesson that has no existing note
**When** the note editor loads
**Then** the `notes` table is created in IndexedDB (Dexie.js) if it doesn't exist:

```javascript
notes: 'id, courseId, &videoId, *tags, createdAt, updatedAt'
```

**And** the editor displays empty state with placeholder text
**And** no note record is created until content is persisted (deferred to Story 3.3 autosave)
**And** each video has exactly one note — the data model enforces a 1:1 relationship between `videoId` and note
**And** the `&videoId` unique index in Dexie.js enforces this constraint at the database level (insert of duplicate videoId will throw `ConstraintError`)

**Given** I open a lesson that has an existing note
**When** the note editor loads
**Then** the note for this video is loaded into the editor (query: `notes.where({videoId}).first()`)
**And** the editor displays the existing markdown content with cursor at the end

**Given** I return to a video after weeks and want to add new observations
**When** I open the existing note
**Then** I can append to the existing note content (e.g., add a markdown separator `---` and new heading `## Revisited 2026-02-14`)
**And** original timestamps and content are preserved above

**Mobile Behavior:**

**Given** I am on a mobile device in stacked layout
**When** I tap the "Notes" tab
**Then** the note editor slides into view (300ms transition, ease-out)
**And** the video continues playing in the background (audio remains audible)
**And** tapping "Video" tab returns to video view
**And** both tabs show indicator badges: video tab shows play/pause icon, notes tab shows note count (0 or 1)

**Technical Requirements:**

- Install and configure @uiw/react-md-editor, react-markdown, and rehype-sanitize
- Create `notes` table in Dexie.js schema: `'id, courseId, &videoId, *tags, createdAt, updatedAt'` (no auto-increment — use `crypto.randomUUID()` for ID generation per Architecture conventions)
- Create `useNoteStore` Zustand store with: `currentNote`, `isEditing`, `isDirty` state
- Side-by-side layout: CSS Grid on desktop (`grid-template-columns: 3fr 2fr`), Flexbox column on mobile
- Mobile tab component: Use shadcn/ui Tabs with animated indicator
- Touch targets: All interactive elements ≥44x44px (NFR47)
- ARIA labels: Editor labeled "Note editor for [lesson title]"
- **Deletion cascade cross-reference:** Update course deletion transaction (Story 2.5) to include `notes` table in cascading delete: `db.notes.where({courseId}).delete()` — add `notes` to the Dexie.js transaction table list
- **rehype-sanitize protocol whitelist:** Configure custom sanitize schema to allow `video` protocol in `href` attributes: `{ ...defaultSchema, protocols: { ...defaultSchema.protocols, href: [...defaultSchema.protocols.href, 'video'] } }`. Required for timestamp links (Story 3.2) to render as clickable in preview.
- **Error states:** If @uiw/react-md-editor fails to load, fall back to `<textarea>` with raw markdown editing. If IndexedDB is unavailable (NFR15), display warning: "Notes cannot be saved in this browser mode." If quota exceeded, display: "Storage full — delete unused courses to free space."
- **DOM persistence on mobile:** Video player component MUST remain mounted in DOM when Notes tab is active. Use CSS-based visibility toggling, not conditional rendering, to preserve playback.

**FRs Fulfilled:** FR21, FR77 _(FR77 is new — not in original PRD. Derived from UX Design Specification side-by-side layout requirements. See FR Numbering Governance.)_

---

### Story 3.2: Timestamp Insertion & Navigation

As a learner,
I want to insert clickable timestamp links into my notes that jump to the exact video moment,
So that I can reference specific points in a lecture and quickly navigate back to them during review.

**Acceptance Criteria:**

**Timestamp Toolbar Button:**

**Given** the note editor (Story 3.1) is visible and a video is playing
**When** I view the editor toolbar
**Then** a **Timestamp button** (clock icon from Lucide React) is present in the toolbar
**And** the editor placeholder text reads: "Start taking notes... Press Alt+T to insert timestamp"

**Timestamp Insertion:**

**Given** I am watching a video and the note editor is focused
**When** I press `Alt+T` (Mac: `Option+T`) OR click the timestamp toolbar button (clock icon)
**Then** a timestamp link is inserted at the cursor position in the format: `[12:34](video://{currentVideoId}#t=754)`

- `12:34` = human-readable MM:SS (or HH:MM:SS if video ≥1 hour)
- `754` = current video position in seconds (integer, rounded down)

**And** the timestamp is inserted inline (does not replace selected text, inserts at cursor)
**And** a subtle toast appears: "Timestamp inserted" (auto-dismiss 5 seconds)
**And** the bare "T" key types the letter "T" normally inside the editor — no special behavior

**Given** the video player has focus (not the note editor)
**When** I press the bare "T" key
**Then** the timestamp is copied to clipboard per Story 1.3 behavior (no change to existing functionality)
**And** user can paste the timestamp into the note editor manually if desired

**Given** the video is not loaded, buffering, or in an error state
**When** I press `Alt+T` or click the timestamp toolbar button
**Then** the button/shortcut is disabled
**And** tooltip on the toolbar button shows: "Play a video to insert timestamps"

**Timestamp Link Navigation:**

**Given** a note contains a timestamp link like `[12:34](video://abc123#t=754)`
**When** I click the timestamp in the preview pane
**Then** the video player seeks to 754 seconds (12:34)
**And** video playback resumes from that position
**And** the clicked timestamp is briefly highlighted (blue flash, 300ms)

**Given** a note contains a timestamp link with a videoId that no longer exists (course re-imported or deleted)
**When** the link is rendered in preview
**Then** the timestamp text (`12:34`) remains visible but styled as disabled (gray, no underline)
**And** clicking it shows a tooltip: "Video no longer available"
**And** the link is not clickable (no seek action)

**Given** the video is loaded and paused at position 0:00
**When** I press Alt+T
**Then** a timestamp `[0:00](video://{videoId}#t=0)` is inserted (position 0:00 is valid)

**Technical Requirements:**

- Timestamp insertion: Read current video position from `useVideoPlayerStore` (shared Zustand state from Epic 1)
- Timestamp link format: `[MM:SS](video://{videoId}#t={seconds})` — custom link handler in react-markdown to intercept `video://` protocol
- Implement custom `components.a` override in react-markdown to handle `video://` links (seek video on click, show disabled state for stale links via videoId lookup)
- **Stale link resolution:** Pre-fetch a `Set<string>` of valid videoIds from `db.videos.toCollection().primaryKeys()` on note load. Pass to `components.a` override for synchronous `validVideoIds.has(videoId)` check during render. Refresh on course import/delete events.
- Custom toolbar command in @uiw/react-md-editor for timestamp button (clock icon from Lucide React)
- `Alt+T` keyboard shortcut: Register via `keydown` listener on editor container, check `event.altKey && event.key === 't'`
- ARIA label on timestamp button: "Insert video timestamp at current position"

**FRs Fulfilled:** FR24, FR25 _(PRD FR24: "timestamp notes to exact video positions"; PRD FR25: "navigate to video position from timestamped note". FR76 is the epics-local reference for keyboard shortcut — see FR Numbering Governance.)_

---

### Story 3.3: Note Autosave with Crash Recovery

As a learner taking notes during a video lesson,
I want my notes to be automatically saved as I type with resilient error handling,
So that I never lose my work due to forgetting to save, a browser crash, or a storage failure.

**Acceptance Criteria:**

**Autosave — First Persistence (Note Creation):**

**Given** a learner is viewing a video with no existing note record in IndexedDB
**When** the learner types content into the note editor established by Story 3.1 and 3 seconds elapse since the last keystroke
**Then** a new note record is created in IndexedDB with a `crypto.randomUUID()` id, the associated `courseId`, `videoId`, current content, empty `tags` array, and `createdAt`/`updatedAt` set to `new Date().toISOString()`
**And** the Zustand `useNoteStore` is updated optimistically before the IndexedDB write completes
**And** a subtle autosave indicator fades in near the editor toolbar displaying "Saving..." during the write and "Saved" upon confirmation, then fades out after 2 seconds

**Autosave — Debounce Behavior (3-Second Idle):**

**Given** a learner is actively typing in the note editor
**When** the learner pauses typing for 3 seconds (3,000 ms debounce)
**Then** the current note content is persisted to IndexedDB via a `db.notes.put()` call with `updatedAt` set to the current timestamp
**And** the Zustand store is updated optimistically before the async IndexedDB operation resolves
**And** the autosave indicator shows "Saving..." transitioning to "Saved" with a fade-in/fade-out animation (opacity 0 → 1 → 0, 300 ms ease-in-out)

**Autosave — Max Wait Forced Save (10-Second Cap):**

**Given** a learner is typing continuously without pausing for 3 seconds
**When** 10 seconds have elapsed since the last successful save (or since the editor was first modified if no save has occurred)
**Then** a forced save is triggered immediately regardless of ongoing typing
**And** the 3-second debounce timer is reset after the forced save completes
**And** the autosave indicator displays "Saving..." during the forced write

**Autosave — Optimistic UI Update Flow:**

**Given** an autosave (debounced or forced) is triggered
**When** the Zustand store is updated with the new content
**Then** the store update occurs synchronously before the IndexedDB `put()` call is initiated
**And** any component subscribed to the note via Zustand reflects the updated content immediately
**And** if the IndexedDB write succeeds, no further UI action is taken (store already current)
**And** if the IndexedDB write fails, if all retry attempts are exhausted, the Zustand store is reverted to the last successfully persisted content and the user is shown an error toast: "Unable to save note. Your last saved version has been restored."

**Autosave Indicator — Visual Behavior:**

**Given** the note editor is visible on screen
**When** an autosave operation begins
**Then** a small text indicator ("Saving...") appears in the editor toolbar area, fading in over 300 ms
**And** upon successful persistence the text changes to "Saved" with a checkmark icon
**And** the "Saved" indicator remains visible for 2 seconds, then fades out over 300 ms
**And** the indicator does not shift layout or cause content reflow (uses absolute positioning within the toolbar)
**And** the indicator has `aria-live="polite"` for screen reader announcements

**Given** two autosave operations overlap (e.g., forced save followed quickly by debounce save)
**When** the second save begins before the first indicator has faded out
**Then** the indicator resets to "Saving..." without a fade-out/fade-in flicker (immediate text swap)

**Edit Existing Note Content:**

**Given** a learner navigates to a video that already has a saved note record loaded by Story 3.1
**When** the learner modifies the note content in the editor
**Then** the same debounce (3-second) and max-wait (10-second) autosave logic applies to the edits
**And** the existing note record is updated in IndexedDB via `db.notes.put()` using the same `id` (no new record is created)
**And** `updatedAt` is set to the current timestamp while `createdAt` remains unchanged

**Given** a learner edits a note and navigates away from the video before the debounce timer fires
**When** the route change is detected
**Then** an immediate flush save is triggered for any unsaved content before the component unmounts
**And** the learner is not shown a blocking confirmation dialog for navigation (save is silent and automatic)

**IndexedDB Write Failure — Retry with Exponential Backoff:**

**Given** an autosave operation fails on the initial IndexedDB write attempt
**When** the failure is detected
**Then** the system retries up to 3 additional attempts with exponential backoff delays: 1 second, 2 seconds, 4 seconds
**And** the autosave indicator shows "Saving..." throughout the retry sequence (does not show "Saved" until a retry succeeds)

**Given** all 3 retry attempts have failed
**When** the final retry is exhausted
**Then** the autosave indicator changes to "Save failed" in a warning color (amber/yellow)
**And** a non-blocking toast notification (Sonner, warning variant) is displayed: "Unable to save your note. Your changes are preserved in memory and will be saved when storage becomes available."
**And** the Zustand store retains the latest content (no data loss in the UI layer)
**And** a background retry is scheduled every 30 seconds until the write succeeds or the component unmounts

**Browser Crash Recovery:**

**Given** the browser crashes or is force-closed while the learner has unsaved note content
**When** the learner reopens the application and navigates to the same video
**Then** the note editor loads the most recent version from IndexedDB (last successful autosave)
**And** maximum data loss is limited to 10 seconds of typing (the max-wait ceiling)

**Given** a `beforeunload` event is fired (browser tab close, refresh, or navigation away from the app)
**When** there is unsaved content in the Zustand store that differs from the last persisted version
**Then** an immediate best-effort save attempt is made
**And** the `beforeunload` event is not blocked with a user-facing prompt (save is silent)
**And** a synchronous `localStorage` snapshot is written as failsafe: key `note-recovery:{videoId}`, value is current editor content (NFR57: "Automatic backup of critical data to localStorage as failsafe")
**And** on next app load, `useNoteAutosave` checks `localStorage` for recovery snapshots. If found and newer than IndexedDB version, the recovered content is loaded with toast: "Note recovered from previous session."

**Save Serialization:**

**Given** a forced save (10-second max-wait) is triggered while a debounced save is in-flight
**When** both target the same note record
**Then** the forced save is queued until the in-flight write resolves (saves are serialized via promise chain, never concurrent for the same note ID)

**Technical Requirements:**

- Implement autosave as a custom React hook (`useNoteAutosave`) that accepts the current editor content, `courseId`, and `videoId`, and returns save status (`idle` | `saving` | `saved` | `error`)
- Use a debounce utility for the 3-second debounce; track elapsed time since last save with a `useRef` for the 10-second max-wait ceiling
- All IndexedDB operations use the existing Dexie.js `db.notes` table — no schema changes
- Zustand store updates must occur before `await db.notes.put()` calls (optimistic UI)
- Autosave indicator uses Tailwind CSS transitions (`transition-opacity duration-300`) and `aria-live="polite"` for accessibility
- `beforeunload` handler registered in `useEffect` cleanup-safe pattern, must not prevent browser from closing
- Retry logic implemented as reusable async utility `retryWithBackoff(fn, maxAttempts, baseDelay)`, unit-testable in isolation
- All note mutations (create, update) must be idempotent
- Builds on Story 3.1 editor UI — wires autosave hook into the existing toolbar
- **Multi-tab:** Out of scope. Last-write-wins is the implicit behavior. Future story may implement `BroadcastChannel`-based tab coordination.
- **Unsaved content detection:** Compare `currentEditorContent !== lastPersistedContent` using strict string equality. `lastPersistedContent` updates only after confirmed IndexedDB write (not optimistic Zustand update).
- **`retryWithBackoff` contract:** `retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts: number, baseDelay: number, signal?: AbortSignal): Promise<T>`. Rejects with last error after exhaustion. Cancellable via AbortSignal. Delay measured from attempt failure.

**FRs Fulfilled:** FR27

---

### Story 3.4a: Note Delete with Undo

As a learner,
I want to delete notes I no longer need with a safety net to undo accidental deletions,
So that I can confidently manage my notes without fear of losing important content.

**Acceptance Criteria:**

**Delete Note — Confirmation Dialog:**

**Given** a learner is viewing a video that has a saved note
**When** the learner clicks the "Delete Note" button (trash icon in the editor toolbar)
**Then** a confirmation dialog (shadcn/ui `AlertDialog`) is displayed with the title "Delete Note?" and the message "Are you sure you want to delete this note? You'll have 5 seconds to undo."
**And** the dialog presents two actions: "Cancel" (secondary/outline variant) and "Delete" (destructive variant, red)

**Given** the delete confirmation dialog is displayed
**When** the learner clicks "Delete"
**Then** the note is removed from the Zustand store optimistically
**And** the note record is deleted from IndexedDB via `db.notes.delete(noteId)`
**And** the editor is reset to an empty state with placeholder text (returning to the pre-persistence state)
**And** a toast notification (Sonner) is shown: "Note deleted" with an "Undo" action available for 5 seconds

**Given** the delete confirmation dialog is displayed
**When** the learner clicks "Cancel" or presses Escape
**Then** the dialog closes and the note remains unchanged

**Delete Note — Undo:**

**Given** a learner has just deleted a note and the "Undo" toast is visible
**When** the learner clicks "Undo" within the 5-second window
**Then** the note record is restored to IndexedDB with its original `id`, `createdAt`, and all prior content
**And** the Zustand store is updated to reflect the restored note
**And** the editor repopulates with the restored note content
**And** the toast is dismissed and replaced with "Note restored"

**Given** the "Undo" toast is visible
**When** 5 seconds elapse without the learner clicking "Undo"
**Then** the toast auto-dismisses and the deletion is considered final

**Given** I delete a note and navigate to a different route within the 5-second undo window
**When** the component unmounts
**Then** the undo toast is dismissed via Sonner's `toast.dismiss()` in a `useEffect` cleanup
**And** the deletion is considered final (no undo after navigation)

**Delete Note — Empty Note Edge Case:**

**Given** the editor contains content but no note record has been persisted yet (autosave has not triggered)
**When** the learner clicks "Delete Note"
**Then** the editor content is cleared without showing the confirmation dialog (since no persisted data exists to delete)
**And** any pending debounce or max-wait timers are cancelled

**Delete Note — Retry on Failure:**

**Given** a delete operation fails on the initial IndexedDB write attempt
**When** the failure is detected
**Then** the system retries using the same `retryWithBackoff` utility from Story 3.3 (3 attempts, exponential backoff)
**And** if all retries fail, a toast displays: "Unable to delete note. Please try again."
**And** the note is restored in the Zustand store

**Technical Requirements:**

- Delete confirmation uses shadcn/ui `AlertDialog` component with Radix focus trap
- Undo-delete flow holds the deleted note in a `useRef` during the 5-second undo window
- Delete operations reuse the `retryWithBackoff` utility from Story 3.3
- Zustand store updates must occur before `await db.notes.delete()` calls (optimistic UI)
- All note mutations (delete) must be idempotent
- Builds on Story 3.1 editor UI — wires delete button into the existing toolbar

**FRs Fulfilled:** FR25-delete (epics) _(Note: FR25 "Edit and delete" is split — editing covered by Story 3.3. PRD FR24/FR25 have different definitions; see FR Numbering Governance.)_

---

### Story 3.4b: Course Notes List & Display Ordering

As a learner,
I want to view all notes for a course and sort them by date or video timestamp,
So that I can browse and find relevant notes quickly.

**Acceptance Criteria:**

**Course Notes List View:**

**Given** a learner navigates to a view listing notes for a course (e.g., course notes panel)
**When** the course notes list loads
**Then** all notes for that course are fetched via `db.notes.where({courseId}).toArray()`
**And** each note entry shows the video title, a content preview (first 120 characters, plain text stripped of markdown), and a human-readable relative timestamp (e.g., "2 hours ago", "Yesterday")

**Given** a course has no saved notes
**When** the course notes list loads
**Then** an empty state is displayed: "No notes yet for this course" with a suggestion: "Start taking notes while watching lessons"

**Display Ordering — Chronological (by createdAt):**

**Given** a learner views the course notes list
**When** "Chronological" ordering is selected (default)
**Then** notes are displayed sorted by `createdAt` in descending order (newest first)

**Display Ordering — By Timestamp (video timestamp links):**

**Given** a learner selects "By Timestamp" ordering on the course notes list
**When** the notes are rendered
**Then** "By Timestamp" sorts by the earliest video timestamp link found within the note content, parsed from markdown link syntax matching `[MM:SS](video://{videoId}#t={seconds})` or `[HH:MM:SS](video://{videoId}#t={seconds})`. The `#t={seconds}` numeric value is used for sorting (no time string parsing needed). Bare bracket patterns like `[10:30]` without `video://` protocol are NOT treated as timestamps.
**And** notes without any timestamp links are placed at the end of the list
**And** a secondary sort of `createdAt` descending is applied for notes sharing the same earliest timestamp or having no timestamps

**Display Ordering — Toggle Persistence:**

**Given** a learner selects a sort order on the course notes list
**When** the learner navigates away and returns to the same course notes list
**Then** the previously selected sort order is preserved in the Zustand store (session-only preference, not persisted to IndexedDB)

**Technical Requirements:**

- Sort order state stored in Zustand `useNoteStore` as `sortOrder: 'chronological' | 'timestamp'`, defaulting to `'chronological'`
- Timestamp parsing for "By Timestamp" sort handles both `[MM:SS]` and `[HH:MM:SS]` formats, converting to total seconds via the `#t={seconds}` numeric value
- **Accessibility:** Sort toggle controls must have `aria-label` describing current state (e.g., "Sort by chronological order, currently active"). Course notes list items keyboard-navigable.
- **Course Notes List entry point:** Accessible via course detail page tab ("Notes" tab alongside "Lessons" and "Overview"), route: `/courses/:courseId/notes`. Shows all notes for the course with sort controls.

**FRs Fulfilled:** FR24 (epics) _(PRD FR24/FR25 have different definitions; see FR Numbering Governance.)_

---

### Story 3.5: Note Tagging & Search

As a learner,
I want to tag my notes and search across all of them by content, tags, or course name,
So that I can quickly organize and retrieve relevant notes without manually browsing through each course and video.

**Acceptance Criteria:**

**Tag Management — Adding Tags:**

**Given** a note is open in the editor (Story 3.1) and has fewer than 10 tags
**When** I click the tag input field in the editor header area and type a tag name
**Then** an autocomplete dropdown appears showing existing tags (across all notes) that match the typed prefix, sorted alphabetically
**And** I can select a tag from the dropdown or press Enter/comma to create a new tag from the typed text

**Given** I confirm a new or existing tag
**When** the tag is added to the current note
**Then** a tag chip appears in the editor header area displaying the tag name with a remove (×) button
**And** the note's `tags` array in IndexedDB is updated via the Story 3.3 autosave mechanism
**And** the `updatedAt` timestamp is refreshed
**And** the MiniSearch index is updated to include the new tag

**Tag Management — Removing Tags:**

**Given** a note has one or more tag chips displayed in the editor header area
**When** I click the remove (×) button on a tag chip
**Then** the tag is removed from the note's `tags` array
**And** the tag chip is removed from the editor header area
**And** the note is persisted via Story 3.3 autosave
**And** the MiniSearch index is updated to reflect the tag removal

**Tag Management — Enforcing Maximum Tags:**

**Given** a note already has 10 tags
**When** I attempt to add an 11th tag
**Then** the tag input is disabled and displays a message: "Maximum of 10 tags reached"
**And** no additional tag is added to the note

**Tag Management — Duplicate Prevention:**

**Given** a note already contains a tag with a specific name (case-insensitive)
**When** I attempt to add a tag with the same name
**Then** the duplicate tag is not added
**And** a brief inline message indicates the tag already exists on this note

**Tag Autocomplete:**

**Given** I focus the tag input field on any note
**When** I type one or more characters
**Then** an autocomplete dropdown appears within 100ms showing up to 10 existing tags (sourced from all notes via the Dexie.js `*tags` MultiEntry index) that contain the typed substring, case-insensitive
**And** the matching substring is highlighted in each suggestion

**Given** no existing tags match the typed text
**When** the autocomplete dropdown would normally appear
**Then** the dropdown shows a single option: "Create tag: [typed text]" to allow creating a new tag

**MiniSearch Index — Initialization:**

**Given** the application loads and notes exist in IndexedDB
**When** the notes Zustand store initializes
**Then** a MiniSearch index is built from all existing notes, indexing the fields: `id` (document ID), `content` (note body as plain text, stripped of markdown), `tags` (joined as space-separated string), `courseName` (resolved from `courseId`), and `videoTitle` (resolved from `videoId`)
**And** the index is ready for queries before the search UI becomes interactive

**MiniSearch Index — Real-Time Updates:**

**Given** the MiniSearch index is initialized
**When** a note is created or updated via Story 3.3, or deleted via Story 3.4
**Then** the MiniSearch index is updated within the same autosave transaction callback (add, remove+re-add, or remove respectively)
**And** subsequent searches immediately reflect the change

**Search Bar — UI & Interaction:**

**Given** I am on any page that includes the notes panel or a dedicated notes search view
**When** I focus the search bar and type a query of at least 2 characters
**Then** a search is executed against the MiniSearch index using prefix matching and fuzzy matching (fuzziness: 0.2)
**And** results begin appearing with no perceptible delay (<100ms) per NFR21, debounced at 150ms

**Given** I clear the search bar or delete all text
**When** the query becomes empty
**Then** the search results are dismissed and the default notes view is restored

**Search Results — Display:**

**Given** a search returns one or more matching notes
**When** the results are rendered
**Then** each result displays:

- A snippet of the matching note content (up to 150 characters) with matching terms highlighted in bold
- The course name and video title
- Tag chips displayed on that note
- The note's `updatedAt` date as a relative timestamp (e.g., "2 hours ago")

**And** results are ordered by MiniSearch relevance score (descending)

**Given** a search result corresponds to a specific note
**When** I click on the search result
**Then** I am navigated to the video player page for that note's `videoId`, with the note editor open and the note loaded

**Search Results — Empty State:**

**Given** a search query returns zero results
**When** the results area is rendered
**Then** an empty state is displayed: "No notes found for '[query]'" with a suggestion: "Try different keywords or check your tag spelling"

**Search Results — Special Characters:**

**Given** a user types a search query containing special characters (e.g., `<script>`, `&`, regex metacharacters)
**When** the query is processed
**Then** all input is sanitized before being passed to MiniSearch (defense-in-depth against XSS in search queries; no specific NFR — inherited from OWASP best practices)
**And** special characters are escaped so they do not cause injection or errors

**Search — Tag Filtering:**

**Given** I want to filter notes by a specific tag
**When** I click on a tag chip displayed in search results or in the editor header
**Then** the search bar is populated with `tag:[tagname]` and a filtered search is executed using the Dexie.js MultiEntry index: `notes.where('tags').anyOf([tagname])`
**And** results show all notes containing that tag, ordered by `updatedAt` descending

**Search — Combined Query:**

**Given** I enter a query that includes both free text and a `tag:` prefix (e.g., "React tag:hooks")
**When** the search executes
**Then** results are filtered to notes matching the tag via Dexie.js AND ranked by MiniSearch relevance for the free-text portion
**And** results appear with no perceptible delay (<100ms) per NFR21: Search results appear with no perceptible delay

**Performance — Large Note Collections:**

**Given** the user has 500+ notes in IndexedDB
**When** a search query is executed
**Then** results are returned in under 300ms as measured from query submission to first result render
**And** the MiniSearch index rebuild on app initialization completes in under 2 seconds for 500 notes

**Technical Requirements:**

- Use MiniSearch with configuration: `fields: ['content', 'tags', 'courseName', 'videoTitle']`, `storeFields: ['id', 'courseId', 'videoId', 'courseName', 'videoTitle', 'tags', 'updatedAt']`, `searchOptions: { prefix: true, fuzzy: 0.2, combineWith: 'AND', boost: { tags: 2, courseName: 1.5 } }`
- Strip markdown formatting from note `content` before indexing (convert to plain text)
- Tag autocomplete uses Dexie.js `*tags` MultiEntry index (`db.notes.orderBy('tags').uniqueKeys()`) — no schema changes
- Tag-filtered search uses `db.notes.where('tags').anyOf(selectedTags)` leveraging the MultiEntry index
- Debounce search input at 150ms before executing MiniSearch queries
- Sanitize all search input by escaping HTML entities and stripping characters that could cause query parsing errors (input sanitization defense-in-depth against XSS in search queries; no specific NFR — inherited from OWASP best practices)
- MiniSearch index lifecycle managed in the notes Zustand store: initialize on store hydration, update via wrappers around Story 3.3 create/update and Story 3.4 delete
- Tag chips use shadcn/ui `Badge` variant with `×` remove button (consistent with Story 2.3 course tags)
- Tag input uses shadcn/ui `Command` (combobox) pattern for autocomplete
- All tag comparisons are case-insensitive; tags stored in lowercase
- Search result snippets: 150-character window around first match, matched terms wrapped in `<mark>` tags (rendered safely via React)
- **MiniSearch index persistence:** The MiniSearch index is rebuilt from IndexedDB on each app load (not persisted to IndexedDB). For up to 500 notes the rebuild budget is <2 seconds. Persistence can be added as a future optimization if rebuild time becomes a bottleneck beyond 500 notes.
- **Tag model:** Tags are managed exclusively via explicit tag input UI (combobox with autocomplete) — NOT auto-extracted from `#hashtag` patterns in note content. The architecture's "hashtag extraction via regex" reference is superseded by this explicit model. Users add and remove tags through the dedicated tag input field, ensuring predictable behavior and clean tag data.
- **Global search scope:** Global `Cmd+K` Command Palette search is deferred to a future story (not currently assigned to any epic — see FR Numbering Governance). Story 3.5 provides the MiniSearch indexing foundation that the global search will consume. Interface contract: the MiniSearch instance is accessible via `useNoteSearchStore.getState().searchIndex`.

**FRs Fulfilled:** FR22, FR23 (note-scoped search only; global Cmd+K search deferred to future story)

---

### Story 3.6: Note Export as Markdown

As a learner,
I want to export my notes as markdown files,
So that I can review, share, and archive my study notes outside the LevelUp app.

**Acceptance Criteria:**

**Single Video Note Export:**

**Given** I am viewing a video that has an associated note
**When** I click the "Export Note" action on that video's note
**Then** a markdown file is downloaded with the filename `levelup-notes-{video-title-slug}-{YYYY-MM-DD}.md`
**And** the file contains metadata followed by the note content
**And** all `[MM:SS](video://{videoId}#t={seconds})` timestamp links are converted to bold plain text `**[MM:SS]**` since the `video://` protocol is not resolvable outside the app

**Course Notes Export:**

**Given** I am viewing a course that contains one or more videos with notes
**When** I click the "Export All Notes" action at the course level
**Then** a single markdown file is downloaded with the filename `levelup-notes-{course-name-slug}-{YYYY-MM-DD}.md`
**And** notes are organized under H2 headings for each module and H3 headings for each video/lesson
**And** videos without notes are omitted from the export
**And** each note section includes its metadata (tags, creation date) and converted content

**All Notes Export:**

**Given** I have notes saved across one or more courses
**When** I trigger the "Export All Notes" action from Settings → Data Export
**Then** a single markdown file is downloaded with the filename `levelup-notes-all-{YYYY-MM-DD}.md`
**And** notes are organized under H1 headings for each course, H2 headings for each module, and H3 headings for each video
**And** a table of contents is generated at the top listing all courses and their note counts

**Exported File Structure:**

**Given** a course-level or all-notes export is generated
**When** the markdown file is assembled
**Then** the output follows this structure:

```markdown
# LevelUp Notes Export — Introduction to Machine Learning

> Exported on February 14, 2026 | 12 notes

## Table of Contents

- Module 1: Foundations (3 notes)
  - Linear Algebra Refresher
  - Probability Basics
  - Data Preprocessing
- Module 2: Core Algorithms (2 notes)
  - Gradient Descent Explained
  - Backpropagation Deep Dive

---

## Module 1: Foundations

### Linear Algebra Refresher

**Tags:** linear-algebra, math, week-1
**Created:** February 8, 2026

Matrix multiplication is essential for understanding...

At **[03:22]** the instructor explains eigenvalues...

---

### Probability Basics

**Tags:** probability, statistics, week-1
**Created:** February 9, 2026

Bayes' theorem note content here...
```

**Timestamp Link Conversion:**

**Given** a note contains one or more timestamp links in the format `[MM:SS](video://{videoId}#t={seconds})`
**When** the note is exported
**Then** each timestamp link is converted to bold plain text `**[MM:SS]**`
**And** the original markdown content is otherwise preserved exactly as authored

**Filename Sanitization:**

**Given** a course name or video title contains characters invalid for filenames (e.g., `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`)
**When** the filename is generated
**Then** invalid characters are replaced with hyphens
**And** consecutive hyphens are collapsed to a single hyphen
**And** the slug is lowercased and trimmed

**Empty State — No Notes to Export:**

**Given** I attempt to export notes for a course that has no saved notes
**When** the export action is triggered
**Then** a toast notification displays: "No notes to export for this course"
**And** no file download is initiated

**Given** I attempt the "Export All Notes" action and there are zero notes in IndexedDB
**When** the export action is triggered
**Then** a toast notification displays: "You haven't created any notes yet"
**And** no file download is initiated

**Performance — Large Export:**

**Given** I have up to 500 notes across all courses
**When** I trigger the "Export All Notes" action
**Then** the markdown file is assembled and the download begins within 2 seconds
**And** a brief loading indicator is shown if assembly exceeds 500ms

**Technical Requirements:**

- Read note data from the Dexie.js `notes` table as established in Stories 3.1–3.5
- Use Blob + URL.createObjectURL download pattern (consistent with Story 1.4 progress export and Story 2.5 path export); extract to shared `src/lib/export.ts` helper if not already shared
- Timestamp link conversion via regex: replace `/\[(\d{1,2}:\d{2}(?::\d{2})?)\]\(video:\/\/[^)]+\)/g` with `**[$1]**`
- Filename slug generation: lowercase, replace non-alphanumeric characters with hyphens, collapse consecutive hyphens, trim
- Date formatting uses `date-fns` (existing project dependency)
- Export functions should be pure and testable: `buildSingleNoteMarkdown(note, video, course)`, `buildCourseNotesMarkdown(notes, course)`, `buildAllNotesMarkdown(notes: Note[], courses: CourseWithModules[])` where `CourseWithModules` includes nested `modules[].lessons[]` arrays for TOC hierarchy resolution. Query: `db.courses.toArray()` joined with module/lesson metadata from course import data.
- Toast notifications via Sonner
- Revoke object URL via `setTimeout(() => URL.revokeObjectURL(url), 60000)` — 60-second delay ensures browser completes reading the Blob before revocation
- **File encoding:** Blob created with `{ type: 'text/markdown;charset=utf-8' }` for correct non-ASCII character handling.
- **Empty content notes:** Notes with only metadata/tags and no body content are included in export with metadata headers but empty body.
- **Export button placement:** Single-video export via Lucide `Download` icon in note editor toolbar. Course-level export via "Export Notes" button in course detail page header. All-notes export via Settings → Data Export (alongside existing progress export).
- **Download failure:** Wrap `a.click()` in try/catch. On failure, show toast: "Download failed. Please check your browser settings and try again."

**FRs Fulfilled:** NFR34 (data export in standard formats), NFR35 (note storage allows external tool integration) _(Note: PRD FR26 is "view all notes for a course," not "export." Export is an NFR, not an FR.)_

---

### Story 3.7a: Bookmark Toggle & Video Player Integration

As a learner,
I want to bookmark lessons while watching videos for quick access later,
So that I can mark key content without interrupting my learning flow.

**Acceptance Criteria:**

**Bookmark Toggle on Video Player:**

**Given** I am watching a lesson in the video player
**When** I click the bookmark icon (Lucide `Bookmark`) in the video player controls
**Then** the lesson is saved to my bookmarks with a unique `crypto.randomUUID()` ID, the current `courseId`, `lessonId`, and `createdAt` timestamp
**And** the bookmark icon changes from outline (`Bookmark`) to filled (`BookmarkCheck`) to indicate the bookmarked state

**Given** I am watching a lesson that is already bookmarked
**When** I click the filled bookmark icon in the video player controls
**Then** the bookmark record is deleted from the `bookmarks` table in IndexedDB
**And** the icon reverts from filled (`BookmarkCheck`) to outline (`Bookmark`)

**Given** I click the bookmark toggle rapidly multiple times
**When** the operations are processed
**Then** only one bookmark record exists or zero exist (no duplicate records created for the same `lessonId`)
**And** the final icon state accurately reflects the persisted bookmark state

**Keyboard Shortcut:**

**Given** the video player component has focus
**When** I press the "B" key
**Then** the current lesson's bookmark state toggles (bookmarked becomes unbookmarked, unbookmarked becomes bookmarked)
**And** the bookmark icon updates to reflect the new state
**And** a brief toast notification confirms the action ("Lesson bookmarked" or "Bookmark removed")

**Given** the video player does not have focus (e.g., focus is on a text input or the note editor)
**When** I press the "B" key
**Then** no bookmark action occurs
**And** the keypress is handled normally by the focused element

**Bookmarked State on Lesson Cards:**

**Given** I am viewing a course's module/lesson list
**When** a lesson in the list has a corresponding record in the `bookmarks` table
**Then** a filled bookmark icon (`BookmarkCheck`, `text-blue-600`) is displayed on that lesson's card

**Given** a lesson in the list has no bookmark
**When** the lesson card is rendered
**Then** no bookmark icon is displayed (outline icon shown at reduced opacity on hover only)

**Deletion Cascade:**

**Given** a course is being deleted (per Story 2.5 deletion cascade)
**When** the course deletion transaction executes
**Then** all records in the `bookmarks` table with a matching `courseId` are deleted within the same Dexie transaction
**And** if bookmark UI components are mounted, they reactively update to reflect removed bookmarks

**Accessibility (Toggle):**

**Given** a screen reader is active
**When** the bookmark toggle button is focused in the video player
**Then** the button announces its current state ("Bookmark this lesson" or "Remove bookmark from this lesson")
**And** after toggling, the new state is announced via `aria-live="polite"`

**Technical Requirements:**

- Create `bookmarks` table in Dexie.js schema: `'id, courseId, lessonId, createdAt'` (no auto-increment — use `crypto.randomUUID()`)
- Create Zustand store slice (`useBookmarkStore`) with actions: `addBookmark`, `removeBookmark`, `toggleBookmark`, `isBookmarked`
- Create `src/lib/bookmarks.ts` module for Dexie CRUD operations on `bookmarks` table
- Implement `BookmarkButton.tsx` reusable component in `src/app/components/` accepting `courseId` and `lessonId` props
- Extend course deletion cascade (Story 2.5) to include `db.bookmarks.where('courseId').equals(courseId).delete()` in the Dexie transaction
- "B" keyboard shortcut registered via `useEffect` in video player component, gated by focus check
- All bookmark operations wrapped in try/catch with Sonner toast error messages
- **Zustand vs liveQuery:** Zustand provides a thin `isBookmarked(lessonId)` lookup cache for real-time toggle state in the video player. The cache is synced from Dexie `liveQuery` on mount.

**FRs Fulfilled:** FR45 (reassigned from "learning velocity metrics" to "bookmarks" — see FR Numbering Governance. Original requirement preserved as FR78, deferred.)

---

### Story 3.7b: Bookmarks Page & Management

As a learner,
I want a dedicated page to browse, sort, and manage all my bookmarked lessons,
So that I can easily revisit key content and keep my bookmarks organized.

**Prerequisite:** Story 3.7a (bookmark data model and toggle must exist). UX specification for Bookmarks page layout required before implementation.

**Acceptance Criteria:**

**Bookmarks Page — Navigation and Layout:**

**Given** I am on any page in the application
**When** I click the "Bookmarks" item in the sidebar navigation
**Then** I am navigated to the Bookmarks page at the `/bookmarks` route
**And** the sidebar highlights the Bookmarks nav item as active

**Given** I navigate to the Bookmarks page
**When** the page loads
**Then** I see a list of all bookmarked lessons displaying:

- Lesson title
- Course name
- Thumbnail image
- Video duration
- Completion status (progress percentage or "Completed" badge)
- Bookmark date (relative time, e.g., "2 days ago")

**And** each bookmark item is rendered as a card consistent with the LevelUp design system (`rounded-[24px]`, warm off-white background)

**Bookmarks Page — Navigation to Lesson:**

**Given** I am on the Bookmarks page
**When** I click on a bookmark item
**Then** I am navigated directly to that lesson's video player page with the correct `courseId` and `lessonId`

**Given** I click on a bookmark whose associated lesson or course has been deleted (orphaned bookmark)
**When** the navigation attempt occurs
**Then** the bookmark is automatically removed from the `bookmarks` table
**And** a toast displays: "This lesson is no longer available. Bookmark removed."
**And** the item is removed from the list with a fade-out animation

**Background Orphan Cleanup:**

**Given** the Bookmarks page mounts or the app starts
**When** bookmark data is loaded
**Then** all bookmarks are validated against existing course/lesson records in batch
**And** orphaned bookmarks (where courseId or lessonId no longer exists) are purged automatically
**And** if any orphans were cleaned, a toast displays: "Removed [N] bookmarks for deleted lessons"

**Bookmarks Page — Remove Bookmark (Desktop):**

**Given** I am on the Bookmarks page on a desktop viewport (≥1024px)
**When** I hover over a bookmark item
**Then** a delete button (Lucide `Trash2` icon) appears on the right side of the card with hover state `text-red-500` and `aria-label="Remove bookmark"`

**Given** the delete button is visible on hover
**When** I click the delete button
**Then** the bookmark is deleted from the `bookmarks` table
**And** the item is removed from the list with a smooth exit animation (150-300ms)

**Bookmarks Page — Remove Bookmark (Mobile):**

**Given** I am on the Bookmarks page on a mobile viewport (<1024px)
**When** I swipe left on a bookmark item
**Then** a red "Remove" action button is revealed behind the card

**Given** the "Remove" action button is revealed via swipe
**When** I tap the "Remove" button
**Then** the bookmark is deleted from the `bookmarks` table
**And** the item is removed from the list with a smooth collapse animation
**And** a visible three-dot menu icon appears on each bookmark card as an accessible alternative to swiping
**When** I tap the three-dot menu
**Then** a dropdown shows "Remove Bookmark" option (accessible via screen readers and keyboard)
**And** the swipe gesture is a convenience shortcut, not the only path to deletion (WCAG 2.5.1 compliance)

**Bookmarks Page — Sorting:**

**Given** I am on the Bookmarks page with multiple bookmarks
**When** I interact with the sort control (a `Select` dropdown above the bookmark list)
**Then** I see three sort options: "Most Recent" (default), "Course Name", and "Alphabetical (A-Z)"

**Given** I select "Most Recent"
**When** the list re-renders
**Then** bookmarks are ordered by `createdAt` descending (newest first)

**Given** I select "Course Name"
**When** the list re-renders
**Then** bookmarks are grouped and ordered alphabetically by course name, with bookmarks within the same course ordered by `createdAt` descending

**Given** I select "Alphabetical (A-Z)"
**When** the list re-renders
**Then** bookmarks are ordered alphabetically by lesson title

**Bookmarks Page — Empty State:**

**Given** I navigate to the Bookmarks page with zero bookmarks
**When** the page loads
**Then** I see an empty state with Lucide `BookmarkX` icon (64px, `text-muted-foreground`)
**And** heading: "No bookmarks yet"
**And** body: "Bookmark lessons while watching to find them quickly later."
**And** CTA button: "Browse Courses" navigating to the Courses page

**Accessibility (Page):**

**Given** I am navigating the Bookmarks page using a keyboard
**When** I tab through bookmark items
**Then** each item receives a visible focus ring (`ring-2 ring-blue-600 ring-offset-2`)
**And** I can press Enter to navigate to the lesson
**And** I can press Delete to trigger remove bookmark confirmation

**Technical Requirements:**

- Add `/bookmarks` route to `src/app/routes.tsx` with `Bookmarks.tsx` page in `src/app/pages/`
- Add "Bookmarks" navigation item to sidebar in `Layout.tsx` using Lucide `Bookmark` icon
- Add `fetchAllBookmarks` action to `useBookmarkStore` (extends store from Story 3.7a)
- Use Dexie's `liveQuery` as source of truth for bookmark lists on the page
- Implement swipe-to-delete on mobile using touch event handlers
- All bookmark operations wrapped in try/catch with Sonner toast error messages
- Follow LevelUp design system: `rounded-[24px]` cards, `blue-600` accent, 8px spacing grid, `#FAF5EE` background, Lucide icons
- **UX Design Note:** The Bookmarks page requires a UX specification (wireframe, sidebar placement, card layout) before implementation. This is a prerequisite task.
- **Pagination:** For lists exceeding 50 items, implement virtual scrolling using `@tanstack/react-virtual` or equivalent.

**FRs Fulfilled:** FR45 (reassigned — see FR Numbering Governance)

---

## Epic 4: Habit Formation & Streaks

Transform daily learning into a sustainable habit through automatic study time tracking, streak mechanics, visual calendars, weekly goals, and milestone celebrations.

**Stories:** 4.1 Session Tracking, 4.2 Streak Calculation & Display, 4.3 Streak Calendar & Heatmap, 4.4 Weekly Study Goals, 4.5 Streak Milestone Celebrations, 4.6 Streak Pause (Vacation Mode)

**FR Numbering Governance:**
Epic 4 remapped FR28-35 during epic decomposition (Step 2) to align with the streak-focused scope. The original PRD definitions for FR30 (configure reminders), FR32 (learning challenges), FR33 (challenge progress tracking), and FR34 (challenge types) describe features **deferred to a future epic** — they are not covered by Epic 4. The remapped definitions used throughout these stories are:
- FR28: Track daily study time (minutes per day) — _PRD original: "view daily study streak counter"_
- FR29: Calculate study streak (consecutive days ≥10 min) — _PRD original: "view visual calendar"_
- FR30: Display streak calendar with visual indicators — _PRD original: "configure reminders" → DEFERRED_
- FR31: Show streak count and longest streak — _PRD original: "pause streak" → covered by Story 4.6_
- FR32: Send celebration notifications for milestones — _PRD original: "learning challenges" → DEFERRED_
- FR33: Track weekly study goals and progress — _PRD original: "track challenge progress" → DEFERRED_
- FR34: Display "days since last study" when streak broken — _PRD original: "challenge types" → DEFERRED_
- FR35: Visualize study consistency over time (heatmap) — _PRD original: "milestone visual feedback"_

**Prerequisites (must be satisfied before Story 4.1 begins):**
1. **Install `dexie` v4.x** — `npm install dexie`. Required for all IndexedDB operations. Neither `dexie` nor `src/db/` directory exist in the current codebase.
2. **Install `zustand` v5.x** — `npm install zustand`. Required for all `use[Domain]Store` patterns. Neither `zustand` nor `src/stores/` directory exist.
3. **Create `src/db/schema.ts`** — Initialize Dexie database with version 1 containing Epic 1-3 tables (courses, videos, pdfs, notes, progress, bookmarks). Epic 4 tables are added via version 2 (see Story 4.1).
4. **Dexie Version Strategy:** All Epic 4 schema additions (`studySessions`, `streaks`, `settings` tables) MUST be combined into a single Dexie version increment (version 2). Stories 4.1 and 4.6 both contribute tables to this version. The implementer of Story 4.1 creates the version; Story 4.6 adds `settings` to the same version block.

**Architecture Deviations (documented):**
- `streaks` table uses `'&date, minutesStudied'` instead of Architecture's `'++id, date, minutesStudied'` — the calendar date is the natural primary key; auto-increment would allow duplicate date records across tabs. **Architecture document must be updated** when Story 4.1 ships.
- `settings: '&key'` table is added by Story 4.6 — not in Architecture's canonical schema. **Architecture document must be updated** when Story 4.6 ships.

### Story 4.1: Study Session Tracking & Daily Time Logging

As a learner,
I want my study time to be automatically tracked whenever I watch videos,
So that I have accurate daily study data without manual timers or effort.

**Acceptance Criteria:**

**Dexie.js Schema Extension:**

**Given** the Dexie.js database exists from Epic 1
**When** the app initializes
**Then** two new tables are added via a Dexie version increment:

```javascript
// Dexie version 2 (all Epic 4 tables in a single version increment)
studySessions: '++id, courseId, lessonId, startTime, endTime, duration'
streaks: '&date, minutesStudied'
settings: '&key'
```

**And** the `streaks` table uses `&date` as the unique primary key (NOT `++id` auto-increment — **architecture deviation**: the natural key is the calendar date; auto-increment would allow duplicate date records across tabs. See epic-level Architecture Deviations.)
**And** the `settings` table (`&key`) is a generic key-value store used by Story 4.6 for streak pause state — included in this version to avoid a future migration
**And** `lessonId` is indexed on `studySessions` to support per-lesson session queries in Epic 5
**And** existing tables and data are preserved through the version migration

**Session Start — Auto-Detection:**

**Given** I navigate to a lesson and the video player begins playback (Epic 1, Story 1.2)
**When** the video plays for at least 10 continuous seconds (measured by accumulating `timeupdate` event deltas — buffering/stalling does not count toward the 10-second threshold)
**Then** a study session record is created in the Zustand `useStudySessionStore` with `courseId`, `lessonId`, `startTime: new Date().toISOString()`, and `status: 'active'`
**And** no duplicate session is created if one is already active for the same `lessonId`

**Given** I am on the lesson player page and the video is paused
**When** I resume playback
**Then** if the pause was <2 minutes, the existing session continues (no new record)
**And** if the pause was ≥2 minutes, the previous session is ended and a new session begins

**Session End — Triggers:**

**Given** an active study session exists
**When** any of these events occur:

- Video is paused for ≥2 minutes (inactivity timeout)
- I navigate to a different route (detected via React Router navigation)
- The browser tab fires a `beforeunload` event (tab close/refresh)
- The `document.visibilityState` changes to `'hidden'` (mobile browser tab switch, app backgrounding — more reliable than `beforeunload` on iOS Safari and Chrome Android)
- The video completes playback (95%+ per Epic 1 completion rules)

**Then** the session is ended: `endTime` is set to the current timestamp, `duration` is calculated as `(endTime - startTime) - totalPausedMs` in milliseconds, converted to seconds
**And** the session is persisted to the `studySessions` table via `db.studySessions.add()`
**And** the daily aggregate in the `streaks` table is updated via a **read-modify-write within the transaction**: `const existing = await db.streaks.get(todayDateString); const updatedMinutes = (existing?.minutesStudied ?? 0) + Math.floor(durationSeconds / 60); await db.streaks.put({date: todayDateString, minutesStudied: updatedMinutes});` — the `get()` + `put()` within a single transaction prevents data loss from concurrent tab writes
**And** both writes occur in a single Dexie.js transaction for atomicity
**And** if the transaction fails, it is retried using a local `retryWithBackoff` utility (3 attempts, exponential backoff: 200ms, 400ms, 800ms). This utility is defined inline in `studyLog.ts` — when Story 3.3 ships its shared version, this can be replaced. If all retries fail, a warning toast is shown: "Study time could not be saved. It will be retried on your next session."

**Pause Time Exclusion:**

**Given** I am watching a video and pause playback
**When** the pause duration is tracked
**Then** paused time is excluded from the session's `duration` calculation
**And** the store tracks `totalPausedMs` via a running counter that starts on pause and stops on resume
**And** final `duration = (endTime - startTime) - totalPausedMs`

**Daily Aggregate — Streaks Table:**

**Given** multiple study sessions occur on the same calendar day
**When** each session ends
**Then** the `streaks` table record for today accumulates total minutes via `db.streaks.put()` using the date as the primary key
**And** the date string format is `YYYY-MM-DD` in the user's local timezone (using `date-fns/format`)

**Given** no study session has occurred today
**When** I check the `streaks` table for today
**Then** no record exists for today's date (records are created only when study actually occurs)

**IndexedDB Unavailable — Graceful Degradation (NFR15):**

**Given** IndexedDB is unavailable (private browsing restriction, storage quota exceeded, or database corruption)
**When** the app initializes and Dexie fails to open
**Then** study session tracking falls back to localStorage-only mode using the existing `logStudyAction()` function with `type: 'lesson_complete'`
**And** a warning toast is shown once per session: "Limited storage mode — study time tracking may not persist across browsers."
**And** the `useStudySessionStore` sets `fallbackMode: true` so downstream stories (4.2, 4.3) can detect and adapt
**And** when IndexedDB becomes available again (e.g., user exits private browsing), normal Dexie tracking resumes automatically on next app load

**Crash Recovery:**

**Given** the `beforeunload` or `visibilitychange` (hidden) event fires with an active session
**When** the session end is processed
**Then** a best-effort synchronous `localStorage` write is made as failsafe: key `session-recovery:{lessonId}`, value is `{startTime, totalPausedMs, elapsedSeconds}` (NFR57)
**And** on next app load, `useStudySessionTracker` checks for recovery snapshots
**And** recovered sessions use the `startTime`'s calendar date for `streaks` table attribution, not the recovery date (e.g., a session started at 10 PM yesterday that is recovered today credits yesterday's study minutes)
**And** after successful reconciliation, the `localStorage` recovery key is removed

**Session Timer Indicator:**

**Given** an active study session is in progress
**When** the lesson player page is visible
**Then** a small timer indicator is shown in the video player toolbar displaying elapsed study time in `MM:SS` format
**And** the timer updates every second via `setInterval(1000)`
**And** the indicator uses `text-xs text-muted-foreground` styling, positioned via absolute positioning to avoid layout shift
**And** the indicator has `aria-label="Current study session: X minutes Y seconds"` queryable via button, with `aria-live="off"` (not announced every second)

**Given** no study session is active
**When** I view the video player
**Then** the session timer indicator is not displayed

**Sub-60-Second Sessions:**

**Given** a session `duration` calculates to less than 60 seconds
**When** the session ends
**Then** the session is still written to `studySessions` (for analytics granularity in Epic 5)
**But** the `streaks` table is NOT updated (0 minutes rounded down — prevents noise in streak data)

**Technical Requirements:**

- **Module boundary:** `src/lib/studyLog.ts` owns all Dexie CRUD operations for `studySessions`, `streaks`, and `settings` tables. Add new functions: `startSession(courseId, lessonId)`, `endSession(sessionData)`, `getTodayMinutes()`, `getSessionsForDate(date)`. Also add `retryWithBackoff(fn, maxRetries=3)` as a local utility (replace with shared version from Story 3.3 when available). Existing localStorage-based functions (`logStudyAction`, `getStudyLog`, etc.) remain for backward compatibility until Story 4.2 migrates streak calculation to Dexie.
- **Zustand store:** `useStudySessionStore` holds UI-only state: `activeSession`, `todayMinutes`, `isTracking`, `fallbackMode`. It calls `studyLog.ts` functions for persistence — never accesses Dexie directly.
- **Integration hook:** `useStudySessionTracker` React hook receives video player callbacks as props from the LessonPlayer page component — specifically `onTimeUpdate(currentTime)`, `onPlay()`, `onPause()`, and `onEnded()`. The LessonPlayer page already has access to these via `VideoPlayer.tsx` component callbacks. This avoids depending on a `useVideoPlayerStore` Zustand store that does not yet exist. If a future story creates `useVideoPlayerStore`, the hook can be refactored to subscribe to it instead.
- **Inactivity timeout:** 2-minute `setTimeout` reset on each `onTimeUpdate` callback via the tracker hook
- **Route change detection:** `useEffect` cleanup in tracker hook + React Router `useBeforeUnload` for `beforeunload` + `document.addEventListener('visibilitychange')` for mobile browser reliability
- **Timer placement:** Add the session timer to the existing video player toolbar component (`VideoPlayer.tsx` or equivalent from Epic 1 Story 1.2). Insert adjacent to the existing playback controls.
- **Dexie schema:** Create `src/db/schema.ts` with version 2 adding `studySessions`, `streaks`, and `settings` tables (version 1 = Epic 1-3 tables). All Epic 4 tables are in a single version increment per the epic-level Dexie Version Strategy.
- **Date handling:** `date-fns/format(new Date(), 'yyyy-MM-dd')` for consistent date strings in the user's local timezone. Study time is wall-clock time (not content time — 2x playback speed = half the wall-clock minutes).
- **Architecture update:** When this story ships, update `architecture.md` to reflect the `&date` deviation for `streaks` and the addition of `settings: '&key'` table.

**FRs Fulfilled:** FR28

---

### Story 4.2: Streak Calculation, Display & Dashboard Widget

As a learner,
I want to see my current study streak, longest streak, and days since last study on my dashboard,
So that I feel motivated by my consistency and know immediately whether my habit is intact or needs attention.

**Acceptance Criteria:**

**Streak Calculation — Migration from localStorage to Dexie:**

**Given** the `streaks` table (Story 4.1) contains daily study records with `minutesStudied`
**When** the streak is calculated
**Then** a "study day" is defined as any date where `minutesStudied >= 10` (FR29: ≥10 minutes threshold)
**And** the current streak is the count of consecutive calendar days (ending today or yesterday) that meet the threshold
**And** if today has ≥10 minutes but yesterday does not, the streak is 1 (today only)
**And** if today has <10 minutes but yesterday has ≥10 minutes, the streak is calculated backwards from yesterday (the user can still extend it today)
**And** if neither today nor yesterday meets the threshold, the current streak is 0

**Given** the existing `studyLog.ts` uses localStorage with `lesson_complete` events for streak counting
**When** Story 4.2 is implemented
**Then** the streak calculation logic is migrated to use the Dexie `streaks` table as the source of truth
**And** the existing localStorage-based `getCurrentStreak()` and `getLongestStreak()` functions in `studyLog.ts` are replaced with Dexie-based implementations
**And** the old localStorage `study-log` data is preserved (not deleted) but no longer used for streak calculation

**Longest Streak Calculation:**

**Given** the `streaks` table has historical daily records
**When** the longest streak is calculated
**Then** all records with `minutesStudied >= 10` are queried, sorted by date ascending
**And** the longest run of consecutive dates is computed
**And** the result is compared against `localStorage` key `study-longest-streak` (existing fallback from pre-migration data) and the higher value is used
**And** the longest streak value is cached in the Zustand store and recalculated only when a new streak record is written

**Days Since Last Study (FR34):**

**Given** the current streak is 0 (broken)
**When** the streak display renders
**Then** instead of showing "0 days streak" with a dead flame, the display shows "X days since last study" with a muted message
**And** the day count is calculated from the most recent date in `streaks` where `minutesStudied >= 10`
**And** the tone is supportive, not guilt-inducing: "It's been 3 days — jump back in!" (per UX principle: "celebration over guilt")

**Given** no records exist in the `streaks` table at all
**When** the streak display renders
**Then** the display shows "Start your streak" with an encouraging message: "Watch 10 minutes today to begin"

**Dexie Error Handling — Degraded Mode:**

**Given** Dexie is unavailable or queries throw (IndexedDB blocked, storage quota, corruption)
**When** the widget renders
**Then** it falls back to localStorage-based `getCurrentStreak()` and `getLongestStreak()` for ALL values (not just longest streak)
**And** a subtle indicator (muted text below the widget) shows "Limited data mode" — no crash, no blank widget
**And** if `useStudySessionStore.fallbackMode` is `true` (set by Story 4.1), the widget uses localStorage by default without attempting Dexie

**Loading State:**

**Given** `useStreakStore` is hydrating (async Dexie query in progress)
**When** the widget first renders
**Then** a skeleton loader matching the widget dimensions is shown (pulse animation, `animate-pulse`, matching `rounded-[24px]` shape)
**And** the skeleton is displayed for a minimum of 0ms and maximum of 500ms (if query completes faster, show content immediately; if slower, skeleton persists until data arrives)

**Data Migration — localStorage to Dexie:**

**Given** the Dexie `streaks` table is empty but localStorage `study-log` contains historical `lesson_complete` actions
**When** `useStreakStore` hydrates for the first time
**Then** the current streak is calculated from BOTH sources: Dexie (for new minute-based data) and localStorage (for legacy boolean-per-day data)
**And** the current streak from localStorage is preserved as a floor: if Dexie-only streak is lower than localStorage streak, display the localStorage value until Dexie accumulates enough days to exceed it
**And** this migration fallback is automatic and requires no user action
**And** a migration note is logged to console: "Streak data: using legacy localStorage fallback for current streak (Dexie has N days, localStorage has M days)"

**StudyStreak Dashboard Widget:**

**Given** I am on the Overview (dashboard) page
**When** the page loads
**Then** a `StudyStreak` widget is displayed in the dashboard layout with:
- Flame icon (Lucide `Flame`) that scales dynamically:
  - 0 days: `w-6 h-6`, `text-muted-foreground` (gray, no animation)
  - 1-6 days: `w-8 h-8`, `text-orange-500` (small flame)
  - 7-29 days: `w-10 h-10`, `text-orange-600` (medium flame)
  - 30+ days: `w-12 h-12`, `text-orange-600` (large flame)
- Current streak count in `text-3xl font-bold text-orange-600`
- Dynamic motivational message based on streak tier:
  - 0 days: "Start your streak" or "X days since last study — jump back in!"
  - 1-6 days: "Keep it up!"
  - 7-29 days: "You're on fire!"
  - 30+ days: "Unstoppable!"
- Longest streak displayed below: "Personal best: X days" in `text-sm text-muted-foreground`

**And** the widget has a gradient background: `bg-gradient-to-br from-orange-50 via-red-50 to-pink-50` (3-stop gradient per UX spec) with `border border-orange-200` and `rounded-[24px]` per design system
**And** the widget is placed in the dashboard grid alongside other stats widgets (per UX spec: "Achievement + Streak side-by-side")

**StudyStreak Widget — Responsive Behavior:**

**Given** I am viewing the dashboard on different viewports
**When** the StudyStreak widget renders
**Then** on desktop (≥1440px): widget appears at full size in the stats row
**And** on tablet (768-1439px): widget appears at full size, may stack vertically with other widgets
**And** on mobile (<768px): widget appears at full width, flame icon and text scale down proportionally

**Zustand Store — useStreakStore:**

**Given** the app initializes
**When** `useStreakStore` hydrates
**Then** it queries the Dexie `streaks` table to compute: `currentStreak`, `longestStreak`, `daysSinceLastStudy`, `todayMinutes`, `streakTier` ('none' | 'building' | 'strong' | 'unstoppable')
**And** it subscribes to Dexie `liveQuery` on the `streaks` table so that when Story 4.1 writes a new session, the streak display updates reactively without page refresh
**And** `liveQuery` fires on any table mutation (insert, update, delete) — `recalculate()` is called on every change, not just inserts. The "cached and recalculated only on new records" optimization is NOT used; full recalculation on every change ensures correctness.

**Given** a study session ends (Story 4.1) and the `streaks` table is updated
**When** `liveQuery` detects the change
**Then** `useStreakStore` recalculates `currentStreak`, `longestStreak`, and `streakTier`
**And** the dashboard widget re-renders with updated values

**Accessibility — StudyStreak Widget:**

**Given** the StudyStreak widget is rendered
**When** a screen reader encounters it
**Then** the flame icon has `aria-hidden="true"` (decorative)
**And** the widget container has `role="status"` and `aria-label="Study streak: {currentStreak} days"` so screen readers announce the streak value
**And** the motivational message text is visible (not color-only) — streak tier is communicated via both text ("You're on fire!") and icon size, never color alone
**And** the widget is reachable via keyboard tab navigation
**And** streak changes are announced via `aria-live="polite"` region (non-interruptive)

**Timezone Handling:**

**Given** streak calculation uses calendar dates (YYYY-MM-DD strings)
**When** determining "today" and "yesterday" for streak continuity
**Then** dates are always in the user's **local timezone** via `date-fns/format(new Date(), 'yyyy-MM-dd')`
**And** if a user crosses timezones (e.g., travel), the date is determined by their current local time — a session started at 11:55 PM in one timezone that ends at 12:05 AM in a new timezone credits the **start time's** date

**Integration with Existing StudyStreakCalendar:**

**Given** `StudyStreakCalendar.tsx` currently calls `getCurrentStreak()` and `getLongestStreak()` from localStorage
**When** Story 4.2 is implemented
**Then** `StudyStreakCalendar.tsx` is updated to read streak values from `useStreakStore` instead of calling `studyLog.ts` functions directly
**And** the component's existing streak stats section (current streak card, longest streak card) is preserved visually but rewired to the Zustand store

**Technical Requirements:**

- Create `useStreakStore` Zustand store in `src/stores/useStreakStore.ts` with state: `currentStreak`, `longestStreak`, `daysSinceLastStudy`, `todayMinutes`, `streakTier`, and actions: `recalculate()`, `hydrate()`
- Migrate `getCurrentStreak()` and `getLongestStreak()` in `src/lib/studyLog.ts` from localStorage to Dexie queries on the `streaks` table. Query pattern: `db.streaks.where('minutesStudied').aboveOrEqual(10).sortBy('date')` then compute consecutive runs
- Create `StudyStreak.tsx` dashboard widget component in `src/app/components/` (separate from `StudyStreakCalendar.tsx` — the widget is a compact summary, the calendar is the detailed view)
- Update `StudyStreakCalendar.tsx` to consume `useStreakStore` instead of direct `studyLog.ts` calls
- Add `StudyStreak` widget to the Overview page layout
- Streak tier thresholds: 0 = 'none', 1-6 = 'building', 7-29 = 'strong', 30+ = 'unstoppable'
- `liveQuery` subscription pattern: `useLiveQuery(() => db.streaks.toArray())` in the store hydration, with `recalculate()` called on every mutation (insert, update, delete)
- **Backward compatibility and migration:** If Dexie `streaks` table is empty but localStorage `study-log` has historical data, fall back to localStorage for current streak AND longest streak display. The legacy current streak is a floor value; once Dexie accumulates enough days, it takes over. No batch migration of historical data (converting action counts to estimated minutes is unreliable).
- **Dexie error boundary:** Wrap all Dexie queries in try/catch. On failure, fall back to localStorage functions. Set `fallbackMode` flag to prevent repeated Dexie attempts in the same session.
- **Accessibility:** `role="status"`, `aria-label`, `aria-live="polite"` on widget container. Flame icon `aria-hidden="true"`.

**FRs Fulfilled:** FR29, FR31, FR34 _(per epics.md remapped definitions — see epic-level FR Numbering Governance)_

---

### Story 4.3: Streak Calendar with Heatmap View

As a learner,
I want to see a visual calendar showing my study consistency with intensity-based coloring,
So that I can spot patterns in my learning habits and stay motivated by seeing my history.

**Acceptance Criteria:**

**Calendar Data Source Migration:**

**Given** the existing `StudyStreakCalendar.tsx` uses `getStudyActivity()` from localStorage (counts `lesson_complete` events)
**When** Story 4.3 is implemented
**Then** the calendar reads from the Dexie `streaks` table via `useStreakStore` (Story 4.2) instead of localStorage
**And** intensity levels are based on `minutesStudied` per day, not lesson counts:

- No activity: `bg-muted` (gray)
- 1-9 minutes (below streak threshold): `bg-green-200` (light — studied but didn't qualify for streak)
- 10-29 minutes: `bg-green-400` (medium — met streak threshold)
- 30-59 minutes: `bg-green-500` (strong)
- 60+ minutes: `bg-green-600` (excellent)

**And** tooltip on hover shows: "{date}: {minutes} minutes studied" (e.g., "Feb 10: 42 minutes studied")
**And** days below the 10-minute streak threshold show a subtle dashed border to distinguish "studied but didn't count" from "met the goal"

**Monthly Calendar View (Default):**

**Given** I view the streak calendar
**When** the calendar loads in its default monthly view
**Then** a full calendar month grid is displayed (7 columns for days of the week, 4-6 rows for weeks)
**And** day-of-week headers are shown: Mon, Tue, Wed, Thu, Fri, Sat, Sun
**And** the current month is displayed by default with navigation arrows to go to previous/next months
**And** today's cell has a ring indicator (`ring-2 ring-blue-600`) to distinguish it from other days
**And** future dates are rendered as empty cells with no interaction

**Given** I navigate to a previous month
**When** the calendar re-renders
**Then** the data is queried from the Dexie `streaks` table for that month's date range: `db.streaks.where('date').between(monthStart, monthEnd)`
**And** the transition should feel instant with no visible loading spinner for typical data volumes (<1 year of history). Note: the Architecture doc states "Calendar heatmap reads last 30 days from studySessions" — this is superseded; the calendar reads from the `streaks` table (daily aggregates), not raw `studySessions` records. Architecture doc should be updated.

**Weekly Heatmap View:**

**Given** I toggle to the "Weekly" view using a segmented control above the calendar
**When** the weekly heatmap renders
**Then** the last 12 weeks are displayed in a compact grid (12 columns × 7 rows), similar to GitHub's contribution graph
**And** each cell represents one day, colored by the same intensity scale as the monthly view
**And** week labels are shown at the top (most recent week on the right)
**And** a month label appears at the top when a new month begins within the grid
**And** the current (rightmost) week may be partial — unfilled future days are rendered as empty cells with `bg-transparent` (no border, no interaction)
**And** the oldest (leftmost) week may also be partial — days before the 12-week window start are empty cells

**View Toggle:**

**Given** I am viewing the streak calendar
**When** I click the view toggle control
**Then** I can switch between "Month" and "Weeks" views
**And** the toggle uses shadcn/ui `Tabs` with two options, compact size
**And** the selected view is persisted in `useStreakStore` as `calendarView: 'month' | 'weeks'` (session-only, not persisted to IndexedDB)

**Legend:**

**Given** either calendar view is displayed
**When** I look below the calendar grid
**Then** a legend shows the intensity scale: "Less" → [gray, light green, medium green, strong green, dark green] → "More"
**And** a note below states: "10+ minutes = streak day" to clarify the threshold

**Accessibility:**

**Given** I am navigating the calendar with a keyboard
**When** I tab into the calendar grid
**Then** I can arrow-navigate between cells
**And** each cell announces via screen reader: "{date}: {minutes} minutes studied" or "{date}: No activity"
**And** the active cell has a visible focus ring (`ring-2 ring-blue-600 ring-offset-2`)

**Given** `prefers-reduced-motion` is enabled
**When** the calendar renders
**Then** hover scale animations on cells are disabled (NFR62)
**And** view toggle transitions are instant (no fade/slide)

**Responsive — Mobile Layout (375px):**

**Given** I am viewing the calendar on a mobile device (<640px)
**When** the calendar renders
**Then** the default view is the "Weeks" heatmap (more compact than monthly)
**And** monthly view cells are sized to minimum `40px × 40px` with `gap-1` — at 375px this fits within the viewport (7 × 40 + 6 × 4 = 304px + padding)
**And** if the monthly grid would exceed viewport width, it uses a horizontally scrollable container (`overflow-x-auto`)
**And** touch targets meet 44×44px minimum by adding transparent `padding` around smaller visual cells
**And** tooltips on mobile appear on tap (not hover) and dismiss on tap-elsewhere

**Empty State:**

**Given** I am a new user with no study data in the `streaks` table (and no localStorage fallback)
**When** the calendar renders
**Then** all cells are rendered in `bg-muted` (gray) with no tooltips
**And** a centered message is shown below the grid: "Start studying to see your activity here"

**Error State:**

**Given** the Dexie query for calendar data fails
**When** the calendar attempts to render
**Then** the calendar falls back to localStorage `getStudyActivity()` data if available
**And** if no fallback data exists, the empty state is shown
**And** no crash or unhandled promise rejection occurs

**Loading State:**

**Given** the Dexie query is in progress (async)
**When** the calendar first renders
**Then** a skeleton grid matching the calendar dimensions is shown with `animate-pulse`
**And** the skeleton is replaced by actual data when the query resolves

**Technical Requirements:**

- Refactor existing `StudyStreakCalendar.tsx` to accept data from `useStreakStore` instead of calling `getStudyActivity()` directly. Remove the streak stats section (moved to `StudyStreak.tsx` widget in Story 4.2) — the calendar component now focuses purely on the calendar/heatmap grid.
- Streak pause button remains in this component (will be wired to Dexie in Story 4.6)
- Monthly view: CSS Grid `grid-template-columns: repeat(7, 1fr)` with proper day-of-week offset for the first day of the month
- Weekly heatmap: CSS Grid `grid-template-columns: repeat(12, 1fr)` × 7 rows, data queried via `db.streaks.where('date').between(12WeeksAgo, today)`
- View toggle state in `useStreakStore`: `calendarView: 'month' | 'weeks'`
- Tooltip: reuse existing shadcn/ui `Tooltip` pattern already in the component
- Date arithmetic: `date-fns` functions (`startOfMonth`, `endOfMonth`, `subWeeks`, `eachDayOfInterval`)
- **Performance:** For the 12-week heatmap (84 days), a single Dexie range query is sufficient. No pagination needed.

**FRs Fulfilled:** FR30, FR35 _(per epics.md remapped definitions — see epic-level FR Numbering Governance. PRD FR30 "configure reminders" is DEFERRED; PRD FR35 "challenge milestone visual feedback" is remapped to "study consistency heatmap".)_

---

### Story 4.4: Weekly Study Goals & Progress

As a learner,
I want to set a weekly study time goal and track my progress toward it,
So that I can build consistent habits with a concrete target rather than vague intentions.

**Acceptance Criteria:**

**Goal Setting:**

**Given** I navigate to the streak/habits section (accessible via the StudyStreakCalendar or a Settings sub-section)
**When** I interact with the weekly goal setting control
**Then** I can select a weekly study goal from preset options: 30 min, 1 hour, 2 hours, 3 hours, 5 hours (displayed as friendly labels: "Casual: 30 min/week", "Regular: 1 hr/week", "Committed: 2 hrs/week", "Dedicated: 3 hrs/week", "Intensive: 5 hrs/week")
**And** the selected goal is persisted to `localStorage` key `study-weekly-goal` as minutes (e.g., `120` for 2 hours)
**And** the default goal for new users is 60 minutes (1 hour/week)

**Given** I want a custom goal not in the presets
**When** I select "Custom" from the options
**Then** a number input appears allowing me to enter a custom target in minutes (min: 10, max: 2520 = 6 hrs/day × 7)
**And** the input validates on blur and shows an inline error below the input if out of range: "Goal must be between 10 and 2,520 minutes" in `text-sm text-destructive`
**And** the error clears when the user enters a valid value and blurs the field

**Weekly Progress Display — Dashboard Widget:**

**Given** I have a weekly goal set and study sessions recorded (Story 4.1)
**When** I view the dashboard
**Then** a `WeeklyGoalProgress` widget displays:

- A circular progress ring (SVG) showing percentage complete, colored by progress tier:
  - 0-49%: `stroke-orange-400` (getting there)
  - 50-99%: `stroke-blue-500` (on track)
  - 100%+: `stroke-green-500` (goal met!)
- Current week total in the center: "2h 15m / 3h" in `text-lg font-semibold`
- A label below: "This Week" with the date range (e.g., "Feb 10 - Feb 16")
- Days remaining badge: "3 days left" in `text-xs text-muted-foreground`

**And** the SVG progress ring has `role="progressbar"`, `aria-valuenow={currentMinutes}`, `aria-valuemin={0}`, `aria-valuemax={goalMinutes}`, and `aria-label="Weekly study progress: {currentMinutes} of {goalMinutes} minutes"`
**And** the week boundary is Monday 00:00 to Sunday 23:59 in the user's local timezone
**And** the current week's minutes are calculated by summing `streaks` table records where `date` falls within the current week: `db.streaks.where('date').between(mondayStr, sundayStr)`

**Weekly Progress — Goal Met State:**

**Given** my weekly study minutes meet or exceed my goal
**When** the widget re-renders
**Then** the progress ring fills to 100% with `stroke-green-500`
**And** a checkmark icon appears in the center of the ring
**And** the text changes to "Goal reached!" with a subtle green glow animation (300ms, `prefers-reduced-motion` respected)
**And** if I exceed the goal, the actual total is shown: "3h 45m / 3h" (no cap at 100%)

**Weekly Progress — Contextual Pacing Message:**

**Given** the week is partially complete and I have not yet reached my goal
**When** the widget renders
**Then** a pacing message is displayed below the progress ring:

- On track (current pace would meet goal by Sunday): "You're on pace — keep it up!"
- Behind pace (need to increase daily average): "Study {X} more minutes today to stay on track"
- Significantly behind (less than 25% done with more than 50% of week elapsed): "You can still catch up — {X} minutes across {remaining days} days"

**And** pacing formula: `expectedByNow = (goalMinutes / 7) * daysElapsed` where `daysElapsed` = days from Monday 00:00 to now (fractional). "On track" = `weekMinutesSoFar >= expectedByNow * 0.9`. "Behind" = `weekMinutesSoFar < expectedByNow * 0.9`. "Significantly behind" = `weekMinutesSoFar < goalMinutes * 0.25 AND daysElapsed > 3.5`. The {X} in pacing messages = `Math.ceil((goalMinutes - weekMinutesSoFar) / daysRemainingInWeek)` minutes per remaining day.

**Weekly History — Past Weeks:**

**Given** I want to see how I performed in previous weeks
**When** I tap/click the "This Week" label or a "History" link below the widget
**Then** an inline expansion (accordion-style, animated with 200ms slide-down) appears below the current week widget — NOT a modal or separate route — showing the last 4 weeks, each with:

- Date range (e.g., "Feb 3 - Feb 9")
- Total minutes studied
- Goal status: checkmark (met) or "X/Y" shortfall
- Progress bar (inline, small)

**And** the data is queried from the `streaks` table for the 4-week range, then grouped by ISO week in JavaScript (Dexie does not natively support GROUP BY)
**And** on mobile (<640px), the history list stacks vertically at full width
**And** clicking "This Week" again or a collapse button hides the history

**Goal Modification Mid-Week:**

**Given** I change my weekly goal from 3 hours to 1 hour on a Wednesday (after already studying 2 hours)
**When** the widget re-renders
**Then** the progress ring immediately reflects the new goal (showing 200% in this case)
**And** the pacing message updates based on the new goal
**And** the weekly history view uses the **current** goal for all past weeks (retroactive, not snapshotted) — this is a known simplification; per-week goal snapshots would require a Dexie table and are not worth the complexity for MVP

**Empty State:**

**Given** I have not set a weekly goal or no sessions have been recorded this week
**When** the widget loads
**Then** if no goal is set: the widget shows "Set a weekly goal" with a CTA button to open the goal picker
**And** if a goal is set but no study this week: the progress ring is empty (0%) with message "Start studying to track progress"

**Technical Requirements:**

- Weekly goal stored in `localStorage` key `study-weekly-goal` (simple preference, not worth an IndexedDB table)
- Create `WeeklyGoalProgress.tsx` component in `src/app/components/`
- Circular progress ring: SVG `<circle>` with `stroke-dasharray` and `stroke-dashoffset` for animated fill (CSS transition, 500ms)
- Week boundary calculation: `date-fns` functions `startOfISOWeek(new Date())` and `endOfISOWeek(new Date())`
- Weekly minutes: Dexie query `db.streaks.where('date').between(weekStart, weekEnd).toArray()` then sum `minutesStudied`
- Add to `useStreakStore` (extending the store created by Story 4.2):
  - `weeklyGoal: number` — stored state, initialized from `localStorage` on hydration
  - `weeklyMinutes: number` — derived/computed value, recalculated from Dexie query on `liveQuery` change
  - `weeklyProgress: number` — derived, computed as `weeklyMinutes / weeklyGoal` (NOT capped at 1.0 — can exceed 100%)
  - `setWeeklyGoal(minutes: number)` — action that persists to localStorage AND updates the store state
- Place widget on Overview page alongside the `StudyStreak` widget (Story 4.2)
- **No Dexie schema changes** — reads from existing `streaks` table
- Preset options array is a constant, not configurable from a database

**FRs Fulfilled:** FR33 _(per epics.md remapped definition — see epic-level FR Numbering Governance. PRD FR33 "track challenge progress" is DEFERRED; this story implements "weekly study goals".)_

---

### Story 4.5: Streak Milestone Celebrations

As a learner,
I want to receive celebratory feedback when I hit streak milestones,
So that I feel rewarded for my consistency and motivated to keep going.

**Acceptance Criteria:**

**Milestone Detection:**

**Given** the `useStreakStore` recalculates `currentStreak` after a study session ends (Story 4.1 → Story 4.2 reactive update)
**When** the new `currentStreak` value reaches or passes a milestone: 3, 7, 14, 30, 50, 100, 200, 365 days (UX spec defines 7, 30, 100; additional milestones at 3, 14, 50, 200, 365 are added for richer feedback — UX amendment documented)
**Then** a celebration is triggered for the **highest uncelebrated milestone** that `newStreak >= milestone AND previousStreak < milestone`. This handles milestone skips (e.g., streak jumps from 6 to 8 due to timezone edge → Day 7 celebration fires).
**And** the milestone is recorded in `localStorage` key `streak-milestones-seen` as `{streakId: string, milestones: number[]}` to prevent re-triggering on page refresh
**And** `streakId` is defined as the ISO date string (YYYY-MM-DD) of the first day of the current streak, stored in `useStreakStore` as `streakStartDate`. When `currentStreak` resets to 0, `streakStartDate` is cleared. When a new streak begins (0 → 1), `streakStartDate` is set to today's date. This uniquely identifies each streak.
**And** each milestone is celebrated only once per streak (if the streak resets to 0 and rebuilds past 7 again, the Day 7 celebration fires again because `streakId` changed)

**In-App Celebration — Framer Motion Animation:**

**Given** a streak milestone is reached
**When** the celebration triggers
**Then** the `StudyStreak` dashboard widget (Story 4.2) plays a celebration animation using Framer Motion:

- **Day 3**: Flame icon pulses (scale 1.0 → 1.3 → 1.0, 300ms, ease-out) + subtle orange glow — **CSS transition only** (simple enough for CSS)
- **Day 7**: Flame icon pulses + "You're on fire!" text appears with slide-up animation (200ms) + orange confetti (8 particles, 500ms, gravity fade) — **Framer Motion** (confetti requires JS)
- **Day 14**: Same as Day 7 with blue accent confetti (8 particles)
- **Day 30**: Large flame pulse (scale 1.0 → 1.5 → 1.0) + gold confetti burst (16 particles, 700ms) + "Unstoppable!" banner slide-down
- **Day 50**: Same as Day 30 with 20 particles
- **Day 100**: Trophy icon overlay (Lucide `Trophy`, gold) + confetti burst (24 particles, 800ms) + "Century streak!" message
- **Day 200**: Same as Day 100 with 32 particles
- **Day 365**: Full celebration with custom "One Year!" message + extended confetti (40 particles, 1000ms)

**And** the hybrid animation strategy follows the Architecture doc: **CSS transitions for simple animations** (Day 3 pulse, hover states) + **Framer Motion for complex celebrations** that require particle physics, sequenced animations, or choreographed multi-element transitions. This resolves the UX spec's "CSS transitions for 60fps" preference while enabling the rich celebrations the Architecture doc requires.
**And** all Framer Motion animations use `LazyMotion` with `domAnimation` features (async loaded per Architecture)
**And** animations respect `prefers-reduced-motion`: if enabled, show static badge/message only, no animation (NFR62)

**Toast Notification:**

**Given** a streak milestone celebration triggers
**When** the animation begins
**Then** a Sonner toast appears **simultaneously** with the animation (no delay — both fire in the same event handler) with the milestone message:

- Day 3: "3-day streak! You're building a habit."
- Day 7: "7-day streak! One full week of learning."
- Day 14: "14-day streak! Two weeks strong."
- Day 30: "30-day streak! You're unstoppable!"
- Day 50: "50-day streak! Incredible dedication."
- Day 100: "100-day streak! Century milestone!"
- Day 200: "200-day streak! Legendary consistency!"
- Day 365: "365-day streak! One full year of learning!"

**And** the toast auto-dismisses after 5 seconds
**And** the toast has a flame emoji prefix and uses the `success` variant styling

**Optional Browser Notification:**

**Given** the user has granted browser notification permission (via Settings or a one-time prompt)
**When** a streak milestone is reached and the app tab is not focused
**Then** a browser `Notification` is sent with title "Streak Milestone!" and body matching the toast message
**And** clicking the notification focuses the app tab

**Given** the user has not granted notification permission
**When** a streak milestone is reached
**Then** only the in-app celebration (animation + toast) is shown
**And** no permission prompt is triggered (permission is requested only from Settings page)

**Given** the user has denied notification permission
**When** the app checks permission status
**Then** the browser notification feature is silently skipped (no error, no re-prompt)

**Notification Permission — Settings Integration:**

**Given** I navigate to Settings
**When** I view the notification preferences section
**Then** a toggle is displayed: "Streak milestone notifications" with description "Get notified when you hit a streak milestone"
**And** if browser `Notification.permission === 'default'` (not yet asked), clicking the toggle triggers `Notification.requestPermission()`
**And** if permission is `'granted'`, the toggle is enabled
**And** if permission is `'denied'`, the toggle is disabled with helper text: "Notifications blocked by browser. Update in browser settings."
**And** the user's preference is stored in `localStorage` key `streak-notifications-enabled`
**And** the default state (before user interaction) is **disabled** — notifications are opt-in, not opt-out

**Celebration Confetti Component:**

**Given** a milestone requires confetti and the user is on the Overview page (streak widget visible)
**When** the confetti animation triggers
**Then** the `Confetti.tsx` component renders particles originating from the streak widget position (using `getBoundingClientRect()` on the widget ref)
**And** particles are colored in warm tones (orange, gold, red) matching the streak theme
**And** particles follow a physics-based arc with gravity and fade-out
**And** the component is lazy-loaded (`React.lazy`) since it's not needed on most renders
**And** confetti does not obstruct interactive elements (uses `pointer-events-none` on the overlay)

**Given** a milestone requires confetti but the user is NOT on the Overview page (streak widget not mounted)
**When** the confetti animation triggers
**Then** particles originate from viewport top-center (`{x: window.innerWidth / 2, y: 0}`) as a fallback
**And** the toast notification still fires regardless of which page the user is on

**Given** a celebration animation is playing
**When** the user navigates to a different route
**Then** the animation is cleaned up via Framer Motion `AnimatePresence` with `onExitComplete` — no orphaned DOM nodes or running timers remain

**Technical Requirements:**

- Create `src/app/components/celebrations/Confetti.tsx` using Framer Motion for particle animation (per Architecture file reference). Lazy-loaded via `React.lazy` + `Suspense`.
- Milestone detection logic in `useStreakStore`: compare previous `currentStreak` with new value after recalculation. If new value is in `MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365]` and previous was below that threshold, trigger celebration.
- `localStorage` key `streak-milestones-seen` stores `{streakId: string, milestones: number[]}` where `streakId` is the ISO date string of the streak's first day (matches `streakStartDate` in `useStreakStore`). If `localStorage` is unavailable (private browsing, quota exceeded), milestones-seen tracking is skipped — worst case is a duplicate celebration on page refresh, which is acceptable.
- Browser notification: use `Notification` API (not a service worker push notification — this is a local-only app)
- Animation variants defined as Framer Motion `variants` objects for each milestone tier, with `prefers-reduced-motion` check via `useReducedMotion()` from Framer Motion
- Toast messages via Sonner `toast.success()`
- Settings toggle: add to existing Settings page (Story 4.5 owns this toggle; Settings page already exists). Default: disabled (opt-in).
- Confetti component wraps content in Framer Motion `AnimatePresence` to ensure clean exit animations and DOM cleanup on route navigation.
- **Audio/sound:** Out of scope for this story. No audio cues are included. Can be added as a future enhancement if desired.
- **Bundle impact:** Confetti component is lazy-loaded and only imported when a milestone fires. Estimated <3KB gzipped.

**FRs Fulfilled:** FR32 _(Epic remapping: PRD FR32 is "create learning challenges" — DEFERRED. Epic FR32 redefined as "streak milestone celebrations". See FR Numbering Governance at epic level.)_

---

### Story 4.6: Streak Pause (Vacation Mode)

As a learner,
I want to pause my streak when I'm on vacation or taking a planned break,
So that I don't lose my streak progress and feel guilt-free about stepping away.

**Acceptance Criteria:**

**Activate Streak Pause:**

**Given** I have an active streak (currentStreak ≥ 1)
**When** I click the "Pause Streak" button in the `StudyStreakCalendar` component (button already exists in current UI)
**Then** the existing pause dialog opens (already implemented in `StudyStreakCalendar.tsx`)
**And** I can enter a number of days to pause (1-90, enforced with input validation). Maximum is 90 days — long enough for summer break or extended travel, short enough to preserve the meaning of a streak. This is a UX-informed constraint; the Architecture does not specify a maximum.
**And** upon clicking "Activate Pause", the pause is persisted to the Dexie `settings` table (not the `streaks` table) as documented in the Pause Data Storage section below

**Pause Data Storage — Migration to Dexie:**

**Given** the existing pause implementation uses `localStorage` key `study-streak-pause`
**When** Story 4.6 is implemented
**Then** pause state is stored in a new Dexie table `settings: '&key'` as a key-value pair: `{key: 'streak-pause', value: {enabled: true, startDate: 'YYYY-MM-DD', days: N}}`
**And** the existing `setStreakPause()`, `getStreakPauseStatus()`, and `clearStreakPause()` functions in `studyLog.ts` are updated to read/write from Dexie instead of localStorage
**And** on first load, if `localStorage` has a `study-streak-pause` value and Dexie does not, the value is migrated to Dexie and the localStorage key is removed
**And** if the migrated pause has `days > 90`, clamp to 90 and log a console warning. If the migrated pause has already expired (current date > startDate + days), discard it instead of migrating.

**Streak Calculation During Pause:**

**Given** a streak pause is active with `startDate` and `days` configured
**When** `useStreakStore` recalculates the current streak
**Then** dates within the pause window (`startDate` to `startDate + days`) are treated as "protected" — they do not break the streak even if `minutesStudied` is 0 or no record exists
**And** the streak count does NOT increment for paused days (pause preserves the streak, it does not inflate it)
**And** the streak calculation skips paused dates when checking for consecutive study days

**Given** the pause period has expired (current date > `startDate + days`)
**When** `useStreakStore` recalculates
**Then** the pause is automatically cleared via `clearStreakPause()`
**And** normal streak rules resume: the user must study ≥10 minutes today or yesterday to maintain the streak
**And** if the user did not study on the first day after pause expiry, the streak is broken

**Pause Status Display:**

**Given** a streak pause is active
**When** I view the `StudyStreak` dashboard widget (Story 4.2) or the `StudyStreakCalendar` (Story 4.3)
**Then** the widget shows a pause indicator: Lucide `Pause` icon + "Vacation mode active" text in `text-xs text-orange-600` (already present in current UI)
**And** the remaining pause days are shown: "3 days remaining"
**And** the streak count remains visible at its pre-pause value
**And** paused days in the calendar heatmap (Story 4.3) are rendered with a distinct style: diagonal stripe pattern overlay on the cell using `background-image: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(251, 146, 60, 0.15) 3px, rgba(251, 146, 60, 0.15) 6px)` (orange-400 at 15% opacity) to distinguish from "no activity" (empty) days. The stripe uses orange tones consistent with the pause/vacation theme.
**And** each paused cell has `aria-label="Paused (vacation mode)"` so screen readers distinguish paused days from unstudied days
**And** the stripe pattern does not rely solely on color — the diagonal lines provide a shape-based visual differentiator (WCAG 1.4.1 Use of Color)

**Cancel Pause Early:**

**Given** a streak pause is active
**When** I click "Resume Streak" (replaces the "Pause Streak" button during active pause)
**Then** the pause is immediately cleared
**And** normal streak rules resume from this moment
**And** a toast confirms: "Vacation mode ended. Welcome back!"

**Pause Constraints:**

**Given** I try to activate a pause when my current streak is 0
**When** I click "Pause Streak"
**Then** the button is disabled with tooltip: "Start a streak first to enable pause"

**Given** I try to activate a second pause while one is already active
**When** I click "Pause Streak"
**Then** the dialog opens in "manage" mode showing: current pause start date, original duration, days remaining, and two action buttons: "Extend Pause" and "Cancel Pause"
**And** clicking "Extend Pause" shows an input field pre-labeled "Add days:" (1-90 minus current remaining, so total never exceeds 90)
**And** clicking "Cancel Pause" immediately ends the pause (same behavior as "Resume Streak")

**Given** the pause `days` input exceeds 90
**When** I try to submit
**Then** an inline error shows: "Maximum pause duration is 90 days"

**Given** I try to extend a pause and the extension would exceed 90 total days
**When** I enter the extension days
**Then** an inline error shows: "Total pause cannot exceed 90 days (X days remaining)"

**Technical Requirements:**

- The `settings: '&key'` table is included in the Dexie schema version 2 increment (coordinated with Story 4.1's `studySessions` and `streaks` tables — all Epic 4 tables are registered in a single version bump). This story does NOT perform its own version increment. See Epic 4 Prerequisites section for the version strategy.
- Update `setStreakPause()`, `getStreakPauseStatus()`, `clearStreakPause()` in `src/lib/studyLog.ts` to use `db.settings.put({key: 'streak-pause', value: {...}})` and `db.settings.get('streak-pause')`. These functions become async (return Promises).
- Add `isPaused`, `pauseDaysRemaining`, `activatePause(days)`, `cancelPause()`, `extendPause(additionalDays)` to `useStreakStore`
- Update streak calculation in `useStreakStore.recalculate()` to skip paused date ranges when checking consecutive days
- **Reload removal audit:** Replace `window.location.reload()` in `StudyStreakCalendar.tsx` `handlePauseStreak` with `useStreakStore.activatePause(days)`. Also audit `handleCancelPause` — if it uses `window.location.reload()`, replace with `useStreakStore.cancelPause()`. The existing component must not use full page reloads for any pause operation — all state changes flow through the Zustand store reactively.
- Calendar cell styling for paused days: CSS `background-image: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(251, 146, 60, 0.15) 3px, rgba(251, 146, 60, 0.15) 6px)` — orange-400 at 15% opacity for accessible visual distinction.
- Migrate existing `localStorage` `study-streak-pause` on first load. Clamp migrated `days` to 90 max. Discard expired pauses.
- **Constraint validation:** Pause max is 90 days. Input validation on blur and submit. Extension validation ensures total (remaining + extension) ≤ 90.

**FRs Fulfilled:** PRD-FR31 _(This story implements the PRD's original FR31: "pause streak without losing history". Note: the epic-level FR31 was remapped to "Show streak count and longest streak" and is assigned to Story 4.2. This story covers the PRD's original intent. See FR Numbering Governance at epic level.)_

---

## Epic 5: Insights & Learning Analytics

Provide data-driven insights through momentum scoring, study pattern analytics, and smart recommendations to optimize learning strategy.

**Stories:** 5.1 Momentum Scoring Engine, 5.2 Momentum Display on Course Cards, 5.3 Continue Learning Smart Resume, 5.4 Study Session Analytics & Stats Cards, 5.5 Activity Timeline & Study Patterns, 5.6 Course Insights & Completion Analytics

**FR Numbering Governance:**
Epic 5 remapped several FR definitions during epic decomposition (Step 2) to align with the analytics-focused scope. Key divergences from the PRD originals:
- FR39: PRD = "receive course recommendations based on current study patterns" → Epic = "Show Continue Learning smart resume suggestion" _(recommendations partially absorbed into momentum-based course selection)_
- FR40: PRD = "receive suggestions for next course to study" → Epic = "Track study sessions" _(session tracking infrastructure was built in Epic 4 Story 4.1; this epic provides the analytics VIEW)_
- FR41: PRD = "identify courses at risk of abandonment" → Epic = "Calculate average session length and total study hours" _(abandonment detection is implicit in the `cold` momentum category from FR37)_
- FR42: PRD = "receive adaptive study scheduling suggestions" → Epic = "Display recent activity timeline (last 7 days)" _(adaptive scheduling is DEFERRED to a future epic)_
- FR64, FR65: Added during epic design — not in the original PRD. FR64 extends FR38 (visual momentum display), FR65 adds trend comparison.

PRD concepts **deferred** from this epic:
- Adaptive study scheduling (PRD FR42 original) — deferred to future epic
- Full recommendation engine with MiniSearch similarity (PRD FR39/FR40 original) — simplified to momentum-based "Continue Learning" selection; full recommendations deferred to Epic 6 (AI-powered)

**Prerequisites (must be satisfied before Story 5.1 begins):**
1. **Epic 4 complete** — `studySessions` table populated with session data, `useStudySessionStore` available for session-end event subscription.
2. **Epic 1 complete** — `courses`, `videos`, `progress` tables populated with course and completion data.
3. **Dexie version 3** — Story 5.1 adds the `courseMomentum` table via a version 3 increment. This is the only schema change in Epic 5.
4. **Recharts** — Already installed (`recharts ^2.15.4` in `package.json`). Used by Story 5.6 for the ProgressChart and by shadcn/ui's Chart component.

**Architecture Alignment:**
- `courseMomentum: 'courseId, score, category, lastStudied'` matches the Architecture canonical schema exactly.
- `src/analytics/` directory structure matches Architecture: `momentum.ts`, `velocity.ts`, `recommendations.ts`.
- Zustand stores follow project convention: `useMomentumStore`, `useAnalyticsStore`.
- Architecture specifies Web Worker for midnight pre-computation and post-session recalculation. Stories implement post-session recalculation directly; Web Worker optimization is noted as a future enhancement (can be added without API changes since store methods are already async).

**Canonical Completion Percentage Definition:**
A single definition applies across all Epic 5 stories: `completionPercentage` for a course = count of videos where `progress.completionPercentage >= 95` ÷ total `videos` count for the course × 100. Individual video `progress.completionPercentage` is calculated as `(currentTime / duration) × 100` from the `progress` table (Epic 1). A video is considered "complete" at ≥ 95% to account for end credits and imprecise seeking. This definition is used by Stories 5.1 (momentum formula), 5.3 (resume algorithm), and 5.6 (course completion list).

**Query Performance Strategy:**
Stories 5.4, 5.5, and 5.6 aggregate raw `studySessions` data across 7-30 day windows. To meet the <100ms Architecture target:
1. All queries use Dexie indexed fields: `studySessions.courseId`, `studySessions.startTime`, `progress.courseId`, `notes.courseId`.
2. A compound index `[courseId+startTime]` should be added to `studySessions` in the Dexie schema (Architecture gap — not in current canonical schema). This enables efficient range queries by course and date.
3. Aggregation results are cached in `useAnalyticsStore` and invalidated on session-end events or after 60 seconds of staleness (Story 5.4 defines the caching pattern).
4. For datasets exceeding 1000 sessions, Architecture's midnight Web Worker pre-computation can be adopted as a future optimization — store methods are already `async` to support this without API changes.

**Overview Page Layout Order** (top to bottom, for `src/app/pages/Overview.tsx`):
1. Continue Learning button (Story 5.3)
2. Stats Cards row — 4-column grid (Story 5.4)
3. Two-column layout: Recent Activity timeline (Story 5.5) | Study Streak Calendar (Epic 4)
4. Course Insights section: ProgressChart + CourseCompletionList (Story 5.6)
5. In-Progress Courses grid with MomentumIndicator badges (Story 5.2, existing EnhancedCourseCard)

### Story 5.1: Momentum Scoring Engine

As a learner,
I want each course automatically scored based on my recent activity, completion progress, and study frequency,
So that I can see at a glance which courses are active, recently studied, or neglected.

**Acceptance Criteria:**

**Dexie.js Schema Extension:**

**Given** the Dexie.js database exists with version 2 (from Epic 4)
**When** the app initializes
**Then** a new table is added via a Dexie version 3 increment:

```javascript
// Dexie version 3 (Epic 5)
courseMomentum: 'courseId, score, category, lastStudied'
```

**And** existing tables and data from versions 1-2 are preserved through the migration

**Momentum Score Calculation:**

**Given** at least one course exists with study session data (from Epic 4 Story 4.1)
**When** a study session ends (detected via `useStudySessionStore` session-end event)
**Then** the momentum score for the affected course is recalculated using:

```
recencyScore = 100 × exp(-daysSinceLastStudy / 7)
completionScore = course.completionPercentage
frequencyScore = min(100, (weeklySessionCount / 4) × 100)
totalScore = recencyScore × 0.4 + completionScore × 0.3 + frequencyScore × 0.3
```

**And** the score is rounded to the nearest integer (0-100)
**And** the recalculation is debounced by 5 seconds (if multiple sessions end in quick succession, only one recalculation fires)

**Given** `daysSinceLastStudy` is 0 (studied today)
**When** the score is calculated
**Then** `recencyScore` = 100 (maximum freshness)

**Given** `daysSinceLastStudy` is 7 (one week ago)
**When** the score is calculated
**Then** `recencyScore` ≈ 37 (exponential decay: `100 × exp(-1)`)

**Given** `daysSinceLastStudy` is 21 (three weeks ago)
**When** the score is calculated
**Then** `recencyScore` ≈ 5 (near-zero — course is going cold)

**Course Categorization:**

**Given** a momentum score has been calculated
**When** the score is persisted
**Then** the course is categorized as:

- `hot` if score ≥ 70
- `warm` if score ≥ 40 and < 70
- `cold` if score < 40

**Cross-reference note:** The UX spec (lines 834-836) defines HOT/WARM/COLD by pure recency (3/7/7+ days). Architecture defines them by the weighted formula above. **Architecture takes precedence** — the formula captures completion and frequency, not just recency. The UX labels ("Active"/"Recent"/"Paused" in Story 5.2) serve as user-friendly approximations of the formula-based categories.

**And** the `courseMomentum` record is upserted via `db.courseMomentum.put({ courseId, score, category, lastStudied: new Date().toISOString() })`
**And** `courseId` is the primary key (auto-increment `number` from `courses: '++id, ...'`) — `put()` overwrites any existing record for that course

**Bulk Initialization:**

**Given** the app starts and courses exist but some have no `courseMomentum` record
**When** `useMomentumStore.initialize()` is called on app startup (called from `src/main.tsx` or the root `App.tsx` component's `useEffect` — runs once before any page renders)
**Then** momentum scores are calculated for ALL courses that have at least one `studySessions` record
**And** courses with zero sessions receive `{ score: 0, category: 'cold', lastStudied: null }`
**And** the bulk calculation runs in a single Dexie transaction for atomicity

**Given** a new course is imported (Epic 1) that has never been studied
**When** momentum is queried for that course
**Then** the store returns `{ score: 0, category: 'cold', lastStudied: null }`
**And** no `courseMomentum` record is written until the first session ends (avoid polluting the table with zero-score rows)

**Store Interface:**

**Given** any component needs momentum data
**When** it subscribes to `useMomentumStore`
**Then** the store exposes:

- `scores: Record<number, MomentumScore>` — all course momentum data keyed by courseId (`number` — auto-increment PK from `courses: '++id, ...'`)
- `getScore(courseId): MomentumScore` — single course lookup (returns cold default if not found)
- `getHotCourses(): MomentumScore[]` — courses with category `hot`, sorted by score descending
- `getWarmCourses(): MomentumScore[]` — courses with category `warm`, sorted by score descending
- `getColdCourses(): MomentumScore[]` — courses with category `cold`, sorted by lastStudied descending
- `getSortedByScore(): MomentumScore[]` — all courses sorted by score descending (used by Story 5.2 for "Sort by Momentum")
- `recalculate(courseId): Promise<void>` — recalculate and persist single course
- `initialize(): Promise<void>` — bulk recalculate all courses on startup
- `isInitialized: boolean` — false until first `initialize()` completes

**MomentumScore Type Definition:**

```typescript
interface MomentumScore {
  courseId: number;          // PK from courses table (++id auto-increment)
  score: number;            // 0-100 integer
  category: 'hot' | 'warm' | 'cold';
  lastStudied: string | null; // ISO 8601 timestamp or null if never studied
  courseName?: string;      // denormalized for display convenience (populated by store on load)
}
```

**IndexedDB Failure Handling (NFR15):**

**Given** IndexedDB is unavailable or a write to `courseMomentum` fails
**When** momentum calculation completes
**Then** the score is held in Zustand memory only (no persistence)
**And** a console warning is logged: `"Momentum scores not persisted — IndexedDB unavailable"`
**And** the store still returns scores from memory — components are not affected
**And** scores are recalculated fresh on next session end or app restart

**Performance (Architecture § Performance Optimization, line 874):**

**Given** a user has up to 100 courses with study data
**When** bulk initialization runs
**Then** it completes in <100ms (leveraging Dexie indexes on `studySessions.courseId` and `progress.courseId`)
**Note:** The <100ms target originates from the Architecture document's performance optimization section, not from any numbered PRD NFR.

**Technical Requirements:**

- Create `src/analytics/momentum.ts` with pure functions: `calculateMomentumScore(daysSinceLastStudy: number, completionPercentage: number, weeklySessionCount: number): number` and `categorizeMomentum(score: number): 'hot' | 'warm' | 'cold'`. These are unit-testable with zero dependencies.
- Create `src/stores/momentumStore.ts` implementing `useMomentumStore` (Zustand v5). The store subscribes to `useStudySessionStore` for session-end events to trigger debounced recalculation.
- Dexie version 3 in `src/db/schema.ts`: add `courseMomentum: 'courseId, score, category, lastStudied'` — matches Architecture canonical schema.
- `weeklySessionCount` query: `db.studySessions.where('courseId').equals(id).filter(s => new Date(s.startTime) >= sevenDaysAgo).count()`.
- `daysSinceLastStudy` query: `db.studySessions.where('courseId').equals(id).reverse().sortBy('startTime')` → take first → calculate day diff.
- `completionPercentage` derived from the `progress` table (Epic 1) per the epic-level canonical definition: count of `progress` records with `completionPercentage >= 95` ÷ total `videos` count for the course × 100. Individual video `progress.completionPercentage` = `(currentTime / duration) × 100`.
- Architecture notes Web Worker for midnight pre-computation. This story implements synchronous post-session recalculation only. Web Worker can be added as an optimization without API changes (store methods are already `async`).

**FRs Fulfilled:** FR36

---

### Story 5.2: Momentum Display on Course Cards

As a learner,
I want to see visual indicators on my course cards showing which courses are hot, warm, or cold — and whether momentum is trending up or down,
So that I can quickly identify which courses need my attention and which are on track.

**Acceptance Criteria:**

**Momentum Badge Display:**

**Given** I am viewing a page with course cards (Overview, Courses, or any page rendering course cards)
**When** a course has a momentum score from `useMomentumStore` (Story 5.1)
**Then** a MomentumIndicator badge is displayed in the top-right corner of the course card:

- **Hot** (score ≥ 70): `Flame` icon (lucide-react) with label "Active" — `bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300`
- **Warm** (score 40-69): `Sun` icon with label "Recent" — `bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300`
- **Cold** (score < 40): `Snowflake` icon with label "Paused" — `bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400`

**And** the badge is positioned as an absolute overlay (`absolute top-2 right-2`) with `rounded-full px-2 py-0.5 text-xs font-medium`
**And** each badge shows both an icon (16×16) and a text label

**Given** a course has never been studied (score 0, category cold, `lastStudied: null`)
**When** I view the course card
**Then** no momentum badge is displayed — only courses that WERE studied and went cold show the snowflake (prevents badge clutter on fresh imports)

**Momentum Trend Arrow:**

**Given** a course has at least 14 days of study session history
**When** I view the course card
**Then** a trend indicator appears next to the category badge:

- **Improving**: current 7-day average score > previous 7-day average score by ≥ 5 points → `TrendingUp` icon in `text-green-600`
- **Stable**: difference within ± 5 points → `Minus` icon in `text-gray-500`
- **Declining**: current 7-day average score < previous 7-day average score by ≥ 5 points → `TrendingDown` icon in `text-red-500`

**And** the trend arrow is a 14×14 icon displayed inline after the badge label

**Given** a course has fewer than 14 days of session history
**When** I view the course card
**Then** no trend arrow is shown (insufficient data) — only the category badge displays

**Trend Calculation Detail:**

**Given** the trend needs to be calculated for a course
**When** `useMomentumStore.getTrend(courseId)` is called
**Then** the store:

1. Queries `studySessions` for the last 14 days for this course (using indexed query: `db.studySessions.where(['courseId', 'startTime']).between([courseId, fourteenDaysAgo], [courseId, now])`)
2. Splits into two 7-day windows: days 0-6 (current) and days 7-13 (previous)
3. For each window, calculates a **simplified activity score**: `(sessionCountInWindow / 4) × 50 + (totalMinutesInWindow / 120) × 50` — this captures both frequency and duration without needing to recompute the full momentum formula (which requires completion data that doesn't change between windows)
4. Compares the two window scores: difference = currentWindowScore - previousWindowScore

**And** the ± 5 point threshold for "improving" / "declining" prevents noise from minor fluctuations
**And** if the previous window has zero sessions, trend is `null` (insufficient data) even if current window has sessions

**Trend Caching:**

**Given** trend results have been computed
**When** they are stored in `useMomentumStore`
**Then** trends are cached in a `Map<number, { trend: string, computedAt: number }>` keyed by courseId
**And** cache entries are invalidated when:
- A new session ends for that course (event subscription from `useStudySessionStore`)
- `initialize()` is called (full recalculation)
- The entry is older than 60 seconds and a component re-requests it (lazy invalidation)
**And** stale cache entries return the cached value immediately while triggering a background recalculation (optimistic staleness)

**Sort by Momentum:**

**Given** I am on the Courses page
**When** I select "Sort by Momentum" from the sort dropdown (or equivalent sort control)
**Then** courses are sorted by momentum score descending (hottest first)
**And** within the same score, courses are sub-sorted by `lastStudied` descending (most recently studied first)
**And** courses with no momentum data (never studied) appear last

**Accessibility:**

**Given** a course card displays a momentum badge
**When** a screen reader encounters the card
**Then** the badge has `aria-label` describing the full state (e.g., "Course momentum: Active, improving trend" or "Course momentum: Paused, declining trend")
**And** the icon + text label provide redundant information — color is NOT the only differentiator (WCAG 1.4.1)

**Given** a course card displays a trend arrow
**When** a screen reader encounters it
**Then** the arrow icon has `aria-hidden="true"` and a `sr-only` span provides the text (e.g., "momentum improving")

**Loading State:**

**Given** `useMomentumStore.isInitialized` is false (Story 5.1 still loading)
**When** course cards render
**Then** a skeleton placeholder replaces the MomentumIndicator badge: a rounded pill shape (48×20 px) with pulsing animation at the badge position (`absolute top-2 right-2`)
**And** skeleton uses `bg-muted animate-pulse rounded-full` (UX spec line 1804: "Skeleton loaders for predictable content, 500ms delay before showing")
**And** the skeleton appears only after a 500ms delay — if initialization completes within 500ms, no skeleton flickers

**Responsive Behavior:**

**Given** the viewport is < 640px (mobile)
**When** I view course cards
**Then** the MomentumIndicator badge reduces to icon-only (no text label) to save horizontal space
**And** the full label is available via the badge's `title` attribute (native tooltip on long-press)

**Given** the viewport is ≥ 640px (tablet/desktop)
**When** I view course cards
**Then** the full badge is shown: icon + text label + optional trend arrow

**Technical Requirements:**

- Create `src/app/components/MomentumIndicator.tsx` — accepts props: `score: number`, `category: 'hot' | 'warm' | 'cold'`, `trend: 'improving' | 'stable' | 'declining' | null`, `compact?: boolean` (for mobile). Uses lucide-react icons (`Flame`, `Sun`, `Snowflake`, `TrendingUp`, `TrendingDown`, `Minus`).
- Integrate with `src/app/components/figma/EnhancedCourseCard.tsx` (the primary course card used on Overview and Courses pages) and `src/app/components/ProgressCourseCard.tsx` (used on My Class). The indicator renders as an absolute-positioned child within the card's relative container. If the card component doesn't have `position: relative`, add it.
- Extend `useMomentumStore` (from Story 5.1) with `getTrend(courseId): 'improving' | 'stable' | 'declining' | null`. Trend is computed from `studySessions` data (last 14 days). Cache results and invalidate on session-end events.
- Add "Sort by Momentum" option to the Courses page sort controls. The sort reads from `useMomentumStore.scores`.
- The trend calculation does NOT require a historical scores table — it recalculates from raw `studySessions` data each time. This avoids schema complexity at the cost of slightly more computation (acceptable for <100 courses).

**FRs Fulfilled:** FR37 _(sort course list by momentum score — moved from Story 5.1)_, FR38, FR64, FR65

---

### Story 5.3: Continue Learning Smart Resume

As a learner,
I want a single "Continue Learning" button that intelligently picks my best course and resumes exactly where I left off,
So that I can start studying immediately without deciding what to work on.

**Acceptance Criteria:**

**Button Placement & Appearance:**

**Given** I navigate to the Overview page
**When** the page renders
**Then** a prominent "Continue Learning" button is displayed at the top of the dashboard, above the stats row
**And** it includes a `Play` icon (lucide-react) on the left
**And** it shows context below the label: the selected course name and next video title (e.g., "React Hooks — useEffect Basics")
**And** the button uses `bg-blue-600 text-white hover:bg-blue-700` with `shadow-lg hover:shadow-xl` transition
**And** the context subtitle uses `text-sm text-blue-200`

**Smart Course Selection Algorithm:**

**Given** I click "Continue Learning"
**When** the algorithm executes
**Then** it selects the best course using this priority chain:

1. **In-progress video exists**: Any course with a video at 5-95% completion → pick the course with the most recent `progress.updatedAt` timestamp
2. **Hottest course with remaining content**: No in-progress video → pick the course with the highest momentum score (from `useMomentumStore`, Story 5.1) that still has unwatched videos (0% completion)
3. **Any course with remaining content**: No momentum data → pick the course with the most recent `importedAt` that has unwatched videos
4. **All content complete**: If every video in every course is ≥ 95% complete → show "All Caught Up!" state (see below)

**Given** the algorithm selects a course
**When** it determines which video to play
**Then** it applies this logic:

1. In-progress video exists (5-95%) → resume that video at saved `progress.currentTime`
2. Current section/module has unwatched videos (0%) → play the next unwatched video from the start
3. Current section complete → start the first video of the next section
4. Course fully watched → this course should not have been selected (skip to next candidate)

**Resume at Exact Position:**

**Given** a video is selected for resume
**When** the player loads
**Then** playback starts at the saved `progress.currentTime` position (± 1 second accuracy)
**And** the target time from button click to video playing is < 2 seconds for local files. NFR17 ("no barriers to opening app and starting study session") is satisfied by the smart selection removing the decision overhead — the actual playback startup time depends on route transition + lazy load + video player initialization, and a strict <1s target is unrealistic for the full chain. The 2-second budget is: ~200ms algorithm + ~200ms route navigation + ~500ms component mount + ~500ms video seek + 600ms buffer.

**File Not Found Recovery:**

**Given** the saved video file is no longer accessible (file moved, renamed, or deleted)
**When** the player attempts to load the file
**Then** a file picker dialog opens with the message: "Video file not found. Please locate it."
**And** if the user selects a replacement file, playback resumes from the saved position
**And** if the user cancels the picker, they return to the Overview page with a toast notification: "Video not found — try selecting a course manually"

**Empty States:**

**Given** no courses exist (fresh install or all deleted)
**When** the Overview page renders
**Then** the "Continue Learning" section shows: "Import a course to get started" with an inline link to the course import flow (Epic 1)
**And** no button is rendered

**Given** courses exist but none have been started (all at 0%)
**When** the Overview page renders
**Then** the button shows "Start Learning" (instead of "Continue Learning") and selects the first imported course
**And** the subtitle shows the first course's name and first video title

**Given** all courses are fully complete (every video ≥ 95%)
**When** the Overview page renders
**Then** the button area shows: "All Caught Up!" with a celebration icon (`PartyPopper` from lucide-react) and message "You've completed all your courses. Import new content to keep learning."
**And** no clickable button is rendered

**Loading State:**

**Given** the algorithm is querying IndexedDB for the best course
**When** the component mounts and data is not yet available
**Then** a skeleton loader is shown: a rounded rectangle matching the button dimensions with a pulsing animation
**And** the skeleton matches the button's `rounded-xl` shape and full width

**Given** `useMomentumStore.isInitialized` is false (Story 5.1 still loading)
**When** the ContinueLearningButton renders
**Then** it waits for initialization to complete before running the selection algorithm (displays skeleton)

**Session Integration:**

**Given** I click "Continue Learning" and video playback begins
**When** the session starts
**Then** a new study session is logged via `useStudySessionStore` (Epic 4 Story 4.1)
**And** after the session ends, the momentum score for the selected course is recalculated (Story 5.1)

**Accessibility:**

**Given** I am navigating with a keyboard
**When** I focus the "Continue Learning" button
**Then** it has a visible focus ring (`ring-2 ring-blue-500 ring-offset-2`)
**And** `aria-label` is set to "Continue learning: [Course Name] — [Video Title]"
**And** the button is reachable via Tab within the first 3 interactive elements on the Overview page (NFR21: < 3 clicks to core workflows)

**Given** the empty state renders (no courses or all complete)
**When** a screen reader encounters the section
**Then** the message is wrapped in a `role="status"` container with appropriate `aria-label`

**Responsive:**

**Given** the viewport is < 640px (mobile)
**When** the button renders
**Then** it spans full width with larger touch target (min 56px height per UX spec)
**And** the subtitle text truncates with ellipsis if the course/video name is too long

**Given** the viewport is ≥ 1024px (desktop)
**When** the button renders
**Then** it has a max-width constraint (`max-w-lg`) and is left-aligned within the dashboard flow

**Technical Requirements:**

- Create `src/app/components/ContinueLearningButton.tsx` — self-contained component that queries `useMomentumStore.getHotCourses()` and a `useProgressStore.getInProgressVideos()` method to determine the target course and video. **Components NEVER import `db` directly** (Architecture line 1909) — all data access goes through Zustand stores.
- `useProgressStore` (created by Epic 1, or must be created as a prerequisite) must expose: `getInProgressVideos(): Promise<{ courseId: number, videoId: number, currentTime: number, completionPercentage: number, updatedAt: string }[]>` and `getUnwatchedVideos(courseId: number): Promise<{ videoId: number, title: string }[]>`. These methods encapsulate IndexedDB queries internally.
- The selection algorithm runs on component mount and caches the result in local state (`useState`). It re-runs when the user navigates back to Overview (via `useEffect` with route-awareness or `useMomentumStore` subscription).
- Navigation uses React Router's `useNavigate()` to route to the lesson player page with `courseId` and `videoId` params (route assumed from Epic 1 Story 1.2).
- Integrate into `src/app/pages/Overview.tsx` — placed above the stats row, below the page header. **QuickActions overlap note:** The existing `QuickActions` component on Overview may have a "Resume Video" button. The ContinueLearningButton REPLACES that functionality with a smarter algorithm. If QuickActions exists and contains resume functionality, either (a) remove the resume action from QuickActions or (b) remove QuickActions entirely if ContinueLearningButton covers all its use cases. The dev agent should check the existing QuickActions component and resolve the overlap.
- Performance target: algorithm completes in < 200ms. Store methods use indexed queries internally (e.g., `db.progress.where(...)`) but the component only calls the store API.
- IndexedDB failure handling (NFR15): If store queries fail, show a generic "Start studying" CTA linking to the Courses page instead of a smart suggestion. Log the error for debugging.

**FRs Fulfilled:** FR39

---

### Story 5.4: Study Session Analytics & Stats Cards

As a learner,
I want to see my study statistics — total study hours, average session length, sessions this week, and active course count — as dashboard cards with sparkline trends,
So that I understand my learning patterns and feel motivated by my accumulated study time.

**Acceptance Criteria:**

**Stats Cards on Overview:**

**Given** I navigate to the Overview page
**When** the page renders and study session data exists (from Epic 4 Story 4.1)
**Then** a row of 4 stats cards is displayed below the "Continue Learning" button (Story 5.3):

1. **Total Study Hours** — `Clock` icon in `bg-blue-100 dark:bg-blue-900/30` badge
   - Value: cumulative study time across all sessions, formatted as "X.Xh" (e.g., "42.5h")
   - Sparkline: 7 bars showing daily total study minutes for the last 7 days
   - Trend: compare this week's total minutes to last week's → percentage change with arrow

2. **Average Session** — `Timer` icon in `bg-green-100 dark:bg-green-900/30` badge
   - Value: average session duration across all sessions, formatted as "Xm" (e.g., "23m")
   - Sparkline: 7 bars showing daily average session length for the last 7 days
   - Trend: this week's average vs last week's average → percentage change

3. **Sessions This Week** — `Activity` icon in `bg-purple-100 dark:bg-purple-900/30` badge
   - Value: count of study sessions starting from Monday of current week through today
   - Sparkline: 7 bars showing daily session counts for the last 7 days
   - Trend: this week's count vs same-day-count last week → percentage change

4. **Courses Active** — `BookOpen` icon in `bg-orange-100 dark:bg-orange-900/30` badge
   - Value: count of courses with momentum category `hot` or `warm` (from `useMomentumStore`, Story 5.1)
   - No sparkline (simple count — momentum doesn't have daily granularity)
   - No trend arrow (momentum scores are point-in-time; no historical weekly snapshots exist to compare against)

**And** the cards render in a responsive grid: 4 columns on desktop (≥ 1024px), 2 columns on tablet (640-1023px), 1 column stacked on mobile (< 640px)

**StatsCard Component:**

**Given** a StatsCard is rendered with data
**When** the component mounts
**Then** it displays:

- Top-left: gradient icon badge (32×32 rounded icon container with the relevant lucide-react icon at 18×18)
- Center: large metric value (`text-3xl font-bold`)
- Below value: label text (`text-sm text-muted-foreground`)
- Right side: 7-bar sparkline (height 32px, bar width 6px, gap 4px)
- Bottom-right: trend indicator — `TrendingUp` (green-600) or `TrendingDown` (red-500) or `Minus` (gray-500) icon with percentage (e.g., "+12%" or "-8%")

**Given** I hover over a sparkline bar
**When** the tooltip appears
**Then** it shows the exact value and date (e.g., "Mon Feb 10: 45 min")
**And** the hovered bar changes color from `blue-200` to `blue-400`

**Sparkline Rendering:**

**Given** a sparkline needs to render 7 data points
**When** the component mounts
**Then** it renders as inline SVG: 7 `<rect>` elements, each 6px wide with 4px gaps
**And** bar heights are proportional: tallest bar = 32px (max value), shortest bar = 2px (min value or zero)
**And** zero-value bars render at minimum 2px height (visible but clearly minimal)
**And** bars use `rounded-sm` top corners (`rx="2"`)

**Sparkline Per-Bar Aggregation:**

**Given** sparkline data is calculated for each card type
**When** the 7 bars represent the last 7 calendar days (today through 6 days ago)
**Then** each bar's value is:
- **Total Study Hours**: sum of all `studySessions.duration` that day, in minutes (bar label shows minutes; card value shows cumulative hours)
- **Average Session**: mean duration of sessions that started on that day. If no sessions that day, bar = 0 (not interpolated)
- **Sessions This Week**: count of `studySessions` records with `startTime` on that day
**And** "that day" is defined by the browser's local timezone (midnight-to-midnight local time)

**Aggregation:**

**Given** session data exists in the `studySessions` table
**When** the analytics store calculates stats
**Then**:

- **Total Study Hours** = `SUM(duration)` across ALL sessions ÷ 3600, rounded to 1 decimal
- **Average Session** = `AVG(duration)` across ALL sessions ÷ 60, rounded to nearest minute
- **Sessions This Week** = `COUNT(*)` where `startTime` ≥ Monday 00:00 of current week (ISO week: Mon-Sun)
- **Courses Active** = count of `courseMomentum` records where `category` is `hot` or `warm`

**Given** the weekly trend comparison runs
**When** "this week" is Mon-Sun (ISO 8601 week, using the browser's local timezone for day boundaries)
**Then** "last week" is the previous Mon-Sun
**And** percentage change = `((thisWeek - lastWeek) / lastWeek) × 100`, rounded to nearest integer
**And** if `lastWeek` is 0, show "+100%" if `thisWeek > 0`, or no trend if both are 0
**And** for "Sessions This Week" specifically, the trend compares same-day-of-week counts (e.g., if today is Wednesday, compare Mon-Wed this week vs Mon-Wed last week) to avoid early-week bias where a partial week always appears worse than a full week

**Store & Caching:**

**Given** stats data has been calculated
**When** it is stored in `useAnalyticsStore`
**Then** the cache is invalidated and recalculated when:

- A new session ends (event subscription from `useStudySessionStore`)
- The user navigates to Overview and the last calculation is > 60 seconds stale

**And** the store exposes: `totalStudyHours`, `averageSessionMinutes`, `sessionsThisWeek`, `coursesActive`, `sparklineData: { daily: number[] }`, `trends: { direction, percentage }`, `isLoading`, `recalculate(): Promise<void>`

**Loading State:**

**Given** `useAnalyticsStore.isLoading` is true (data being aggregated)
**When** the stats cards section renders
**Then** 4 skeleton cards are shown in the responsive grid (matching card dimensions)
**And** each skeleton shows: a circular icon placeholder (32×32), a tall text placeholder for the value, a short text placeholder for the label, and a rectangular placeholder for the sparkline area
**And** skeletons use `bg-muted animate-pulse` (UX spec line 1804: "Skeleton loaders for predictable content, 500ms delay before showing")
**And** the skeleton appears only after a 500ms delay to avoid flicker on fast loads

**Empty State:**

**Given** no study sessions exist (fresh user)
**When** the Overview page renders
**Then** all stats cards show zero values: "0h", "0m", "0", "0"
**And** sparklines show flat bars at minimum height (all 2px)
**And** no trend arrows are shown (insufficient data)

**Error State:**

**Given** IndexedDB queries fail during aggregation
**When** the stats cards attempt to render
**Then** each card shows "—" as the value with `text-muted-foreground`
**And** a subtle "Retry" link appears below the cards
**And** a console error is logged with the failure details

**Accessibility:**

**Given** a stats card renders
**When** a screen reader encounters it
**Then** the card has `role="status"` and `aria-label` describing the full metric (e.g., "Total study hours: 42.5 hours, up 12 percent from last week")
**And** sparkline bars have `aria-hidden="true"` (decorative — the numeric value carries the information)
**And** trend arrows have `sr-only` text: "increasing by X percent" or "decreasing by X percent"

**Given** the sparkline tooltip is active
**When** a keyboard user focuses a card
**Then** the tooltip is NOT keyboard-interactive (sparkline is decorative) — the card-level `aria-label` provides the summary

**Technical Requirements:**

- Create `src/stores/analyticsStore.ts` implementing `useAnalyticsStore` (Zustand v5). Holds aggregated analytics state and exposes the interface described above. Subscribes to `useStudySessionStore` for invalidation.
- Create `src/app/components/StatsCard.tsx` — generic metric card component. Props: `icon: LucideIcon`, `iconClassName: string`, `label: string`, `value: string`, `sparkline?: number[]`, `trend?: { direction: 'up' | 'down' | 'stable', percentage: number }`.
- Sparkline is rendered as inline SVG within StatsCard — no external charting library needed for this simple visualization. Total SVG width = `7 × 6 + 6 × 4 = 66px`, height = 32px.
- Aggregation queries use Dexie indexed queries: `db.studySessions.where('startTime').above(startDate).toArray()` for weekly/daily breakdowns. Group by date in JavaScript after fetch. See epic-level **Query Performance Strategy** for indexing and caching approach to meet the <100ms Architecture target.
- Integrate into `src/app/pages/Overview.tsx` — placed between "Continue Learning" (Story 5.3) and the existing streak/achievement section.
- The "Courses Active" card reads from `useMomentumStore` (Story 5.1), not from a separate query — it simply counts hot + warm courses from the already-loaded momentum data.

**FRs Fulfilled:** FR40 _(analytics view of session data — tracking infrastructure is Epic 4 Story 4.1)_, FR41

---

### Story 5.5: Activity Timeline & Study Pattern Analytics

As a learner,
I want to see my recent learning activity as a timeline and understand when I study most effectively during the day,
So that I can stay aware of my progress and optimize my study schedule.

**Acceptance Criteria:**

**Recent Activity Timeline (Overview Page):**

**Given** I navigate to the Overview page
**When** the page renders and learning activity data exists
**Then** a "Recent Activity" section displays the last 7 days of learning events as a vertical timeline
**And** each event shows:

- An icon indicating event type: `CheckCircle2` for lesson completed (green-600), `BookOpen` for note created/edited (blue-600), `Play` for video session started (purple-600), `Award` for milestone achieved (orange-600)
- Course name in `font-medium` and lesson/video title in `text-muted-foreground`
- Relative timestamp (e.g., "2 hours ago", "Yesterday at 3:15 PM", "Mon at 10:30 AM")
- A vertical timeline connector line (2px `bg-border`) linking events chronologically

**And** events are sorted by timestamp descending (most recent first)
**And** a maximum of 5 events are shown initially

**Given** the timeline has more than 5 events available
**When** I click "View all activity"
**Then** I am navigated to the Reports page (`/reports`) which shows the full activity log in the RecentActivity section (Reports page renders the same RecentActivity component but without the 5-event limit)

**Loading State (Timeline):**

**Given** `useAnalyticsStore.isLoadingActivity` is true
**When** the Recent Activity section renders on Overview
**Then** 3 skeleton timeline items are shown: each with a circular icon placeholder (20×20), two text line placeholders, and a short timestamp placeholder
**And** skeletons use `bg-muted animate-pulse` (UX spec line 1804: 500ms delay before showing)
**And** the vertical connector line renders in `bg-muted` (not `bg-border`) during loading

**Loading State (Study Patterns):**

**Given** `useAnalyticsStore.isLoadingPatterns` is true
**When** the Study Patterns section renders on Reports
**Then** 4 skeleton horizontal bars are shown matching the chart layout
**And** skeletons use `bg-muted animate-pulse` with 500ms delay

**Given** no learning activity exists in the last 7 days
**When** the Overview page renders
**Then** the timeline shows an empty state: "No recent activity" with subtext "Start a study session to see your progress here" and a CTA button "Browse Courses" linking to the Courses page

**Event Type Detection:**

**Given** the timeline needs to identify event types from raw data
**When** events are compiled
**Then** the following detection logic applies:

- **Lesson completed**: `progress` record where `completionPercentage` crossed ≥ 95% — detected by comparing `completionPercentage` against a threshold, using the `progress.updatedAt` timestamp
- **Note activity**: `notes` record with `updatedAt` within the last 7 days — shows as "edited" if the note existed before, "created" if `createdAt` equals `updatedAt`
- **Video session**: `studySessions` record with `startTime` within the last 7 days — shows course name and video title
- **Milestone achieved**: detected by subscribing to `useStreakStore` milestone events (Epic 4 Story 4.5). When a milestone fires during the current session, it is written to `useAnalyticsStore.recentActivity` with a timestamp. Historical milestones (from before this feature existed) are NOT retroactively detected — only milestones earned after Epic 5 deployment appear in the timeline

**And** if the same video has multiple sessions on the same day, they are collapsed into one event showing total time: "Studied React Hooks for 45 min"

**Time-of-Day Study Patterns (Reports Page):**

**Given** I navigate to the Reports page
**When** the "Study Patterns" section renders and at least 7 days of session data exist
**Then** a horizontal bar chart displays 4 time blocks:

- **Morning** (6:00-11:59): bar length proportional to total minutes, label showing session count
- **Afternoon** (12:00-17:59): same format
- **Evening** (18:00-22:59): same format
- **Night** (23:00-5:59): same format

**And** bar colors: Morning = `amber-400`, Afternoon = `blue-400`, Evening = `indigo-400`, Night = `slate-500`
**And** the time block with the most total minutes is highlighted with a `Star` icon and label "Peak study time"
**And** each bar shows the session count and total time (e.g., "12 sessions — 4.5h")

**Given** fewer than 7 days of session data exist
**When** the study patterns section renders
**Then** it shows: "Study for 7 days to see your patterns" with a progress indicator showing X/7 days completed (using a segmented progress bar with filled/empty segments)

**Pattern Calculation:**

**Given** session data exists in `studySessions`
**When** time-of-day analysis runs
**Then** each session is classified by its `startTime` hour into one of the 4 time blocks
**And** the analysis uses the last 30 days of data (reflects current habits, not all-time history)
**And** sessions spanning two time blocks (e.g., starts at 11:45 AM, ends at 12:15 PM) are split proportionally: minutes before the boundary count toward the earlier block, minutes after count toward the later block

**Given** a session spans midnight (e.g., 11:30 PM to 12:30 AM)
**When** it is classified
**Then** the minutes are split proportionally at each time-block boundary, same as any other boundary crossing. Specifically: minutes from 23:00-23:59 count toward "Night (23:00-5:59)" and minutes from 00:00-05:59 also count toward "Night (23:00-5:59)" — the Night block wraps around midnight, so both sides of midnight fall in the same block. The only special case is a session spanning from Evening (before 23:00) into Night: those minutes before 23:00 count toward Evening, and minutes from 23:00 onward count toward Night.

**Accessibility:**

**Given** the activity timeline renders on the Overview page
**When** a screen reader encounters it
**Then** the timeline is wrapped in `<ol aria-label="Recent learning activity">` with each event as an `<li>`
**And** event icons have `aria-hidden="true"` — descriptive text in the list item carries the meaning (e.g., "Completed lesson: useEffect Basics in React Hooks, 2 hours ago")
**And** the timeline connector line is `aria-hidden="true"` (decorative)

**Given** the study patterns chart renders on the Reports page
**When** a screen reader encounters it
**Then** the chart is wrapped in `<figure>` with `<figcaption>Study pattern: when you study most</figcaption>`
**And** a visually hidden `<table>` provides the exact numbers for each time block (WCAG 1.1.1 non-text content)
**And** the "Peak study time" label is announced as part of the relevant row

**Responsive:**

**Given** the viewport is < 640px (mobile)
**When** the activity timeline renders
**Then** the vertical connector line is hidden and events display as compact cards with date group headers ("Today", "Yesterday", "Mon Feb 10")
**And** event icons are 16×16 (reduced from 20×20 on desktop)

**Given** the viewport is < 640px (mobile)
**When** the study patterns chart renders
**Then** bars remain full-width horizontal (the chart works well on mobile as-is)
**And** the session count label appears below the bar instead of inline to avoid truncation

**Technical Requirements:**

- Create `src/app/components/RecentActivity.tsx` — timeline component for Overview page. Reads from `useAnalyticsStore.recentActivity` (not direct DB queries — **components NEVER import `db` directly**, Architecture line 1909). Uses `Intl.RelativeTimeFormat` for relative timestamps (no external dependency needed — `date-fns` is available if more complex formatting is required).
- Create `src/app/components/StudyPatterns.tsx` — time-of-day bar chart for Reports page. Reads from `useAnalyticsStore.studyPatterns`. Uses Recharts `BarChart` (horizontal layout via `layout="vertical"`) for consistency with Story 5.6's ProgressChart.
- Integrate RecentActivity into `src/app/pages/Overview.tsx` — placed below the stats cards (Story 5.4) and above or alongside the streak calendar (Epic 4).
- Integrate StudyPatterns into `src/app/pages/Reports.tsx`.
- **Extend `useAnalyticsStore`** (from Story 5.4) with: `recentActivity: ActivityEvent[]`, `studyPatterns: TimeBlock[]`, `fetchRecentActivity(days: number): Promise<void>`, `fetchStudyPatterns(): Promise<void>`, `isLoadingActivity: boolean`, `isLoadingPatterns: boolean`. The store encapsulates all DB queries internally via `src/analytics/activity.ts`.
- Create `src/analytics/activity.ts` — shared utility with `getRecentActivity(days: number): Promise<ActivityEvent[]>` that queries `studySessions`, `progress`, and `notes` tables and merges into a unified event list sorted by timestamp descending. This is called by the store, never by components directly. See epic-level **Query Performance Strategy** for indexing approach.
- Same-day session collapsing: group sessions by `courseId + lessonId + date`, sum durations, display as single event.

**ActivityEvent Type Definition:**

```typescript
interface ActivityEvent {
  id: string;                // unique: `${type}-${sourceId}-${date}`
  type: 'lesson_completed' | 'note_activity' | 'video_session' | 'milestone';
  courseId: number;
  courseName: string;        // denormalized for display
  title: string;             // lesson/note/video title or milestone name
  timestamp: string;         // ISO 8601
  metadata: {
    duration?: number;       // minutes (for video_session, after same-day collapsing)
    noteAction?: 'created' | 'edited'; // for note_activity
    milestoneDay?: number;   // for milestone (e.g., 7, 30, 100)
  };
}
```

**StudyPatterns UX Note:** The StudyPatterns component (time-of-day bar chart) has no corresponding specification in the UX design document. The design in this story is derived from the PRD's FR43 ("study time analytics by period") and common analytics dashboard patterns. The dev agent should follow the visual style of other Recharts components in the project (Story 5.6's ProgressChart) for consistency.

**FRs Fulfilled:** FR42 _(partial — PRD FR42 is "adaptive study scheduling suggestions." This story fulfills the informational component: showing WHEN the user studies most. The recommendation/scheduling component is DEFERRED to a future epic. See epic-level FR Numbering Governance.)_, FR43

---

### Story 5.6: Course Insights & Completion Analytics

As a learner,
I want to see completion rates by course, know which courses I study most and least, and understand how much time remains in each course,
So that I can make informed decisions about what to prioritize and plan my study schedule.

**Acceptance Criteria:**

**Course Completion List (Reports Page):**

**Given** I navigate to the Reports page
**When** the "Course Completion" section renders and courses exist
**Then** a list of all courses is displayed, each showing:

- Course name (`font-medium`)
- Completion percentage as text (e.g., "72%") and a horizontal progress bar
- Lesson count (e.g., "18/25 lessons") in `text-sm text-muted-foreground`
- Estimated time remaining (see below)

**And** courses are sorted by completion percentage descending (most complete first)
**And** the progress bar uses a gradient: `from-blue-500 to-purple-500`

**Given** a course has 0% completion (never started)
**When** it appears in the list
**Then** the progress bar is empty (0 width)
**And** the text reads "Not started" in `text-muted-foreground` instead of "0%"

**Given** a course has 100% completion (all videos ≥ 95%)
**When** it appears in the list
**Then** the progress bar is full with a `CheckCircle2` icon (green-600) replacing the percentage
**And** the text reads "Complete" in `text-green-600`

**Study Distribution Cards (Reports Page):**

**Given** I navigate to the Reports page
**When** the "Study Distribution" section renders and at least 2 courses have been studied
**Then** two highlighted cards appear side-by-side (stacked on mobile):

1. **Most Studied** — `Flame` icon in `text-orange-500`
   - Shows: course name, total hours studied (from `studySessions` aggregation), last studied date
   - Card background: `bg-orange-50 dark:bg-orange-900/10` with `border-orange-200 dark:border-orange-800`

2. **Least Studied** — `Snowflake` icon in `text-blue-400`
   - Shows: course name, total hours studied, last studied date
   - Includes a nudge message: "This course needs attention" in `text-blue-600 dark:text-blue-400`
   - Card background: `bg-blue-50 dark:bg-blue-900/10` with `border-blue-200 dark:border-blue-800`
   - **Selection criteria**: course with the lowest total study time that has > 0 sessions AND < 100% completion (excludes never-started and fully-complete courses)

**Given** only one course has been studied
**When** the section renders
**Then** only the "Most Studied" card is shown (no "Least Studied" — there's nothing meaningful to compare)

**Given** no courses have been studied at all
**When** the section renders
**Then** both cards show an empty state: "Start studying to see your stats" with a CTA linking to Courses

**Estimated Time to Complete:**

**Given** a course has partial completion (1-99%)
**When** I view it in the Course Completion list
**Then** an estimated time to complete is shown: "~Xh remaining" or "~Xm remaining"
**And** the calculation is: `(totalVideoDuration - watchedDuration) / playbackSpeed`
**And** `playbackSpeed` defaults to 1.0x (playback speed tracking is not yet implemented — see Technical Requirements)
**And** `totalVideoDuration` is the sum of all `videos.duration` for the course
**And** `watchedDuration` is calculated as: for each video in the course, if `progress.completionPercentage >= 95` then add the video's full `videos.duration`; otherwise add `progress.currentTime` (the furthest point reached). `watchedDuration` is NOT a stored field — it is computed on-the-fly by the store from `progress` and `videos` table data. Formula: `SUM(video.completionPercentage >= 95 ? video.duration : progress.currentTime)`

**Given** a course has 0% completion (never started)
**When** estimated time is calculated
**Then** it shows the full course duration: "~Xh total"

**Given** a course has 100% completion
**When** estimated time is calculated
**Then** it shows "Complete" with no time estimate (the `CheckCircle2` icon conveys this)

**Given** total remaining duration is < 60 minutes
**When** the estimate renders
**Then** it shows minutes: "~Xm remaining" (not fractional hours)

**Given** total remaining duration is ≥ 60 minutes
**When** the estimate renders
**Then** it shows hours rounded to 1 decimal: "~X.Xh remaining"

**14-Day Progress Chart (Reports Page):**

**Given** I navigate to the Reports page
**When** the "Progress" chart section renders
**Then** a ProgressChart component displays a stacked bar chart for the last 14 days:

- X-axis: dates (abbreviated day names: "Mon", "Tue", etc., with date on second line for Mondays: "Mon 2/10")
- Y-axis: count of activities
- 3 stacked series:
  - Lessons completed (`blue-600`): count of `progress` records where `completionPercentage` crossed the ≥ 95% threshold on that date (detected by `progress.updatedAt` falling on that day AND `completionPercentage >= 95`). A video counts at most once even if the user re-watched it.
  - Notes created/edited (`green-600`): count of `notes` records with `updatedAt` on that date (deduplicated by `notes.id` — editing the same note multiple times on one day counts as 1)
  - Videos watched (`purple-600`): count of distinct `(courseId, videoId)` pairs from `studySessions` with `startTime` on that date (multiple sessions of the same video on the same day count as 1)

**And** hovering a bar shows a tooltip with the exact breakdown for that day
**And** chart height: 300px on desktop, 200px on mobile

**Given** a day has no activity
**When** the chart renders
**Then** that day's bar is empty (zero height) but the date label still shows on the x-axis

**Given** no data exists for the 14-day period
**When** the chart renders
**Then** a flat empty chart shows with all bars at zero and an overlay message: "No activity in the last 14 days"

**Loading States:**

**Given** `useAnalyticsStore.isLoadingCourseInsights` is true
**When** the Reports page renders
**Then** skeleton loaders replace each section:
- Course Completion list: 3 skeleton rows, each with a progress bar placeholder and two text line placeholders
- Study Distribution: 2 skeleton cards side-by-side (stacked on mobile) matching card dimensions
- ProgressChart: a rectangular skeleton matching the chart area (300px desktop / 200px mobile)
**And** all skeletons use `bg-muted animate-pulse` (UX spec line 1804: 500ms delay before showing)

**Chart Legend:**

**Given** the ProgressChart renders
**When** the legend is visible
**Then** it shows 3 items below the chart: a colored square + label for each series ("Lessons", "Notes", "Videos")
**And** clicking a legend item toggles that series on/off (Recharts built-in behavior)

**Accessibility:**

**Given** the Course Completion list renders
**When** a screen reader encounters it
**Then** each course row is an `<li>` within a `<ul aria-label="Course completion status">`
**And** each item has `aria-label` with full context (e.g., "React Fundamentals: 72 percent complete, 18 of 25 lessons, approximately 3 hours remaining")
**And** the progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`

**Given** the ProgressChart renders
**When** a screen reader encounters it
**Then** it is wrapped in `<figure>` with `<figcaption>14-day learning activity</figcaption>`
**And** a visually hidden `<table>` provides daily totals as a data table (WCAG 1.1.1)

**Given** the Study Distribution cards render
**When** a screen reader encounters them
**Then** each card has `role="status"` with descriptive `aria-label` (e.g., "Most studied course: React Fundamentals, 42.5 hours total, last studied today")

**Responsive:**

**Given** the viewport is < 640px (mobile)
**When** the Reports page renders
**Then** the Course Completion list shows as full-width cards stacked vertically with progress bar below the course name
**And** the Study Distribution cards stack vertically (Most Studied on top)
**And** the ProgressChart reduces to 200px height and shows 7 days by default with a toggle button: "Show 14 days" / "Show 7 days". Default on mobile is 7 days (to avoid horizontal crowding). The toggle is a `<button>` with `text-sm text-blue-600` styled as a text link below the chart. Toggle state is local to the component (not persisted).

**Given** the viewport is ≥ 1024px (desktop)
**When** the Reports page renders
**Then** the Study Distribution cards display side-by-side in a 2-column grid
**And** the ProgressChart shows all 14 days at 300px height

**Technical Requirements:**

- Create `src/app/components/CourseCompletionList.tsx` — list component reading from `useAnalyticsStore.courseCompletionData`. **Components NEVER import `db` directly** (Architecture line 1909) — all data access goes through Zustand stores.
- Create `src/app/components/StudyDistribution.tsx` — "Most Studied" / "Least Studied" card pair. Reads from `useAnalyticsStore.studyDistribution`.
- Create `src/app/components/charts/ProgressChart.tsx` — Recharts `BarChart` with `ResponsiveContainer` for fluid width. Uses 3 `<Bar>` components with `stackId="activity"` for stacking. Reads from `useAnalyticsStore.progressChartData`.
- **Extend `useAnalyticsStore`** with: `courseCompletionData: CourseCompletion[]`, `studyDistribution: { mostStudied: CourseStudyStats | null, leastStudied: CourseStudyStats | null }`, `progressChartData: DailyActivity[]`, `fetchCourseInsights(): Promise<void>`. The store encapsulates all DB queries (courses, videos, progress, studySessions, notes) internally.
- Integrate all three components into `src/app/pages/Reports.tsx`. Layout order: Study Distribution cards → Course Completion list → Progress Chart → Study Patterns (Story 5.5).
- **Estimated time calculation**: `playbackSpeed` defaults to 1.0x. Playback speed is not currently tracked per session — this is a known limitation. Future enhancement: add `playbackRate` to `studySessions` records and use the user's average rate. For now, the estimate assumes 1.0x speed.
- Completion percentage per course: uses the epic-level canonical definition (count videos where `progress.completionPercentage >= 95` ÷ total `videos` count × 100). See **Canonical Completion Percentage Definition** in the epic header.
- ProgressChart daily data (calculated inside the store): aggregate by date string (YYYY-MM-DD). Lessons = count of `progress` records crossing 95% threshold on that date. Notes = count of `notes` records with `updatedAt` on that date. Videos = count of distinct `studySessions` records with unique `courseId + lessonId` on that date.
- IndexedDB failure handling: If store queries fail, show "Unable to load analytics — check your browser storage" with a "Retry" button that calls `useAnalyticsStore.fetchCourseInsights()`.

**FRs Fulfilled:** FR44, FR46 _(partial — PRD FR46 is "retention: compare completed vs abandoned courses." The Course Completion list shows per-course completion status and the Study Distribution cards highlight Most/Least Studied, which surfaces abandonment risk implicitly. However, there is no explicit "abandoned course" detection or side-by-side completed-vs-abandoned comparison. Full retention analysis is DEFERRED — it requires defining an "abandoned" threshold, e.g., cold momentum + <20% completion + no sessions in 30 days, which is better addressed after real usage data exists.)_, FR47 _(partial — this story provides completion insights and study distribution analytics. The "recommendations" aspect of FR47 is deferred to Epic 6's AI-powered recommendation engine.)_

---

## Epic 6: AI-Powered Learning Assistant

Enhance learning with AI-powered features including study plans, content summaries, Q&A, course recommendations, quiz generation, note enhancement, concept connections, and contextual coaching suggestions. All AI features are optional and degrade gracefully when no API key is configured.

**Prerequisites:** Epic 1 complete (course data, video playback, progress tracking), Epic 3 complete (notes system), Epic 4 complete (streaks and study sessions).

**Codebase Reality Note:** The Architecture document describes Dexie.js, Zustand, MiniSearch, and IndexedDB — but **none of these exist in the actual codebase**. The app uses `localStorage` via `src/lib/*.ts` modules (settings.ts, progress.ts, studyLog.ts, studyStreak.ts, bookmarks.ts). All stories in this epic MUST follow the existing localStorage-based data access pattern, NOT the aspirational Architecture patterns.

**Canonical Data Access Pattern:**
- Settings: `getSettings()` / `saveSettings()` from `src/lib/settings.ts` (localStorage key: `app-settings`)
- Progress: `getAllProgress()` / `getProgress(courseId)` from `src/lib/progress.ts` (localStorage key: `course-progress`)
- Study log: `getStudyLog()` / `logStudyAction()` from `src/lib/studyLog.ts` (localStorage key: `study-log`)
- Course data: Static imports from `src/data/courses/` with types from `src/data/types.ts` (`Course > Module > Lesson > Resource`)
- Transcripts: VTT caption files accessed via `Resource.metadata.captions[].src` (type `CaptionTrack` from `src/data/types.ts`). **No plain-text transcript field exists.** A VTT-to-text parser (`src/ai/transcript.ts`) must be created in Story 6.1.
- Streaks: Use `getCurrentStreak()` and `getLongestStreak()` from `src/lib/studyLog.ts` (canonical). **Do NOT use** `getStudyStreak()` from `src/lib/studyStreak.ts` — it is a legacy duplicate with a different return shape.

**AI Provider Architecture:**
- Vercel AI SDK v2.0.31 with `@ai-sdk/openai` and `@ai-sdk/anthropic`
- API proxy via Vite dev server middleware plugin (follows existing `serveLocalMedia` pattern in `vite.config.ts`)
- Client never calls AI providers directly — all requests go through `/api/ai/*` proxy endpoints
- API keys stored in localStorage via extended `AppSettings` (acceptable for personal app; NFR69 about memory-only storage is relaxed for this use case)

**Epic 6 FR Numbering Governance:**

| Epic FR# | PRD FR# | Status | Notes |
|----------|---------|--------|-------|
| FR52 | — | New | Not in PRD. Created during epic decomposition for quiz generation from video content. |
| FR53 | — | New | Not in PRD. Created during epic decomposition for study tips and learning strategies. |
| FR69 | — | New | From PRD line 189: AI-assisted note enhancement (organize, restructure, suggest tags). |
| FR70 | — | New | From PRD line 189: Suggest concept connections across different courses. |
| FR72 | — | New | From UX spec: Contextual AI coaching suggestions (simplified from full adaptive system to rule-based core with optional AI enhancement). |
| FR73 | — | New | From UX spec: Enhanced search (simplified from ML-ranked search to adding notes/content to command palette results). |
| FR74 | — | New | From UX spec: Dashboard customization (simplified from A/B-tested adaptive layouts to show/hide toggles in Settings). |

---

### Story 6.1: AI Client Infrastructure, Transcript Loader & Shared Components

As a developer,
I want a working AI client, VTT transcript parser, and shared loading/error components,
So that all subsequent AI feature stories have a solid foundation to build on.

**Acceptance Criteria:**

**AI Client Module:**

**Given** AI features are enabled and an API key is configured
**When** any AI feature makes a request
**Then** the request is sent through a Vite dev server middleware proxy at `/api/ai/chat`
**And** the proxy forwards the request to the selected provider's API with the stored API key
**And** the client never exposes the API key in browser network requests to external domains

**Given** an AI request is in progress
**When** the user clicks a cancel/stop button on any AI component
**Then** the request is aborted via `AbortController`
**And** any partial streamed content remains visible
**And** a "Retry" button appears

**Given** an AI request fails with a transient error (429, timeout, network error)
**When** the retry strategy activates
**Then** the request retries up to 3 times with exponential backoff (1s, 2s, 4s delays)
**And** after all retries fail, an error message appears: "AI is temporarily unavailable. Please try again later."

**Given** an AI request fails with an auth error (401, 403)
**When** the error is caught
**Then** no retry is attempted
**And** the error message reads: "Invalid API key. Please update your key in Settings."
**And** a link to the Settings page is provided

**Response Caching:**

**Given** the user makes an AI request (e.g., summarize a video)
**When** the response is received
**Then** the response is cached in localStorage with a key pattern `ai-cache:{feature}:{contentHash}`
**And** each cache entry includes a TTL (24 hours for study plans, 7 days for summaries/Q&A)

**Given** the user requests the same AI operation on unchanged content
**When** a valid cache entry exists (not expired, content hash matches)
**Then** the cached response is returned immediately without an API call
**And** a subtle "(cached)" indicator appears next to the response

**Given** the source data changes (e.g., new notes added, progress updated)
**When** the content hash no longer matches the cached entry
**Then** the stale cache entry is invalidated
**And** a new API call is made

**Token Usage Tracking:**

**Given** any AI request completes (success or partial)
**When** token usage information is available in the response
**Then** the total token count in localStorage is incremented
**And** the Settings page "Token Usage" display updates on next render

**Streaming:**

**Given** an AI request is made with streaming enabled
**When** response chunks arrive
**Then** each chunk is appended to the display in real-time (character by character appearance)
**And** a pulsing "..." indicator shows while streaming is in progress

**Given** a streaming response is interrupted (network drop, timeout)
**When** the stream terminates unexpectedly
**Then** any content received so far remains visible
**And** a "Response was interrupted. Retry?" button appears below the partial content

**VTT Transcript Loader:**

**Given** a lesson has video resources with caption tracks (`Resource.metadata.captions[]`)
**When** `loadTranscript(captionTracks)` is called
**Then** the function fetches the VTT file(s) via the `/media/` dev server path
**And** parses the WebVTT format to extract plain text (strips timing cues, formatting tags, and duplicate lines)
**And** returns a single concatenated string of transcript text
**And** caches the parsed result in memory (Map) to avoid re-fetching during the same session

**Given** a lesson has no caption tracks (empty or undefined `Resource.metadata.captions`)
**When** `loadTranscript()` is called
**Then** the function returns an empty string
**And** calling code can check `transcript.length === 0` to show "no transcript" UI

**Given** a VTT file fetch fails (404, network error)
**When** the error is caught
**Then** the function returns an empty string for that track
**And** logs a console warning (does not throw)

**Shared AI Loading & Error Components:**

**Given** any AI component is in a loading state
**When** the loading UI renders
**Then** the shared `AILoading` component renders a skeleton loader matching the expected content shape
**And** skeleton loaders use the standard Tailwind `animate-pulse` class with gray-200 background
**And** the component accepts a `variant` prop: `'card'`, `'inline'`, `'chat-bubble'` for different shapes

**Given** any AI component encounters an error
**When** the error UI renders
**Then** the shared `AIError` component renders a red-50 background card with error icon, message text, and "Retry" button
**And** error messages are user-friendly (no raw error codes or stack traces)
**And** all errors offer either "Retry" or "Go to Settings" as actionable next steps
**And** the component accepts `onRetry` callback and optional `showSettingsLink` prop

**Technical Requirements:**

- Create `src/ai/client.ts` — Core AI client using Vercel AI SDK's `generateText` and `streamText` functions. Exports `aiChat(messages, options)` and `aiStream(messages, options)` functions. Handles provider switching via `@ai-sdk/openai` `createOpenAI()` and `@ai-sdk/anthropic` `createAnthropic()`. Includes `AbortController` integration for cancellation.
- Create `src/ai/config.ts` — AI configuration types and defaults. Exports `AIConfig` interface, `getAIConfig()` and `isAIEnabled()` helper functions that read from `AppSettings`.
- Create `src/ai/transcript.ts` — VTT transcript parser. Exports `loadTranscript(captionTracks: CaptionTrack[]): Promise<string>` that fetches VTT files from `/media/` path, parses WebVTT format to plain text (strips `WEBVTT` header, timing lines `00:00:00.000 --> 00:00:05.000`, `<v>` tags, alignment cues), deduplicates repeated lines, and returns concatenated text. Uses an in-memory `Map<string, string>` cache keyed by VTT file path. Also exports `estimateTokens(text: string): number` (chars / 4 approximation).
- Create `src/ai/cache.ts` — Response caching with TTL. Exports `getCachedResponse(key)`, `setCachedResponse(key, data, ttlMs)`, `invalidateCache(pattern)`, `clearAllAICache()`. Uses localStorage with key prefix `ai-cache:`. Includes content hashing via simple string hash function.
- Create `src/ai/errors.ts` — Error handling and retry logic. Exports `withRetry(fn, options)` wrapper implementing exponential backoff. Classifies errors as retryable (429, timeout, network) vs non-retryable (401, 403, 400).
- Create `src/ai/tokens.ts` — Token usage tracking. Exports `trackTokenUsage(count)`, `getTotalTokens()`, `resetTokenUsage()`. Stores running total in localStorage key `ai-token-usage`.
- Create `src/ai/types.ts` — Shared TypeScript types: `AIProvider`, `AIModel`, `AIRequestOptions`, `AIResponse`, `AIStreamCallbacks`.
- Create `src/app/components/ai/AILoading.tsx` — Shared loading component with `variant` prop (`'card'` | `'inline'` | `'chat-bubble'`). Uses `animate-pulse` skeletons matching each variant's expected content shape.
- Create `src/app/components/ai/AIError.tsx` — Shared error component with `message`, `onRetry`, and optional `showSettingsLink` props. Renders red-50 card with AlertCircle icon, user-friendly message, and action buttons.
- Extend `AppSettings` interface in `src/lib/settings.ts` with: `aiEnabled: boolean` (default: `false`), `aiProvider: 'openai' | 'anthropic'` (default: `'openai'`), `aiApiKey: string` (default: `''`), `aiModel: string` (default: `'gpt-4o-mini'`).
- Install `ai@^2.0.31`, `@ai-sdk/openai@latest`, `@ai-sdk/anthropic@latest` as dependencies in `package.json`.

**FRs Fulfilled:** FR66 (multi-provider support via Vercel AI SDK), FR67 (32K context limit — infrastructure for chunking + `estimateTokens` utility), FR68 (streaming with cancellation)

**NFRs Addressed:** NFR30 (OpenAI support), NFR31 (Anthropic support), NFR32 (rate limit handling via retry), NFR33 (30s timeout), NFR34 (response caching), NFR35 (graceful fallback when disabled), NFR53 (data remains local), NFR63 (Vercel AI SDK), NFR64 (streaming with abort controller), NFR71 (retry with exponential backoff), NFR74 (caching with TTL), NFR75 (token usage tracking), NFR76 (AI feature toggle)

---

### Story 6.2: AI Settings UI & Provider Proxy

As a learner,
I want to configure AI provider settings (API key, provider choice, enable/disable) in the Settings page,
So that I can activate AI features with my preferred provider.

**Acceptance Criteria:**

**AI Settings UI:**

**Given** the user navigates to the Settings page
**When** the page renders
**Then** a new "AI Features" card section appears below the existing settings cards
**And** it contains: (1) an "Enable AI Features" toggle switch (default: off), (2) a "Provider" select dropdown with options "OpenAI" and "Anthropic", (3) an "API Key" password input with show/hide toggle, (4) a "Model" select dropdown (OpenAI: "gpt-4o-mini", "gpt-4o"; Anthropic: "claude-sonnet-4-5-20250929", "claude-haiku-4-5-20251001"), (5) a "Test Connection" button, (6) a "Token Usage" read-only display showing total tokens consumed (initially "0 tokens")

**Given** the AI Features toggle is off
**When** the user views any page with AI features
**Then** no AI-related UI elements appear (buttons, panels, suggestions)
**And** the app functions identically to its pre-AI state

**Given** the user enters an API key and clicks "Test Connection"
**When** the connection succeeds
**Then** a green success toast appears: "Connected to [Provider] successfully"
**And** the "Test Connection" button shows a checkmark for 2 seconds

**Given** the user enters an invalid API key and clicks "Test Connection"
**When** the connection fails with a 401/403 error
**Then** a red error toast appears: "Invalid API key. Please check your [Provider] API key."
**And** the API key input shows a red border

**Settings Persistence:**

**Given** the user configures AI settings (provider, key, model, enabled state)
**When** the user clicks "Save Settings"
**Then** all AI settings persist to localStorage via the extended `AppSettings` interface
**And** refreshing the page restores the saved AI configuration

**Given** the user changes the provider (e.g., OpenAI → Anthropic)
**When** the provider changes
**Then** the model dropdown updates to show the new provider's models
**And** the API key field clears (different providers use different keys)

**Vite Dev Server AI Proxy:**

**Given** the development server is running
**When** an AI feature sends a POST request to `/api/ai/chat`
**Then** the Vite middleware proxy intercepts the request
**And** reads the provider and API key from the request body
**And** forwards the request to the selected provider's API endpoint
**And** streams the response back to the client
**And** the browser's network tab shows requests to `localhost`, not to external AI provider domains

**Given** the proxy receives a non-POST request or an unknown path
**When** the request is not for `/api/ai/*`
**Then** the proxy passes through to the next middleware (no interference with other dev server features)

**Clear AI Data:**

**Given** the user views the AI Features section in Settings
**When** they see a "Clear AI Data" button (red outline, Trash2 icon)
**Then** clicking it opens a confirmation dialog: "This will clear all cached AI responses and reset token usage. Your notes and progress are not affected."
**And** confirming clears all `ai-cache:*` and `ai-token-usage` keys from localStorage via `clearAllAICache()` and `resetTokenUsage()` from Story 6.1 modules
**And** a success toast appears: "AI data cleared"

**Technical Requirements:**

- Add Vite dev server middleware plugin `aiProxy()` in `vite.config.ts` following the `serveLocalMedia()` pattern. The proxy handles `POST /api/ai/chat` requests, reads the API key from the request body, forwards to the selected provider's API, and streams the response back. This ensures the API key is never exposed in client-side network requests to external domains during development.
- Add AI Settings section to `src/app/pages/Settings.tsx` — new Card component below existing settings with all controls described in the ACs: enable toggle, provider select, API key input (password with show/hide), model select, test connection button, token usage display, and "Clear AI Data" button.
- Update `.env.example` with `VITE_AI_PROVIDER=openai` and `VITE_AI_MODEL=gpt-4o-mini` (API key NOT in env — stored in localStorage).

**FRs Fulfilled:** FR66 (multi-provider UI — settings configuration surface for Story 6.1's client infrastructure)

**NFRs Addressed:** NFR73 (clear cached AI data via Settings), NFR76 (AI feature toggle UI)

---

### Story 6.3: Video Content Summarization

As a learner,
I want to get AI-generated summaries of video content from transcripts,
So that I can quickly understand key concepts without watching the entire video.

**Acceptance Criteria:**

**Summary Tab UI:**

**Given** the user is on the LessonPlayer page viewing a video lesson
**And** AI features are enabled with a valid API key
**When** the page renders
**Then** a "Summary" tab appears alongside existing lesson tabs (Notes, Resources, etc.)
**And** the tab shows a sparkle icon (✨) to indicate AI-powered content

**Given** the user clicks the "Summary" tab
**When** no cached summary exists for this lesson
**Then** a "Generate Summary" button appears with the text "Summarize this lesson's content"
**And** below the button, a note reads: "Uses ~[estimated tokens] tokens"

**Given** the user clicks "Generate Summary"
**When** the AI request begins
**Then** the button is replaced by a loading skeleton with pulsing animation
**And** the response streams in real-time as markdown-formatted text
**And** a "Stop" button appears to cancel the generation

**Given** the summary generation completes
**When** the full response is received
**Then** the summary displays as formatted markdown with sections: "Key Concepts", "Main Points", "Takeaways"
**And** a "Copy to Notes" button appears at the bottom
**And** a "Regenerate" button (refresh icon) appears in the top-right corner
**And** the response is cached for 7 days (invalidated if transcript changes)

**Given** the user clicks "Copy to Notes"
**When** the action completes
**Then** the summary content is added as a new note for this lesson via `addNote()` from `src/lib/progress.ts`
**And** a success toast appears: "Summary copied to notes"
**And** the tag `#ai-summary` is automatically added to the note

**Transcript Chunking:**

**Given** a video has a transcript longer than 32K tokens (~128K characters)
**When** the user requests a summary
**Then** the transcript is split into chunks of ~24K tokens with 500-token overlap
**And** each chunk is summarized independently
**And** a final consolidation pass merges chunk summaries into a cohesive summary
**And** the user sees a progress indicator: "Summarizing part 1 of 3..."

**Given** a video has no transcript (lesson has no `Resource.metadata.captions` or `loadTranscript()` returns empty string)
**When** the user clicks the "Summary" tab
**Then** the tab shows: "No transcript available for this lesson. Summaries require video transcripts."
**And** the "Generate Summary" button is disabled

**Error Handling:**

**Given** the summary generation fails after all retries
**When** the error is displayed
**Then** the message reads: "Unable to generate summary. [Error details]"
**And** a "Retry" button appears
**And** any partial streamed content remains visible

**Given** the user clicks "Stop" during streaming
**When** the stream is aborted
**Then** the partial summary content remains visible
**And** a message appears: "Summary was stopped. Showing partial results."
**And** "Continue" and "Regenerate" buttons appear

**No AI Configured:**

**Given** AI features are disabled or no API key is set
**When** the user views the LessonPlayer page
**Then** the "Summary" tab does not appear
**And** no AI-related UI elements are visible

**Technical Requirements:**

- Create `src/ai/summaries.ts` — Summary generation logic. Exports `generateSummary(transcript, options)` that: (1) loads transcript via `loadTranscript(captionTracks)` from `src/ai/transcript.ts`, (2) chunks transcript if >32K tokens using `splitIntoChunks(text, maxTokens)`, (3) sends each chunk with the system prompt "Summarize this educational content. Focus on key concepts, main points, and actionable takeaways. Format as markdown with sections.", (4) consolidates multi-chunk results. Uses `aiStream()` from `src/ai/client.ts` for streaming. Uses `estimateTokens()` from `src/ai/transcript.ts` for token estimation.
- Create `src/app/components/ai/VideoSummary.tsx` — React component for the summary tab content. Manages states: idle → loading-transcript → generating → complete → error. Uses `useCallback` for generate/stop/retry actions. Renders markdown via `react-markdown` (already a project dependency via the notes editor). Uses `AILoading` and `AIError` from Story 6.1 shared components.
- Modify the LessonPlayer page to add the "Summary" tab conditionally (only when `isAIEnabled()` returns true). The tab integrates alongside existing tabs. Transcript is loaded from the lesson's video `Resource.metadata.captions` via `loadTranscript()`.
- Token estimation: Use `estimateTokens()` from `src/ai/transcript.ts` (chars / 4 approximation) for display. Actual token counting is handled by the AI SDK response.
- Cache key format: `ai-cache:summary:{lessonId}:{transcriptHash}` with 7-day TTL.

**FRs Fulfilled:** FR49 (summarize video content from captions/transcripts), FR67 (chunking for long videos — implemented here)

**NFRs Addressed:** NFR33 (30s timeout per chunk), NFR34 (7-day cache), NFR64 (streaming with abort), NFR77 (partial streaming display)

---

### Story 6.4: Course Content Q&A with RAG

As a learner,
I want to ask questions about course content and get AI-powered answers with context from my notes and transcripts,
So that I can deepen my understanding without leaving the learning environment.

**Acceptance Criteria:**

**Q&A Tab UI:**

**Given** the user is on the LessonPlayer page
**And** AI features are enabled with a valid API key
**When** the page renders
**Then** a "Q&A" tab appears alongside existing lesson tabs
**And** the tab shows a message bubble icon to indicate interactive chat

**Given** the user clicks the "Q&A" tab
**When** the tab opens
**Then** a chat interface appears with: (1) a scrollable message area (empty initially with placeholder text: "Ask a question about this lesson..."), (2) a text input at the bottom with placeholder "Type your question...", (3) a send button (arrow icon)

**Given** the user types a question and clicks send (or presses Enter)
**When** the question is submitted
**Then** the user's question appears as a right-aligned message bubble (blue-600 background, white text)
**And** an AI response streams below as a left-aligned message bubble (gray-100 background)
**And** the send button transforms to a "Stop" button during streaming
**And** the input is disabled during streaming

**RAG Context Assembly:**

**Given** the user asks a question
**When** the context is assembled for the AI prompt
**Then** the context includes (in priority order): (1) current lesson's transcript (highest priority), (2) user's notes for this lesson from `getNotes(courseId, lessonId)`, (3) user's notes for other lessons in the same course, (4) transcripts from adjacent lessons in the same module
**And** the total context is trimmed to fit within 32K tokens, prioritizing items in the order listed
**And** the system prompt instructs: "You are a learning assistant. Answer questions about the course content using the provided context. If the answer isn't in the context, say so honestly. Cite specific parts of the content when possible."

**Given** the assembled context exceeds 32K tokens
**When** trimming is applied
**Then** lower-priority content (adjacent lesson transcripts) is removed first
**And** within the same priority level, content is truncated from the end
**And** current lesson's transcript and notes are always included (even if truncated)

**Conversation History:**

**Given** the user has asked multiple questions in the Q&A tab
**When** a new question is submitted
**Then** the previous Q&A exchanges (up to the last 5 turns) are included in the conversation context
**And** this enables follow-up questions like "Can you explain that more simply?"
**And** conversation history is session-only (not persisted across page navigations)

**Given** the user navigates away from the lesson and returns
**When** the Q&A tab opens
**Then** the conversation history is empty (fresh start)
**And** the placeholder text appears again

**Response Quality:**

**Given** the AI responds to a question
**When** the response renders
**Then** it is formatted as markdown (code blocks, bold, lists supported)
**And** if the AI references specific content, it indicates the source (e.g., "Based on the transcript at around [timestamp]...")

**Given** the user asks a question that cannot be answered from the available context
**When** the AI responds
**Then** the response honestly states: "I don't have enough information in this lesson's content to answer that question. You might try..."
**And** the AI does NOT hallucinate or make up information

**Save Q&A:**

**Given** the user receives a helpful AI answer
**When** the user clicks a "Save to Notes" button on the AI response bubble
**Then** the Q&A pair (question + answer) is saved as a note for this lesson via `addNote()`
**And** the note content is formatted as: `**Q:** {question}\n\n**A:** {answer}`
**And** the tag `#ai-qa` is added
**And** a success toast appears: "Q&A saved to notes"

**Error & Edge Cases:**

**Given** the current lesson has no transcript and no notes
**When** the user opens the Q&A tab
**Then** a message appears: "No content available for Q&A. This lesson needs a transcript or notes to answer questions."
**And** the input is disabled

**Given** a Q&A request fails
**When** the error is displayed
**Then** the error appears as a system message in the chat: "Unable to get a response. [Error details]"
**And** a "Retry" link appears inline

**Technical Requirements:**

- Create `src/ai/qa.ts` — Q&A logic with RAG context assembly. Exports `askQuestion(question, context, history)` using `aiStream()`. Implements `assembleContext(lessonId, courseId, maxTokens)` that gathers transcript (via `loadTranscript()`) + notes + adjacent content and trims to budget.
- Create `src/ai/context.ts` — Context assembly utilities. Exports `assembleRAGContext(lessonId, courseId, maxTokens)` that loads transcripts via `loadTranscript(captionTracks)` from `src/ai/transcript.ts` and prioritizes: (1) current lesson transcript, (2) current notes, (3) course notes, (4) adjacent lesson transcripts. Uses `estimateTokens()` from `src/ai/transcript.ts`. Exports `trimToTokenBudget(sections, maxTokens)` that removes lowest-priority sections first.
- Create `src/app/components/ai/CourseQA.tsx` — Chat-style Q&A component. Manages local state for messages array `{role, content, timestamp}[]`. Uses `useRef` for auto-scrolling to latest message. Implements send, stop, retry, and save-to-notes actions.
- Integrate Q&A tab into LessonPlayer page, conditionally rendered when `isAIEnabled()`.
- Cache key: `ai-cache:qa:{lessonId}:{questionHash}` with 7-day TTL. Only cache the first response to each unique question (follow-ups are not cached since they depend on conversation history).

**FRs Fulfilled:** FR50 (answer questions about course content using RAG), FR67 (context limit management — implemented here)

**NFRs Addressed:** NFR33 (30s timeout), NFR34 (response caching), NFR64 (streaming), NFR72 (context window management with priority-based trimming), NFR77 (partial streaming)

---

### Story 6.5: Quiz Generation from Video Content

As a learner,
I want to generate quiz questions from video content,
So that I can test my understanding and reinforce key concepts.

**Acceptance Criteria:**

**Quiz Action UI:**

**Given** the user is on the LessonPlayer page viewing a lesson with caption tracks
**And** AI features are enabled with a valid API key
**When** the page renders
**Then** a "Quiz Me" button appears in the lesson action bar (between existing action buttons)
**And** the button shows a brain/graduation cap icon with text "Quiz Me"

**Given** the user clicks "Quiz Me"
**When** the quiz generation begins
**Then** a slide-over panel opens from the right (or a modal on mobile)
**And** a loading state shows: "Generating quiz questions..."
**And** the AI generates 5 multiple-choice questions from the lesson transcript

**Quiz Interaction:**

**Given** the quiz questions have been generated
**When** they display in the panel
**Then** each question shows: (1) question number and text, (2) four answer options (A, B, C, D) as clickable cards, (3) questions are presented one at a time with a progress bar at the top ("Question 1 of 5")

**Given** the user selects an answer for a question
**When** they click an option
**Then** the correct answer is highlighted in green (border-green-500, bg-green-50)
**And** if incorrect, the selected answer is highlighted in red (border-red-500, bg-red-50)
**And** a brief explanation appears below the options explaining why the correct answer is right
**And** a "Next" button appears to proceed

**Given** the user completes all 5 questions
**When** the last question is answered
**Then** a results summary appears: "You scored X/5" with a visual indicator (confetti animation if 5/5, encouraging message if <3/5)
**And** buttons appear: "Retake Quiz" (regenerates new questions), "Save Results" (saves to notes), "Close"

**Given** the user clicks "Save Results"
**When** the save completes
**Then** a note is created for this lesson via `addNote()` with content: quiz results formatted as markdown (questions, user answers, correct answers, score)
**And** the tag `#ai-quiz` is added
**And** a success toast appears: "Quiz results saved to notes"

**Quiz Generation Quality:**

**Given** the AI generates quiz questions
**When** the response is parsed
**Then** each question has exactly 4 options with exactly 1 correct answer
**And** the explanation references specific content from the transcript
**And** questions test comprehension (not trivial recall of exact words)

**Given** the AI response does not conform to the expected JSON schema
**When** parsing fails
**Then** a fallback message appears: "Unable to format quiz questions. Please try again."
**And** a "Regenerate" button appears

**Edge Cases:**

**Given** a lesson has a very short transcript (<500 characters)
**When** the user clicks "Quiz Me"
**Then** the message reads: "This lesson's content is too short to generate meaningful quiz questions."
**And** no API call is made

**Given** AI features are disabled or no API key is set
**When** the user views the LessonPlayer page
**Then** the "Quiz Me" button does not appear

**Technical Requirements:**

- Create `src/ai/quizzes.ts` — Quiz generation logic. Exports `generateQuiz(transcript, numQuestions)` that takes plain-text transcript (loaded via `loadTranscript()` from `src/ai/transcript.ts` by the calling component) and sends it with system prompt: "Generate {n} multiple-choice questions to test understanding of this educational content. Return JSON array: [{question, options: [string, string, string, string], correctIndex: number, explanation: string}]. Questions should test comprehension, not trivial word recall." Uses `aiChat()` (non-streaming) since the full response is needed for JSON parsing. Includes response validation and retry on malformed JSON (up to 2 retries with the note "Please return valid JSON").
- Create `src/app/components/ai/QuizPanel.tsx` — Quiz container component with states: idle → generating → active → results. Manages current question index, user answers array, and score calculation.
- Create `src/app/components/ai/QuizQuestion.tsx` — Individual question component with option selection, correct/incorrect highlighting, and explanation reveal animation (fade-in, 200ms).
- Integrate "Quiz Me" button into LessonPlayer action bar, conditionally rendered when `isAIEnabled()` and lesson has caption tracks (`Resource.metadata.captions` is non-empty). Transcript is loaded on-demand via `loadTranscript()` when the user clicks "Quiz Me".
- Cache key: `ai-cache:quiz:{lessonId}:{transcriptHash}` with no caching (quizzes should be fresh each time to avoid memorization). However, the "Retake Quiz" action explicitly makes a new API call.
- Quiz response JSON schema validation: If JSON parsing fails, retry with a clarifying prompt. After 2 failed attempts, show error to user.

**FRs Fulfilled:** FR52 (generate quiz questions from video content)

**NFRs Addressed:** NFR33 (30s timeout), NFR34 (no caching for quizzes — intentional)

---

### Story 6.6: Study Plan Recommendations & Learning Strategies

As a learner,
I want AI-generated study plan recommendations and learning strategy tips based on my progress,
So that I can optimize my study habits and stay on track with my learning goals.

**Acceptance Criteria:**

**Study Plan Card on Overview:**

**Given** the user navigates to the Overview page
**And** AI features are enabled with a valid API key
**When** the page renders
**Then** a "Study Plan" card appears in the dashboard (below existing content)
**And** the card has a gradient header (blue-50 → indigo-50) with a lightbulb icon and title "AI Study Plan"
**And** the card body initially shows a "Generate Study Plan" button

**Given** the user clicks "Generate Study Plan"
**When** the AI request is made
**Then** the button is replaced by a loading skeleton
**And** the AI generates a personalized study plan based on: (1) courses in progress from `getCoursesInProgress()`, (2) completion percentages from `getCourseCompletionPercent()`, (3) current streak from `getCurrentStreak()`, (4) study log patterns from `getStudyLog()`, (5) total study hours from `getTotalEstimatedStudyHours()`

**Given** the study plan generation completes
**When** the response renders
**Then** the card shows: (1) a "Today's Focus" section with 1-3 recommended actions, (2) a "This Week" section with a suggested study schedule, (3) a "Tip" section with one actionable learning strategy
**And** each recommendation references specific courses by name
**And** a "Refresh" button appears in the card header (refreshes after 24 hours automatically)
**And** the plan is cached for 24 hours

**Study Tips Panel:**

**Given** the user clicks "More Tips" at the bottom of the Study Plan card
**When** the tips panel expands (or opens as a sheet on mobile)
**Then** 3-5 study tips are displayed, personalized based on the user's learning patterns
**And** tips cover areas like: spaced repetition, active recall, study session timing, break recommendations
**And** each tip includes a brief explanation and an actionable suggestion

**Given** the study tips have been generated previously
**When** the user views them again within 24 hours
**Then** the cached tips are shown (no new API call)

**Context Gathering:**

**Given** the AI generates a study plan
**When** the context is assembled
**Then** it includes: total courses (count), courses in progress (names + completion %), completed courses (names), current streak (days), study frequency (sessions per week from study log), total hours studied, most/least recently accessed courses
**And** the system prompt instructs: "You are a learning coach. Based on the student's progress data, create a practical study plan. Be specific — mention course names and suggest concrete actions. Keep recommendations achievable and encouraging."

**Edge Cases:**

**Given** the user has no courses in progress (fresh account)
**When** they view the Overview page with AI enabled
**Then** the Study Plan card shows: "Start a course to get personalized study recommendations!"
**And** no API call is made

**Given** the study plan generation fails
**When** the error is displayed
**Then** the card shows: "Unable to generate study plan. [Retry button]"
**And** the card does not disappear — the error state is contained within the card

**Technical Requirements:**

- Create `src/ai/recommendations.ts` — Study plan generation logic. Exports `generateStudyPlan(progressData)` and `generateStudyTips(progressData)`. Gathers data from `src/lib/progress.ts` (`getCoursesInProgress`, `getAllProgress`, etc.) and `src/lib/studyLog.ts` (`getStudyLog`, `getCurrentStreak`, `getLongestStreak`). **Uses `getCurrentStreak()` from `studyLog.ts` (canonical)** — not `getStudyStreak()` from `studyStreak.ts`. Formats context as structured data for the AI prompt.
- Create `src/app/components/ai/StudyPlanCard.tsx` — Card component for the Overview page. States: no-data → idle → generating → loaded → error. Renders "Today's Focus" as a checklist-style list, "This Week" as a simple schedule, "Tip" as a highlighted callout box.
- Create `src/app/components/ai/StudyTipsPanel.tsx` — Expandable tips panel. Renders as a Sheet (bottom sheet on mobile, side panel on desktop) with scrollable tip cards.
- Integrate StudyPlanCard into `src/app/pages/Overview.tsx`, conditionally rendered when `isAIEnabled()`.
- Cache key: `ai-cache:studyplan:{progressHash}` with 24-hour TTL. Cache key: `ai-cache:tips:{progressHash}` with 24-hour TTL. Progress hash is computed from course count + total completion + streak length (changes when meaningful progress occurs).

**FRs Fulfilled:** FR48 (study plan recommendations based on progress and goals), FR53 (study tips and learning strategies)

**NFRs Addressed:** NFR33 (30s timeout), NFR34 (24-hour cache), NFR74 (caching with TTL)

---

### Story 6.7: Course Recommendations

As a learner,
I want AI-powered course suggestions based on my study history and progress,
So that I can discover relevant courses and plan my learning path effectively.

**Acceptance Criteria:**

**Related Courses Card:**

**Given** the user navigates to the Overview page or a CourseDetail page
**And** AI features are enabled with a valid API key
**And** the user has at least one course with progress data
**When** the page renders
**Then** a "Suggested Courses" card appears with a compass icon and title
**And** the card initially shows a "Get Recommendations" button

**Given** the user clicks "Get Recommendations"
**When** the AI request is made with context about: (1) courses the user is currently studying (names, categories, tags, completion %), (2) completed courses, (3) study patterns (most active category, tag frequency)
**Then** the AI returns 3-5 course recommendations

**Given** the recommendations are generated
**When** they render in the card
**Then** each recommendation shows: (1) a suggested course topic/title, (2) a reasoning sentence (e.g., "Pairs well with your React progress" or "Builds on concepts from your completed Python course"), (3) a relevance tag (e.g., "Related", "Next Step", "Complement")
**And** recommendations are sorted by relevance (most relevant first)

**On CourseDetail Page:**

**Given** the user is viewing a specific course's detail page
**And** AI features are enabled
**When** a "Related Courses" section renders
**Then** it shows 2-3 course suggestions specifically related to the current course
**And** the context includes the current course's title, description, tags, and category
**And** recommendations are contextual (e.g., "After finishing this course, consider...")

**Caching & Refresh:**

**Given** course recommendations have been generated
**When** the user revisits the page within 24 hours and their course data hasn't changed
**Then** cached recommendations are shown immediately (no loading state)

**Given** the user completes a new lesson or starts a new course
**When** the progress hash changes
**Then** the cached recommendations are invalidated
**And** the card shows "Get Recommendations" again (or auto-refreshes)

**Edge Cases:**

**Given** the user has no courses
**When** they view the Overview page
**Then** the Suggested Courses card does not appear

**Given** the recommendation generation fails
**When** the error is displayed
**Then** the card shows: "Unable to generate recommendations. [Retry button]"

**Technical Requirements:**

- Create `src/ai/courseRecommendations.ts` — Recommendation logic. Exports `generateCourseRecommendations(progressData, currentCourse?)` that assembles context from course catalog (`src/data/courses/`) and progress data. Returns `{topic, reasoning, relevanceTag}[]`. The AI prompt instructs: "Based on this learner's course history and progress, suggest courses they should study next. Explain why each recommendation is relevant. Suggest topics/skills, not specific products."
- Create `src/app/components/ai/RelatedCoursesCard.tsx` — Card component showing recommendation list. Each recommendation is a compact card with topic, reasoning, and tag badge. Uses blue-50 background for "Next Step" tags, purple-50 for "Complement", gray-50 for "Related".
- Integrate into `src/app/pages/Overview.tsx` (full card) and CourseDetail page (compact section), conditionally rendered when `isAIEnabled()`.
- Cache key: `ai-cache:recommendations:{progressHash}` (Overview) and `ai-cache:recommendations:{courseId}:{progressHash}` (CourseDetail) with 24-hour TTL.

**FRs Fulfilled:** FR51 (suggest related courses based on study history)

**NFRs Addressed:** NFR33 (30s timeout), NFR34 (24-hour cache), NFR74 (caching with TTL)

---

### Story 6.8: AI-Powered Note Enhancement & Concept Connections

As a learner,
I want AI assistance to organize my notes and discover connections between concepts across courses,
So that I can build a more structured understanding of the material.

**Acceptance Criteria:**

**Note Enhancement Toolbar:**

**Given** the user is editing a note in the NoteEditor component
**And** AI features are enabled with a valid API key
**When** the note content has at least 50 characters
**Then** a compact AI toolbar appears below the note editor with three action buttons: "Organize" (list icon), "Suggest Tags" (tag icon), "Improve" (wand icon)

**Given** the user clicks "Organize"
**When** the AI processes the note content
**Then** the AI returns a restructured version of the note with: clear headings, bullet points for key items, logical grouping of related ideas
**And** the restructured content appears in a preview pane below the toolbar (side-by-side with original on desktop, stacked on mobile)
**And** "Apply" and "Dismiss" buttons appear
**And** clicking "Apply" replaces the note content with the organized version
**And** clicking "Dismiss" closes the preview

**Given** the user clicks "Suggest Tags"
**When** the AI analyzes the note content
**Then** 3-5 suggested tags appear as clickable badges below the toolbar
**And** clicking a tag adds it to the note's tag list via `saveNote()` with the updated tags array
**And** tags that already exist on the note are shown as disabled (already applied)

**Given** the user clicks "Improve"
**When** the AI processes the note content
**Then** the AI returns an enhanced version: fixing grammar, clarifying unclear points, adding relevant context from the lesson transcript
**And** the enhanced version appears in the same preview pane as "Organize"
**And** "Apply" and "Dismiss" buttons function identically

**Concept Connections Card:**

**Given** the user is viewing a CourseDetail page or the Overview page
**And** AI features are enabled
**And** the user has notes in at least 2 different courses
**When** a "Concept Connections" card renders
**Then** it shows a "Discover Connections" button with a link/chain icon

**Given** the user clicks "Discover Connections"
**When** the AI analyzes notes across all courses
**Then** notes are trimmed to fit within the 32K token budget (first 500 chars per note; if still over, most recent N notes per course)
**And** the AI identifies 2-5 concept connections (e.g., "Your notes about 'body language cues' in Course A relate to 'nonverbal communication strategies' in Course B")
**And** each connection shows: (1) the two connected concepts, (2) the courses they belong to, (3) a brief explanation of the relationship

**Given** the user clicks on a connection
**When** the connection expands
**Then** it shows the relevant note excerpts from each course
**And** a link "View Note" navigates to the respective lesson's note

**Edge Cases:**

**Given** the note content is less than 50 characters
**When** the user views the note editor
**Then** the AI toolbar does not appear (not enough content to enhance)

**Given** the user has notes in only one course
**When** the Concept Connections card renders
**Then** the card shows: "Add notes to more courses to discover concept connections"
**And** the "Discover Connections" button is disabled

**Given** a note enhancement request fails
**When** the error is displayed
**Then** the toolbar shows a brief error message inline: "Unable to process. Try again."
**And** the original note content is unchanged

**Technical Requirements:**

- Create `src/ai/noteEnhancement.ts` — Note enhancement logic. Exports `organizeNote(content)`, `suggestTags(content)`, `improveNote(content, transcript?)`. Each function sends the note content (and optionally the lesson transcript for context) to the AI with specific system prompts. Returns enhanced content as string or tags as `string[]`.
- Create `src/ai/conceptConnections.ts` — Cross-course concept analysis. Exports `findConceptConnections(allNotes)` that gathers notes from all courses via `getAllProgress()`, extracts key themes, and asks the AI to identify connections. **Token budget:** Uses `estimateTokens()` from `src/ai/transcript.ts` to check total note content size. If notes exceed 32K tokens, trims to fit by: (1) taking only the first 500 chars of each note, (2) if still over budget, sampling the most recent N notes per course. Returns `{concept1, course1, concept2, course2, explanation, noteExcerpt1?, noteExcerpt2?}[]`.
- Create `src/app/components/ai/NoteEnhanceToolbar.tsx` — Compact toolbar component rendered below the note editor. Three icon buttons with tooltips. Preview pane with diff-style display (original vs enhanced).
- Create `src/app/components/ai/ConceptConnectionCard.tsx` — Card component with expandable connection items. Each item uses an accordion pattern to reveal note excerpts.
- Integrate NoteEnhanceToolbar into the existing NoteEditor component, conditionally rendered when `isAIEnabled()` and note length >= 50 chars.
- Integrate ConceptConnectionCard into Overview page and CourseDetail page, conditionally rendered when `isAIEnabled()` and notes exist in 2+ courses.
- Privacy: Only the note content and relevant transcript are sent to the AI. No user profile data (name, bio) is included in the request (NFR54).
- Cache: Tag suggestions are cached per note content hash (7-day TTL). Concept connections are cached per all-notes hash (24-hour TTL). Organize/Improve are not cached (users expect fresh results).

**FRs Fulfilled:** FR69 (AI-assisted note enhancement — organize, restructure, suggest tags), FR70 (suggest concept connections across different courses)

**NFRs Addressed:** NFR33 (30s timeout), NFR54 (no PII in API calls), NFR72 (context window management)

---

### Story 6.9: AI Coach Suggestions & Search Enhancement

As a learner,
I want contextual coaching suggestions (streak reminders, completion nudges) and the ability to search my notes alongside courses,
So that I receive timely learning encouragement and can find all my content from one place.

**Acceptance Criteria:**

**Rule-Based Coaching Suggestions (No AI Required):**

**Given** the user navigates to the Overview page
**When** the page renders
**Then** a contextual suggestion card appears based on rule-based logic (no AI API call needed)
**And** the card has a gradient background (blue-50 → indigo-50), a lightbulb icon, and dismissable (X button)

**Given** the user's streak is at risk (studied yesterday but not today, and it's after 6 PM local time)
**When** the suggestion renders
**Then** it shows: "Your [N]-day streak is at risk! Study for just 10 minutes to keep it going."
**And** a "Continue Learning" button links to the most recently accessed course

**Given** the user has a course at >80% completion
**When** the suggestion renders
**Then** it shows: "You're almost done with [Course Name]! Just [N] lessons to go."
**And** a "Finish Course" button links to the next unwatched lesson

**Given** the user hasn't studied in 3+ days (streak broken)
**When** the suggestion renders
**Then** it shows: "Welcome back! Ready to pick up where you left off with [Course Name]?"
**And** a "Resume" button links to the last accessed course

**Given** the user completed a course within the last 24 hours
**When** the suggestion renders
**Then** it shows: "Great job completing [Course Name]! Consider reviewing [Related Topic] next."

**Given** no suggestion rules match (e.g., brand new user with no data)
**When** the Overview page renders
**Then** no suggestion card appears (not "No suggestions available")

**AI-Enhanced Suggestions (Optional):**

**Given** AI features are enabled with a valid API key
**And** a rule-based suggestion is triggered
**When** the suggestion renders
**Then** the AI enhances the message with more personalized, encouraging language (e.g., instead of "Your 7-day streak is at risk!", the AI might generate "You've built an incredible 7-day streak! Just 10 minutes tonight and you'll hit a full week of consistent learning.")
**And** the rule-based suggestion shows immediately, and the AI-enhanced version replaces it when ready (progressive enhancement)
**And** if the AI call fails, the rule-based suggestion remains (graceful fallback)

**Suggestion Dismissal:**

**Given** the user dismisses a suggestion (clicks X)
**When** the suggestion is dismissed
**Then** it does not reappear for 24 hours (dismissal tracked in localStorage with timestamp)
**And** the next applicable suggestion (if any) takes its place
**And** only one suggestion card is shown at a time (highest priority wins)

**Suggestion Priority Order:**
1. Streak at risk (highest — time-sensitive)
2. Course near completion (>80%)
3. Welcome back (3+ days absent)
4. Course completed (celebration follow-up)

**Search Enhancement — Notes in Command Palette:**

**Given** the user opens the search command palette (Ctrl/Cmd+K)
**When** they type a search query
**Then** search results include notes alongside courses and lessons
**And** note results show: note excerpt (first 100 chars), course name, lesson name, and a "Note" badge
**And** notes are searched by content text (simple `includes()` matching on note content)
**And** results are grouped: "Courses" section, "Lessons" section, "Notes" section

**Given** the user clicks a note search result
**When** the navigation occurs
**Then** the user is navigated to the lesson associated with that note
**And** the notes tab/panel is opened with the matched note highlighted/scrolled into view

**Given** the user searches for a term that appears only in notes (not in course/lesson titles)
**When** the results render
**Then** the matching notes appear in the "Notes" section
**And** the search term is highlighted in the note excerpt (bold or yellow background)

**Technical Requirements:**

- Create `src/ai/suggestions.ts` — Rule-based suggestion engine. Exports `getTopSuggestion()` that evaluates all rules against current data (progress, streak, last activity) and returns the highest-priority applicable suggestion. Each rule is a pure function: `(data) => Suggestion | null`. If AI is enabled, exports `enhanceSuggestion(suggestion, aiClient)` for AI enhancement.
- Create `src/app/components/ai/AICoachSuggestion.tsx` — Suggestion card component. Renders the rule-based message immediately, then optionally replaces with AI-enhanced version. Manages dismissal state in localStorage key `ai-suggestion-dismissed:{ruleId}:{date}`.
- Modify `src/app/components/figma/SearchCommandPalette.tsx` — Add notes to search results. Import `getAllProgress()` from `src/lib/progress.ts`, iterate over all course progress entries, search note content with case-insensitive `includes()`. Add a "Notes" result group below existing groups.
- Integrate AICoachSuggestion into `src/app/pages/Overview.tsx`, rendered unconditionally (rule-based core works without AI). AI enhancement layer is conditional on `isAIEnabled()`.
- Dismissal storage: localStorage key `ai-dismissed-suggestions` storing `{ruleId: dismissedAtISO}` map. Clean up entries older than 24 hours on read.
- The rule-based engine uses data from: `getCurrentStreak()` and `getLongestStreak()` from `src/lib/studyLog.ts` (canonical — **not** `getStudyStreak()` from `studyStreak.ts`), `getCoursesInProgress()`, `getCompletedCourses()`, `getRecentActivity()`, `getAllProgress()`.

**FRs Fulfilled:** FR72 (contextual AI coaching suggestions — rule-based core with AI enhancement), FR73 (add notes and course content to search results in command palette)

**NFRs Addressed:** NFR73 (privacy controls — no data sent to AI for rule-based suggestions)

---

### Story 6.10: Dashboard Customization & AI Feature Polish

As a learner,
I want to customize which dashboard widgets are visible and have a polished, consistent AI experience,
So that I can focus on the features most useful to me and trust the AI integration's quality.

**Acceptance Criteria:**

**Dashboard Widget Toggles:**

**Given** the user navigates to Settings
**When** the page renders
**Then** a "Dashboard Widgets" section appears (below AI Features or as a separate card)
**And** it contains toggle switches for each dashboard widget: "Study Plan" (default: on), "Course Recommendations" (default: on), "Concept Connections" (default: on), "Coach Suggestions" (default: on), "Study Streak Calendar" (default: on)
**And** each toggle has a label and brief description

**Given** the user toggles a widget off
**When** they navigate to the Overview page
**Then** the disabled widget is not rendered (not hidden via CSS — not rendered at all)
**And** the remaining widgets reflow to fill the available space naturally

**Given** the user toggles a widget back on
**When** they navigate to the Overview page
**Then** the widget reappears in its standard position
**And** if the widget had cached data, it loads immediately

**Given** the user's widget preferences are saved
**When** they refresh or return to the app
**Then** preferences persist via `AppSettings` in localStorage
**And** default values are used for any new widgets not yet in the user's stored preferences

**AI Status Indicator:**

**Given** AI features are enabled
**When** any page renders
**Then** a small AI status indicator appears in the header/topbar area (near the notification bell)
**And** the indicator shows a sparkle icon (✨) with a dot: green dot = configured & connected, gray dot = enabled but no key

**Given** the user hovers over the AI status indicator
**When** the tooltip appears
**Then** it shows: "AI: [Provider Name] — [Token count] tokens used" if connected, or "AI: Not configured — Set up in Settings" with a link

**Given** AI features are disabled
**When** any page renders
**Then** the AI status indicator does not appear

**Unified Loading & Error State Verification:**

**Given** all AI components (Stories 6.3-6.9) use the shared `AILoading` and `AIError` components from Story 6.1
**When** reviewing the codebase
**Then** no AI component defines its own loading skeleton or error card — all use the shared components
**And** the `AILoading` variant (`'card'`, `'inline'`, `'chat-bubble'`) is correctly matched to each component's layout

**Lazy Loading:**

**Given** AI components are added to various pages
**When** the app bundles are built
**Then** all AI components (`VideoSummary`, `CourseQA`, `QuizPanel`, `StudyPlanCard`, `RelatedCoursesCard`, `NoteEnhanceToolbar`, `ConceptConnectionCard`, `AICoachSuggestion`) are loaded via `React.lazy()` with `Suspense` fallbacks
**And** the AI component bundle is a separate chunk that is only loaded when AI features are enabled

**Given** AI features are disabled
**When** the app loads
**Then** no AI component JavaScript is downloaded or parsed
**And** the main bundle size is not affected by AI code

**Accessibility:**

**Given** any AI component renders
**When** a screen reader encounters it
**Then** all AI-generated content is within `role="region"` with `aria-label` (e.g., "AI-generated video summary")
**And** loading states use `aria-live="polite"` to announce when content is ready
**And** streaming text uses `aria-live="off"` during streaming and switches to `aria-live="polite"` when complete
**And** all AI action buttons have descriptive `aria-label` attributes (e.g., "Generate video summary using AI")
**And** the AI status indicator has `aria-label="AI status: connected"` or `"AI status: not configured"`

**Given** any AI component has a dismiss/close action
**When** the user presses Escape
**Then** the component closes (sheets, panels, modals)
**And** focus returns to the element that triggered the AI action

**Responsive:**

**Given** the viewport is < 640px (mobile)
**When** AI components render
**Then** all AI panels use bottom sheets (Sheet component) instead of side panels
**And** the AI status indicator moves to the header menu (hamburger) instead of inline
**And** touch targets for all AI buttons are ≥ 44x44px

**Technical Requirements:**

- Extend `AppSettings` in `src/lib/settings.ts` with `dashboardWidgets: { studyPlan: boolean, courseRecommendations: boolean, conceptConnections: boolean, coachSuggestions: boolean, studyStreakCalendar: boolean }` (all default `true`).
- Create `src/app/components/ai/AIStatusIndicator.tsx` — Header status indicator component. Reads from `getSettings()` and `getTotalTokens()`. Green/gray dot based on `aiEnabled && aiApiKey`.
- Modify `src/app/pages/Overview.tsx` — Wrap each dashboard widget in a conditional check against `dashboardWidgets` settings. Use `React.lazy()` for all AI components with `<Suspense fallback={<Skeleton />}>`.
- Modify `src/app/pages/Settings.tsx` — Add "Dashboard Widgets" card with toggle switches (below the AI Features section added in Story 6.2).
- Modify `src/app/components/Layout.tsx` — Add `AIStatusIndicator` to header, conditionally rendered when `aiEnabled`.
- Modify `src/app/routes.tsx` — Ensure AI component imports use `React.lazy()` at the route level where applicable.
- Bundle verification: After implementation, run `npm run build` and verify that: (1) main bundle remains <500KB gzipped (NFR10), (2) AI components are in a separate chunk, (3) the AI chunk is only loaded when AI features are enabled.

**FRs Fulfilled:** FR74 (show/hide dashboard widgets via Settings toggles with preference persistence)

**NFRs Addressed:** NFR76 (AI feature toggle with graceful degradation — verify all components respect `isAIEnabled()`), NFR36 (WCAG 2.1 AA+ for AI components), NFR37 (keyboard navigation for AI elements), NFR38 (screen reader support), NFR10 (bundle size <500KB), NFR13 (lazy load non-critical components)

---
