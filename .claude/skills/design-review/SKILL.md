---
name: design-review
description: Use when reviewing UI/UX changes to React components, pages, or styles to validate design consistency, accessibility compliance (WCAG 2.1 AA+), responsive behavior, and adherence to design system standards through automated Playwright testing
---

# design-review

Comprehensive design review for front-end UI changes in the e-learning platform.

## Behavior

When invoked, execute this automated workflow to conduct a thorough design review:

### Phase 1: Preparation & Context Gathering

Execute these steps using available tools:

1. **Identify Changed Files**
   - Use Bash: `git status` to see modified files
   - Use Bash: `git diff --name-only` to get list of changed files
   - Use Bash: `git diff` to see detailed changes (both staged and unstaged)
   - Filter for UI-related files: `.tsx`, `.css`, `theme.css`, `tailwind.css`

2. **Load Design Standards**
   - Use Read: Load `.claude/workflows/design-review/design-principles.md` to understand project standards
   - Reference design system fundamentals: Tailwind v4, shadcn/ui, `#FAF5EE` background, `blue-600` primary

3. **Determine Affected Routes**
   - Parse changed file paths to identify affected pages
   - Map files to routes:
     - `src/app/pages/Overview.tsx` → `/`
     - `src/app/pages/MyClass.tsx` → `/my-class`
     - `src/app/pages/Courses.tsx` → `/courses`
     - `src/app/pages/Messages.tsx` → `/messages`
     - `src/app/pages/Instructors.tsx` → `/instructors`
     - `src/app/pages/Reports.tsx` → `/reports`
     - `src/app/pages/Settings.tsx` → `/settings`
   - If component files changed, identify which pages use them

### Phase 2: Automated Visual & Interaction Testing

Execute Playwright tests to validate UI quality:

1. **Check Development Server**
   - Use Bash: `lsof -ti:5173` to check if server is running
   - If not running, use Bash: `npm run dev &` to start in background
   - Wait 3-5 seconds for server to start

2. **Run Design Review Tests**
   - For each affected route, use Bash:

     ```bash
     TEST_ROUTE=<route> npx playwright test tests/design-review.spec.ts --reporter=json --output=test-results/
     ```

   - The test will automatically:
     - Take screenshots at mobile (375px), tablet (768px), desktop (1440px)
     - Check for horizontal scroll issues
     - Validate touch targets ≥44x44px on mobile
     - Test heading hierarchy (H1, H2)
     - Check ARIA labels on icon buttons
     - Verify image alt text
     - Validate form labels
     - Check semantic HTML usage
     - Test focus indicators
     - Detect console errors
     - Validate background color consistency

3. **Collect Test Results**
   - Use Read: Load `test-results/design-review-report.json` for structured findings
   - Use Read: Reference screenshots:
     - `test-results/design-review-mobile.png`
     - `test-results/design-review-tablet.png`
     - `test-results/design-review-desktop.png`

### Phase 3: Code Quality Analysis

Use code analysis tools to find anti-patterns:

1. **Search for Hardcoded Values**
   - Use Grep: `pattern="#[0-9A-Fa-f]{6}"` with `output_mode=content` to find hardcoded colors
   - Use Grep: `pattern="(padding|margin|width|height):\s*[0-9]+px"` to find hardcoded spacing
   - Check if values should use theme tokens or Tailwind utilities

2. **Check Import Patterns**
   - Use Grep: `pattern="from ['\"](\.\./|src/)"` to find non-aliased imports
   - Verify all imports use `@/` alias for consistency

3. **Validate TypeScript Usage**
   - Use Grep: `pattern="(props|Props)\s*:\s*any"` to find untyped props
   - Use Read on changed component files to verify interface definitions exist

4. **Check Accessibility Patterns**
   - Use Grep: `pattern="<div.*onClick"` to find divs used as buttons
   - Use Grep: `pattern="<img(?![^>]*alt=)"` to find images without alt attributes
   - Use Grep: `pattern="<button[^>]*>(\s*<(svg|Icon)"` to find potential icon buttons needing ARIA labels

### Phase 4: Compile and Analyze All Findings

Combine results from automated tests and code analysis:

1. **Read Test Results**
   - Use Read: Load `test-results/design-review-report.json`
   - Extract findings by severity: blockers, high, medium, low

