# design-review

Comprehensive design review for front-end UI changes in the e-learning platform.

## Behavior

When invoked, conduct a thorough design review of recent UI/UX changes following this systematic process:

### Phase 1: Preparation & Context Gathering

1. **Identify Changed Files**
   - Run `git status` to see modified files
   - Run `git diff` to see all changes (both staged and unstaged)
   - Focus on `.tsx`, `.css`, and styling-related files

2. **Load Design Standards**
   - Review `.claude/workflows/design-review/design-principles.md` for project design standards
   - Review `CLAUDE.md` for component architecture and styling approach
   - Understand the design system: Tailwind v4, shadcn/ui, warm off-white background, blue-600 primary

3. **Determine Scope**
   - Identify which pages/components were modified
   - Note if changes affect: Overview, MyClass, Courses, Messages, Instructors, Reports, or Settings
   - Understand the intended functionality or feature being added/modified

### Phase 2: Live Environment Testing (with Playwright)

**CRITICAL: Use Playwright MCP for interactive testing**

1. **Launch Development Server**
   - Ensure dev server is running (`npm run dev`)
   - If not running, start it in background

2. **Navigate to Changed Pages**
   - Use Playwright to visit affected routes
   - Take screenshots at key viewports: 375px (mobile), 768px (tablet), 1440px (desktop)

3. **Test Interaction Flows**
   - Click interactive elements (buttons, cards, links)
   - Verify hover states activate properly
   - Test form inputs if applicable
   - Check for JavaScript errors in console

4. **Responsive Behavior**
   - Verify layout at mobile (375px), tablet (768px), desktop (1440px)
   - Check for horizontal scroll issues
   - Ensure touch targets are ≥44x44px on mobile
   - Verify sidebar behavior (persistent on desktop, collapsible/hidden on mobile)

### Phase 3: Visual Polish Evaluation

Using screenshots and code review:

1. **Design System Adherence**
   - [ ] Colors use theme tokens from `theme.css` (not hardcoded)
   - [ ] Spacing uses 8px base grid (multiples of 0.5rem)
   - [ ] Border radius: `rounded-[24px]` for cards, `rounded-xl` for buttons
   - [ ] Background: `#FAF5EE` maintained throughout
   - [ ] Primary CTAs use `blue-600`

2. **Typography Consistency**
   - [ ] Heading hierarchy clear (H1 > H2 > H3 > H4)
   - [ ] Line height adequate (1.5-1.7)
   - [ ] No center-aligned body text
   - [ ] Text readable at all viewport sizes

3. **Component States**
   - [ ] Hover states defined for all interactive elements
   - [ ] Focus states visible (outlines or rings)
   - [ ] Active/pressed states provide feedback
   - [ ] Disabled states clear (reduced opacity)

4. **Visual Hierarchy**
   - [ ] Important content stands out
   - [ ] Whitespace used effectively
   - [ ] Visual flow guides user attention logically

### Phase 4: Accessibility Audit (WCAG 2.1 AA+)

1. **Color Contrast**
   - [ ] Text contrast ≥4.5:1 for normal text
   - [ ] Text contrast ≥3:1 for large text (18px+ or 14px+ bold)
   - [ ] Interactive elements distinguishable beyond color alone

2. **Keyboard Navigation**
   - [ ] All functionality accessible via keyboard
   - [ ] Tab order logical and sequential
   - [ ] Focus indicators clearly visible
   - [ ] Escape key closes modals/overlays

3. **Semantic HTML & ARIA**
   - [ ] Semantic elements used correctly (nav, main, article, button vs div)
   - [ ] ARIA labels on icon-only buttons
   - [ ] Form labels properly associated with inputs
   - [ ] Alt text on meaningful images (decorative images have empty alt)

4. **Motion & Timing**
   - [ ] `prefers-reduced-motion` respected in animations
   - [ ] No auto-playing video/audio
   - [ ] No content flashing >3 times per second

### Phase 5: Code Quality Review

1. **React/TypeScript Best Practices**
   - [ ] Components are functional with hooks
   - [ ] Props have TypeScript interfaces
   - [ ] No console.error or console.warn in output
   - [ ] No unused imports or variables
   - [ ] Component names are descriptive and follow PascalCase

2. **Tailwind CSS Usage**
   - [ ] Utility classes used (no inline styles)
   - [ ] No hardcoded colors or spacing values
   - [ ] Responsive modifiers for layout changes
   - [ ] Class organization logical (layout → spacing → colors)

3. **Performance Considerations**
   - [ ] No unnecessary re-renders
   - [ ] Images optimized (appropriate sizes, modern formats)
   - [ ] Expensive operations memoized or debounced
   - [ ] Bundle size impact minimal

4. **File Organization**
   - [ ] Page components in `src/app/pages/`
   - [ ] Reusable UI in `src/app/components/ui/`
   - [ ] Custom components in `src/app/components/figma/`
   - [ ] Imports use `@/` alias

### Phase 6: UX Polish & Edge Cases

1. **Loading & Empty States**
   - [ ] Loading states for async operations
   - [ ] Empty states with helpful guidance
   - [ ] Skeleton screens or spinners for content loading

2. **Error Handling**
   - [ ] Error states defined
   - [ ] Error messages specific and actionable
   - [ ] Recovery actions available

3. **User Feedback**
   - [ ] Success confirmations for user actions
   - [ ] Form validation feedback inline and real-time
   - [ ] Tooltips for unclear icons/actions

4. **Edge Cases**
   - [ ] Long text handling (truncation, wrapping)
   - [ ] Empty data sets handled gracefully
   - [ ] Large data sets (pagination, virtualization)

### Phase 7: Report Generation

Create a structured report with the following format:

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

- Read: For reviewing code files and design principles
- Grep: For searching patterns across the codebase
- Glob: For finding related component files
- Bash: For git commands and dev server management
- Playwright MCP: For live browser testing and screenshots
- WebFetch: For checking accessibility guidelines if needed

## Example Usage

```
User: /design-review
```

The skill will then:
1. Check git status and diff
2. Review design principles document
3. Launch browser testing with Playwright
4. Conduct comprehensive review across all phases
5. Generate detailed report with prioritized findings

## Notes

- Always test in live environment when possible (Playwright)
- Reference design-principles.md throughout review
- Be thorough but constructive
- Prioritize accessibility and responsive design
- Focus on user impact, not just code style
