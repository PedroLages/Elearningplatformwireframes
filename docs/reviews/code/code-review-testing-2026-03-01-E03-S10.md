## Test Coverage Review: E03-S10 — Note Export

### AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Export dialog presents options when user initiates export | None | `story-e03-s10.spec.ts:94-117` | Covered |
| 2 | Each note exported as Markdown with YAML frontmatter (title, course, video, tags, created, updated) | `noteExport.test.ts:108-135` (generateFrontmatter), `noteExport.test.ts:140-155` (noteToMarkdown) | `story-e03-s10.spec.ts:125-148` | Partial |
| 3 | Timestamps as formatted links, images as base64/referenced, TipTap formatting converts to Markdown | `noteExport.test.ts:59-102` (htmlToMarkdown — images, timestamps, hr, blockquote, nested) | `story-e03-s10.spec.ts:154-173` | Partial |
| 4 | Multiple notes bundled as ZIP with sanitized filenames | `noteExport.test.ts:160-179` (sanitizeFilename) | `story-e03-s10.spec.ts:179-197` | Partial |
| 5 | Summary shows notes exported count, total size, failed notes with reasons | None | `story-e03-s10.spec.ts:204-230` | Partial |

**Coverage**: 1/5 ACs fully covered | 0 gaps | 4 partial

### Findings

#### High Priority

- **E2E AC2 missing `title:` and `video:` frontmatter assertions (confidence: 92)**: The E2E test asserts on `course:`, `tags:`, `created:`, `updated:` but never `title:` or `video:`. Fix: Add assertions.

- **E2E AC5 missing total size and failure assertions (confidence: 91)**: Tests check count but not `total size` or `failed notes with reasons`. Fix: Add size format assertion and a failure-path test.

- **E2E AC4 never validates filenames are derived from titles (confidence: 88)**: Test checks `.zip` extension but not that filename contains course/lesson title fragments. Fix: Assert filename content.

- **No unit tests for export orchestration functions (confidence: 87)**: `exportNotes`, `exportSingleNote`, `exportNotesByCourse` are untested. The duplicate filename deduplication logic, single-vs-ZIP branching, and error path are all uncovered. Fix: Add tests with mocked DOM APIs.

- **NFR63 (30-second performance) not tested (confidence: 85)**: No unit or E2E test verifies the 30-second export time requirement. Fix: Add performance benchmark test.

#### Medium

- **Inline `seedNotes` duplicates fixture patterns (confidence: 82)**: Spec uses raw IndexedDB manipulation instead of project's `createNote` factory and `indexedDB` fixture.

- **Empty-state test uses unscoped selector (confidence: 80)**: `page.getByText(/no notes/i)` not scoped to dialog — fragile if page empty-state text changes.

- **Unit tests use inline `makeNote` instead of `createNote` factory (confidence: 75)**: Parallel note factories risk divergence.

- **AC1 doesn't verify course-specific radio options (confidence: 73)**: Tests check "All notes" text but not individual course radio items.

#### Nits

- Duplicated setup in AC1 tests — extract to `beforeEach`
- `htmlToMarkdown` HR assertion uses `.toContain('---')` — too loose
- Timestamp link test doesn't assert protocol is removed
- No tests for h4-h6 headings or HTML entity decoding

---

ACs: 1 fully covered / 5 total | Findings: 13 | Blockers: 0 | High: 5 | Medium: 4 | Nits: 4
