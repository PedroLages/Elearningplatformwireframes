# Design Review Workflow

Automated design quality assurance for the e-learning platform. Ensures UI/UX consistency, accessibility compliance, and adherence to design standards through Claude Code agents and Playwright browser automation.

## Overview

This workflow provides comprehensive design reviews that catch issues before they reach production:

- **Visual Consistency**: Validates design system adherence (colors, spacing, typography)
- **Responsive Design**: Tests mobile (375px), tablet (768px), and desktop (1440px) layouts
- **Accessibility**: Ensures WCAG 2.1 AA+ compliance (contrast, keyboard nav, ARIA)
- **Component Interactions**: Verifies hover, focus, active, and disabled states
- **Code Quality**: Reviews React/TypeScript best practices and Tailwind usage

## Features

### ✨ Dual Execution Modes

1. **On-Demand Reviews**: Run `/design-review` in Claude Code for instant feedback
2. **Automated PR Reviews**: GitHub Actions automatically reviews UI changes in pull requests

### 🎯 Severity-Triaged Findings

Issues categorized by impact:

- **🔴 Blockers**: Critical issues that must be fixed before merge (accessibility violations, broken layouts)
- **🟡 High Priority**: Important UX issues that should be fixed (missing states, inconsistencies)
- **🟠 Medium Priority**: Minor improvements to address when possible
- **⚪ Nitpicks**: Optional polish suggestions

### 🖼️ Live Browser Testing

Uses Playwright MCP to:
- Test actual UI in browser environment
- Capture screenshots at all viewport sizes
- Verify interactions (clicks, hovers, keyboard navigation)
- Check browser console for errors

## Quick Start

### Prerequisites

1. **Claude Code CLI** installed and configured
2. **Playwright MCP server** set up for browser automation
3. **Development server** running (`npm run dev`)
4. **Git repository** with tracked changes

### Manual Review (Recommended for Development)

```bash
# In Claude Code terminal
/design-review
```

The agent will:
1. Analyze your git diff
2. Launch Playwright browser testing
3. Test affected pages at all viewports
4. Generate comprehensive report with screenshots
5. Provide actionable, prioritized recommendations

### Automated PR Review (Production)

1. Create a pull request with UI changes
2. GitHub Actions automatically triggers design review
3. Review results posted as PR comment
4. PR labeled based on severity (`design-blocker`, `design-high-priority`)
5. Branch protection can require passing review

## Workflow Files

### Core Components

```
.claude/workflows/design-review/
├── README.md                   # This file - workflow documentation
├── design-principles.md        # E-learning platform design standards
├── agent-config.md            # Design review agent configuration
└── screenshots/               # Generated screenshots (gitignored)

.claude/skills/
└── design-review.md           # /design-review slash command skill

.github/workflows/
└── design-review.yml          # GitHub Actions automation

CLAUDE.md                      # Project instructions (design review section)
```

## Design Principles

The workflow enforces standards defined in [design-principles.md](design-principles.md). Key requirements:

### Visual Design

- **Background**: `#FAF5EE` (warm off-white) - never hardcode
- **Primary Color**: `blue-600` for CTAs and active states
- **Spacing**: 8px base grid (multiples of 0.5rem)
- **Border Radius**: `rounded-[24px]` for cards, `rounded-xl` for buttons
- **Typography**: System fonts, line-height 1.5-1.7

### Accessibility (WCAG 2.1 AA+)

- Text contrast ≥4.5:1 (3:1 for large text)
- All functionality keyboard accessible
- ARIA labels on icon-only buttons
- Semantic HTML elements
- Respect `prefers-reduced-motion`

### Responsive Design

- Mobile: 320px - 639px (single column, bottom nav)
- Tablet: 640px - 1023px (2-column grid, collapsible sidebar)
- Desktop: 1024px+ (3-4 column grid, persistent sidebar)
- Touch targets ≥44x44px on mobile

### Component States

All interactive elements require:
- Hover state (visual feedback)
- Focus state (keyboard navigation indicator)
- Active/pressed state (click feedback)
- Disabled state (reduced opacity + cursor:not-allowed)

## Review Process

### Phase 1: Preparation

1. Run `git status` and `git diff` to identify changes
2. Load design principles from `design-principles.md`
3. Review project architecture from `CLAUDE.md`
4. Determine scope (which pages/components affected)

### Phase 2: Live Testing

1. Start dev server if not running
2. Use Playwright to navigate to affected pages
3. Capture screenshots at 375px, 768px, 1440px
4. Test interactive elements (clicks, hovers, forms)
5. Check browser console for errors

### Phase 3: Visual Evaluation

- Design system token usage (no hardcoded colors/spacing)
- Typography hierarchy and consistency
- Component state definitions (hover, focus, active, disabled)
- Visual hierarchy and whitespace

