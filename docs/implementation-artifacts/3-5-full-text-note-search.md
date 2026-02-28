---
story_id: E03-S05
story_name: "Full-Text Note Search"
status: in-progress
started: 2026-02-28
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 3.5: Full-Text Note Search

## Story

As a learner,
I want to search across all my notes by content, tags, or course name,
So that I can find specific knowledge I've captured in under 10 seconds.

## Acceptance Criteria

**Given** the user has notes across multiple courses
**When** the user types a search query in the search bar or Cmd+K command palette
**Then** MiniSearch returns matching results within 100ms of the final keystroke (150ms debounce + sub-1ms search)
**And** results show note snippet with highlighted matching keywords, course name, video title, and tags
**And** results are ranked by relevance (tags boosted 2x, course name 1.5x, content 1x)

**Given** the user types a query with a typo (e.g., "custm hooks")
**When** search executes
**Then** fuzzy matching still returns relevant results (e.g., notes containing "custom hooks")
**And** prefix search works for autocomplete (searching "java" finds "javascript")

**Given** a search result is clicked
**When** the user selects a note result
**Then** the Lesson Player opens with the linked video and `?panel=notes` param to auto-open the Notes tab
**And** if the note contains a timestamp link, the video seeks to that position

**Given** no results match the query
**When** search returns empty
**Then** a helpful message is shown: "No notes found. Try different keywords or browse by tag."

## Tasks / Subtasks

- [ ] Task 1: Install and configure MiniSearch (AC: 1, 2)
  - [ ] 1.1 Install `minisearch` package
  - [ ] 1.2 Create search index service with field configuration (content, tags, courseName, videoTitle)
  - [ ] 1.3 Configure boosted fields (tags 2x, courseName 1.5x, content 1x)
  - [ ] 1.4 Enable fuzzy matching and prefix search
- [ ] Task 2: Build search index lifecycle (AC: 1)
  - [ ] 2.1 Initialize index from Dexie notes on app startup
  - [ ] 2.2 Incremental index updates on note CRUD operations
  - [ ] 2.3 Ensure sub-1ms search performance
- [ ] Task 3: Integrate into SearchCommandPalette (AC: 1, 2, 4)
  - [ ] 3.1 Add "Notes" result group to existing SearchCommandPalette.tsx
  - [ ] 3.2 Replace static useMemo index with dynamic MiniSearch-backed results
  - [ ] 3.3 Render results with note icon, content snippet, course/video context, and tag badges
  - [ ] 3.4 Implement 150ms debounce for search input
  - [ ] 3.5 Show empty state message when no results match
- [ ] Task 4: Deep-linking and navigation (AC: 3)
  - [ ] 4.1 Navigate to Lesson Player with `?panel=notes` param on result click
  - [ ] 4.2 Seek video to timestamp position if note contains timestamp link

## Implementation Notes

- MiniSearch index initialized in Story 3.0, updated incrementally on note CRUD
- Search fields: content, tags, courseName, videoTitle
- Combine with 'AND' for multi-term queries
- Limit to top 20 results
- SearchCommandPalette.tsx modification required: Add a "Notes" result group
- The palette's `useMemo(() => buildSearchIndex(), [])` needs dependency on open state or a separate dynamic fetch for notes

## Implementation Plan

See [plan](../../.claude/plans/wobbly-inventing-hearth.md) for implementation approach.

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story]

## Code Review Feedback

[Populated by /review-story]

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