2. **Analyze Code Review Findings**
   - Categorize grep findings by severity:
     - Hardcoded colors/spacing → Medium priority
     - Missing TypeScript types → High priority
     - Accessibility violations → Blocker or High
     - Import patterns → Low priority

3. **Cross-Reference with Design Principles**
   - Compare findings against design-principles.md requirements
   - Note violations of core design tenets

### Phase 5: Generate Comprehensive Report

Create a structured markdown report with the following format:

---

## Design Review Report

**Review Date**: [Current date]
**Reviewed By**: Claude Code (design-review agent)
**Changed Files**: [List of modified files]
**Affected Pages/Components**: [List of impacted areas]

### Executive Summary

[2-3 sentence overview of changes and overall assessment]

### Findings by Severity

#### 🔴 Blockers (Must fix before merge)
- [Critical issues that violate core design principles or accessibility requirements]

#### 🟡 High Priority (Should fix before merge)
- [Important issues affecting UX, consistency, or best practices]

#### 🟠 Medium Priority (Fix when possible)
- [Minor inconsistencies or nice-to-have improvements]

#### ⚪ Nitpicks (Optional polish)
- [Very minor suggestions for perfection]

### What Works Well ✅

[List 2-4 positive aspects of the implementation]

### Detailed Findings

[For each finding, provide:]
- **Issue**: Clear description
- **Location**: File path and line number if applicable
- **Impact**: Why this matters for users
- **Screenshot**: If visual issue (include screenshot at 1440px)
- **Suggestion**: How to address (not prescriptive, but helpful guidance)

### Accessibility Checklist Results

[Table with checklist items and pass/fail status]

### Responsive Design Verification

- **Mobile (375px)**: [Pass/Fail with notes]
- **Tablet (768px)**: [Pass/Fail with notes]
- **Desktop (1440px)**: [Pass/Fail with notes]

### Recommendations

[2-4 actionable next steps prioritized by impact]

---

## Communication Guidelines

- **Constructive Tone**: Assume good intent, focus on improvement opportunities
- **Specific & Actionable**: Point to exact files/lines, explain impact, suggest fixes
- **Evidence-Based**: Reference screenshots, code snippets, design principles doc
- **Prioritized**: Triage findings so developer knows what matters most
- **Educational**: Explain *why* something matters, don't just say "fix this"

## Tools Required

- **Bash**: For git commands (`git status`, `git diff`), dev server management, and running Playwright tests
- **Read**: For reviewing code files, design principles, test results, and screenshots
- **Grep**: For searching patterns across the codebase (hardcoded values, anti-patterns, accessibility issues)
- **Glob**: For finding related component files (optional, primarily use git diff)
- **Playwright** (via Bash): Automated browser testing at multiple viewports with screenshot capture

## Example Usage

```
User: /design-review
```

The skill will then execute:
1. **Git Analysis**: Run `git status` and `git diff` to identify changed files
2. **Route Detection**: Parse file paths to determine affected routes
3. **Load Standards**: Read design-principles.md for evaluation criteria
4. **Automated Testing**: Execute `npx playwright test tests/design-review.spec.ts` for each route
5. **Code Analysis**: Run Grep searches for hardcoded values, accessibility issues, type problems
6. **Compile Results**: Read JSON test results and combine with code analysis findings
7. **Generate Report**: Create comprehensive markdown report with severity-categorized findings

**Expected Output**:
- Structured report with blockers, high, medium, and low priority findings
- Screenshots referenced from test-results/
- Specific file paths and line numbers for code issues
- Actionable recommendations prioritized by impact

## Notes

- **Automated Testing**: The skill runs actual Playwright tests, not just manual inspection
- **Screenshot Evidence**: All visual findings should reference generated screenshots
- **Design Principles**: Always cross-reference findings with design-principles.md standards
- **Constructive Tone**: Be thorough but constructive - explain *why* issues matter
- **Prioritization**: Triage findings by severity so developers know what's critical
- **User Impact**: Focus on how issues affect the learning experience, not just code aesthetics
- **Dev Server**: Tests automatically start the dev server if not running (port 5173)
- **JSON Output**: Test results are saved to `test-results/design-review-report.json` for programmatic analysis