### Phase 4: Accessibility Audit

- Color contrast ratios (automated + manual)
- Keyboard navigation flow
- Semantic HTML structure
- ARIA labels and roles
- Motion preferences

### Phase 5: Code Review

- React/TypeScript best practices
- Tailwind CSS utility usage
- Performance considerations
- File organization
- Import conventions

### Phase 6: UX Polish

- Loading states for async operations
- Error handling with recovery actions
- Empty states with helpful guidance
- Edge cases (long text, empty data, large datasets)

### Phase 7: Report Generation

Structured report with:
- Executive summary
- Severity-triaged findings
- Positive feedback (what works well)
- Accessibility checklist results
- Responsive design verification
- Prioritized recommendations

## Example Report

```markdown
## Design Review Report

**Review Date**: 2026-02-13
**Changed Files**: src/app/components/figma/CourseCard.tsx, src/app/pages/MyClass.tsx
**Affected Pages**: My Class

### Executive Summary

Added hover effects and progress indicators to course cards. Overall implementation is solid with good interaction feedback. Found 2 accessibility issues and 1 responsive design concern that should be addressed.

### Findings by Severity

#### 🔴 Blockers (Must fix before merge)
- **Insufficient contrast on progress text**: Progress percentage text (rgba(0,0,0,0.5)) on light background has 3.2:1 contrast ratio, below WCAG AA minimum 4.5:1
  - Location: `CourseCard.tsx:42`
  - Impact: Users with low vision cannot read completion status
  - Suggestion: Use `text-gray-900` or `text-blue-900` for sufficient contrast

#### 🟡 High Priority (Should fix before merge)
- **Missing keyboard focus indicators on card hover**: Cards have hover effects but no visible focus outline for keyboard navigation
  - Location: `CourseCard.tsx:15`
  - Impact: Keyboard users cannot see which card is focused
  - Suggestion: Add `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`

#### 🟠 Medium Priority (Fix when possible)
- **Small touch targets on mobile**: Category badge is 32px tall, below recommended 44px minimum
  - Location: `CourseCard.tsx:58`
  - Impact: Difficult to tap on mobile devices
  - Suggestion: Increase padding to `py-2` or `py-2.5`

#### ⚪ Nitpicks (Optional)
None

### What Works Well ✅
- Smooth hover transitions with proper easing (200ms ease-out)
- Clear visual hierarchy with course title, instructor, and progress
- Progress bar animation provides excellent feedback
- Responsive grid layout adapts beautifully across breakpoints

### Accessibility Checklist
- [ ] Contrast ratios: ❌ (progress text below 4.5:1)
- [x] Hover states: ✅
- [ ] Focus indicators: ❌ (missing on cards)
- [x] Semantic HTML: ✅ (article, heading structure)
- [x] ARIA labels: ✅ (progress bar properly labeled)

### Responsive Design Verification
- Mobile (375px): ⚠️ Touch targets too small on badges
- Tablet (768px): ✅ Perfect 2-column layout
- Desktop (1440px): ✅ Clean 3-column grid with consistent spacing

### Recommendations
1. Fix contrast issue on progress text (blocker)
2. Add keyboard focus indicators to cards (high priority)
3. Increase touch target size on mobile badges (medium priority)
4. Consider adding skeleton loading states for course images
```

## GitHub Actions Setup

### Required Secrets

Add to repository settings → Secrets and variables → Actions:

```
ANTHROPIC_API_KEY = your_claude_api_key
```

### Branch Protection (Optional)

Configure branch protection to require design review:

1. Go to Settings → Branches → Branch protection rules
2. Add rule for `main` or `develop`
3. Enable "Require status checks to pass"
4. Select "Design Review Status" check
5. Save changes

Now PRs with design blockers cannot be merged.

### Labels

Create these labels in your repository:

- `design-review` (color: #0E8A16) - All PRs with UI changes
- `design-blocker` (color: #D73A4A) - Critical issues found
- `design-high-priority` (color: #FFC107) - Important issues found

## Usage Examples

### Example 1: Quick Component Check

```bash
# After modifying a button component
git add src/app/components/ui/button.tsx
/design-review

# Agent reviews just the button changes
# Provides feedback on states, accessibility, Tailwind usage
```

### Example 2: Full Page Review

```bash
# After building new Courses page
git add src/app/pages/Courses.tsx src/app/components/figma/CourseCard.tsx
/design-review

# Agent tests entire page flow
# Verifies responsive layout, accessibility, interactions
# Screenshots at all breakpoints
```

### Example 3: Pre-PR Validation

```bash
# Before creating PR
git add .
/design-review

# Fix all blockers and high priority issues
# Re-run review to confirm fixes
/design-review

# Create PR with confidence
gh pr create --title "Add course filtering" --body "✅ Design review passed"
```

## Customization

### Adjust Review Focus

Edit [design-review.md](../../skills/design-review.md) to customize review phases:

```markdown
# Focus more on accessibility
### Phase 4: Accessibility Audit (Extended)
- Add color blindness simulation
- Test with screen reader
- Validate ARIA relationships
- Check focus trap in modals
```

### Add Project-Specific Checks

Update [design-principles.md](design-principles.md) with your standards:

```markdown
## Brand-Specific Requirements
- Logo must appear on all pages
- Course difficulty badges: Green (Beginner), Blue (Intermediate), Purple (Advanced)
- Animations must complete within 300ms
```

### Modify Severity Thresholds

Edit [agent-config.md](agent-config.md) severity matrix:

```markdown
**🔴 Blocker**:
- All WCAG AA violations (was: critical only)
- Any hardcoded colors (was: design system violations)
- Missing loading states (was: medium priority)
```

## Troubleshooting

### "Playwright not found"

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install chromium

# Or install Playwright MCP server
# (Follow Playwright MCP setup guide)
```

### "Design principles file not found"

```bash
# Verify file exists
ls .claude/workflows/design-review/design-principles.md

# If missing, file should be in version control
git checkout .claude/workflows/design-review/design-principles.md
```

### "Dev server not running"

```bash
# Start dev server in background
npm run dev &

# Wait for server to be ready
npx wait-on http://localhost:5173
```

### GitHub Actions failing

```bash
# Check workflow logs in GitHub
# Common issues:
# 1. ANTHROPIC_API_KEY not set
# 2. Playwright browsers not installed
# 3. Build failing before review runs

# Test workflow locally with act
npm install -g act
act pull_request -j design-review
```

## Best Practices

### For Developers

1. **Run reviews early**: Use `/design-review` during development, not just before PR
2. **Fix blockers first**: Address critical issues before medium/low priority items
3. **Learn from feedback**: Review design-principles.md to internalize standards
4. **Include screenshots**: Add generated screenshots to PR descriptions
5. **Iterate quickly**: Use agent feedback → fix → re-review cycle

### For Teams

1. **Consistent standards**: Keep design-principles.md updated as design system evolves
2. **Review the reviewers**: Adjust severity thresholds based on team priorities
3. **Celebrate quality**: Acknowledge PRs that pass with no issues
4. **Share learnings**: Discuss recurring issues in team meetings
5. **Automate enforcement**: Use branch protection to require passing reviews

### For Maintainers

1. **Update dependencies**: Keep Playwright and Claude Code versions current
2. **Monitor API usage**: Track Claude API costs for automated reviews
3. **Refine prompts**: Improve agent instructions based on review quality
4. **Archive screenshots**: Clean up old screenshots to save storage
5. **Document exceptions**: Record cases where standards don't apply

## Performance & Cost

### API Usage

- **On-demand review**: ~5-10K tokens per review (depends on changes size)
- **PR automation**: Same, triggered on qualifying PRs
- **Monthly estimate**: ~100 reviews × 7.5K tokens = 750K tokens ≈ $1-3/month

### Time Savings

- **Manual design review**: 30-60 minutes per PR
- **Automated review**: 2-3 minutes per PR
- **Time saved**: ~27-57 minutes per PR
- **ROI**: Pays for itself after ~5-10 PRs per month

## Resources

### Documentation

- [Design Principles](design-principles.md) - Full design standards reference
- [Agent Configuration](agent-config.md) - Design review agent setup
- [Slash Command Skill](../../skills/design-review.md) - `/design-review` implementation
- [CLAUDE.md](../../../CLAUDE.md) - Project instructions with design review integration

### External References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Playwright Documentation](https://playwright.dev/)
- [React Accessibility](https://react.dev/learn/accessibility)

### Similar Workflows

- [Code Review Workflow](https://github.com/OneRedOak/claude-code-workflows/tree/main/code-review)
- [Security Review Workflow](https://github.com/OneRedOak/claude-code-workflows/tree/main/security-review)

## Contributing

To improve this workflow:

1. **Report issues**: Open GitHub issues for bugs or unclear documentation
2. **Suggest enhancements**: Propose new review phases or checks
3. **Share examples**: Contribute example reports or edge cases
4. **Update principles**: Submit PRs to refine design standards
5. **Improve automation**: Optimize GitHub Actions for speed or cost

## License

MIT License - Free to use and modify for your projects.

## Support

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check CLAUDE.md and design-principles.md first
- **Community**: Share experiences with Claude Code design reviews

---

**Version**: 1.0.0
**Created**: 2026-02-13
**Last Updated**: 2026-02-13
**Maintained By**: E-Learning Platform Team
