---
stepsCompleted: ['step-01-init', 'step-02-domain-analysis', 'step-03-competitive-landscape', 'step-04-regulatory-focus', 'step-05-technical-trends', 'step-06-research-synthesis']
inputDocuments: ['CLAUDE.md', 'docs/planning-artifacts/prd.md', 'docs/research/feature-research-2026-02-21.md']
workflowType: 'research'
research_type: 'domain'
research_topic: 'LMS / Personal Learning Dashboards'
research_goals: 'Identify domain-specific FRs, NFRs, and compliance requirements for edtech'
user_name: 'Pedro'
date: '2026-02-28'
web_research_enabled: true
source_verification: true
---

# Domain Research: LMS / Personal Learning Dashboards

**Date:** 2026-02-28
**Author:** Pedro
**Research Type:** Domain
**Method:** 6 parallel web research agents covering spaced repetition, learning analytics, content standards, edtech accessibility, learning science/UX, and data portability

---

## Research Overview

This research identifies domain-specific requirements, standards, and best practices for a personal learning dashboard (LevelUp). Six parallel research threads covered:

1. **Spaced Repetition Standards** — SM-2, FSRS, Leitner, retrieval practice research
2. **Learning Analytics Standards** — xAPI, LRS, Caliper, KPI frameworks
3. **Content Format & Interoperability** — LTI, SCORM, Common Cartridge, cmi5, H5P, WebVTT
4. **EdTech Accessibility** — WCAG 2.2, Section 508, EN 301 549, VPAT, video/PDF/cognitive accessibility
5. **Learning Science & UX Patterns** — Spacing effect, retrieval practice, SDT, goal-setting, streak psychology
6. **Data Portability & Privacy** — xAPI export, Open Badges, CLR, GDPR, FERPA, local-first AI

---

## 1. Spaced Repetition & Knowledge Retention

### Key Algorithms

| Algorithm | Origin | Complexity | Best For |
|-----------|--------|-----------|----------|
| **SM-2** | SuperMemo 1987 | Low | Simple note review; 6-point quality scale |
| **Leitner** | 1970s | Very Low | Visual box-based progression; fixed intervals |
| **FSRS** | 2024+ (Anki default) | Medium | Accurate scheduling; 21 ML-tuned parameters |

### FSRS Core Model (Recommended)

Three variables: **Difficulty** (1-10), **Stability** (days for R to drop to 90%), **Retrievability** (current recall probability 0-1).

Forgetting curve: `R(t, S) = (1 + t/(9*S))^(-1)`

Default initial stability by grade: Again=0.21d, Hard=1.29d, Good=2.31d, Easy=8.30d.

**Desired retention** is the single user-facing parameter (default 0.90, recommended 0.85 for notes).

TypeScript implementation available: `ts-fsrs` npm package.

### Retrieval Practice Research

- Roediger & Karpicke (2006): Practice testing = 80% recall after 1 week vs. 36% re-study (d=0.50)
- Cepeda et al. (2008): Optimal spacing gap ≈ 10-20% of desired retention period
- Ebbinghaus: 67% forgotten after 1 day, 79% after 31 days without review

### Adaptation for Note Review (Not Flashcards)

- Use 3 grades: Hard / Good / Easy (not 6-point scale)
- No hard reset on "fail" — halve interval instead
- Starting intervals: 1, 3, 7 days (not SM-2's 1, 6)
- Maximum interval: 90-180 days (course notes lose context beyond 6 months)
- Add ±5-10% fuzz to prevent review clustering

### Closest Existing Model: Obsidian Spaced Repetition Plugin

Schedules entire notes (not flashcards) for review. Stores scheduling data in YAML frontmatter. Uses modified SM-2 with 3 grades. PageRank-weighted initial ease based on linked notes.

---

## 2. Learning Analytics Standards

### xAPI (Experience API)

**Statement structure**: Actor + Verb + Object (+ Result + Context)

Key verbs for personal learning: `experienced`, `completed`, `progressed`, `commented`, `earned`, `suspended`

**Local-first pattern**: Generate xAPI-compatible JSON → store in IndexedDB → query locally → export when needed. No server LRS required.

### Learning Analytics KPIs

| Metric | Formula | Threshold |
|--------|---------|-----------|
| Active Study Time | Session time minus idle (>2min no interaction) | Track trend |
| Completion Velocity | Modules completed per week (rolling) | Declining = alert |
| Session Quality | activeRatio×40 + focusScore×30 + lengthBonus×15 + breakBonus×15 | 0-100 |
| Engagement Health | Composite of frequency/duration/velocity trends | 5 levels |
| Predicted Retention | R = e^(-t/S) per Ebbinghaus model | <50% = review due |

### Engagement Decay Detection

| Signal | Threshold | Action |
|--------|-----------|--------|
| Frequency drop | <50% of baseline (2-week rolling) | Yellow alert |
| Consecutive inactive days | >3 (daily learners) or >7 (weekly) | Red alert |
| Session shortening | >30% decrease (4-week rolling) | Yellow alert |
| Completion stall | 0 completions in 14 days with >0 sessions | Content difficulty alert |
| Velocity decay | Negative 3+ consecutive weeks | Trend alert |

### IMS Caliper: Not Relevant

Institutional-scale, requires consortium membership. xAPI covers all personal learning use cases.

### IEEE Learning Technology Standards

- **IEEE 1484.12.1-2020 (LOM)**: Metadata schema for learning objects. Cherry-pick `Educational` category fields (difficulty, typicalLearningTime, interactivityType).
- **IEEE P2881**: Modernizes LOM for informal/micro-learning. Directly relevant but still in development.

---

## 3. Content Format & Interoperability Standards

### Relevance Ratings

| Standard | Relevance | Rationale |
|----------|-----------|-----------|
| **xAPI statement format** | HIGH | Internal activity tracking model; future export |
| **WebVTT** | HIGH | Video captions/transcripts; WCAG requirement |
| **Schema.org Course** | HIGH | JSON-LD maps to TypeScript; import/export |
| **Dublin Core** | HIGH | Minimum metadata schema (15 elements) |
| **SCORM** | MEDIUM | Huge content library; `scorm-again` npm handles runtime |
| **Common Cartridge** | MEDIUM | Standard LMS export format for course structures |
| **H5P** | MEDIUM | Rich interactive content; Lumi React components |
| **HLS + hls.js** | MEDIUM | Adaptive streaming for video content |
| **cmi5** | MEDIUM | xAPI profile for LMS content launch |
| **IEEE LOM** | MEDIUM | Educational metadata fields |
| **LTI 1.3** | LOW | Institutional integration; not personal tool use case |
| **MPEG-DASH** | LOW | HLS covers most cases |

### Content Import Priority

Phase 1: xAPI data model + Dublin Core metadata + WebVTT captions
Phase 2: SCORM import + H5P playback + Common Cartridge
Phase 3: HLS streaming + cmi5 + LTI 1.3

---

## 4. EdTech Accessibility Standards

### WCAG 2.2 (October 2023) — New Criteria for Learning Platforms

**Level A MUST**:
- SC 3.2.6 Consistent Help: Help mechanism in same position on every page
- SC 3.3.7 Redundant Entry: Auto-populate previously entered data in multi-step flows

**Level AA MUST**:
- SC 2.4.11 Focus Not Obscured: Focused elements not hidden by sticky headers/floating UI
- SC 2.5.7 Dragging Movements: Single-pointer alternative for all drag interactions
- SC 2.5.8 Target Size (Minimum): Interactive targets ≥24×24 CSS pixels
- SC 3.3.8 Accessible Authentication: No cognitive function tests for auth

### Section 508 & EAA

- Section 508 incorporates WCAG 2.0 AA; procurement increasingly demands WCAG 2.1/2.2 AA
- European Accessibility Act effective June 28, 2025 — e-learning platforms in scope
- VPAT/ACR increasingly mandatory for educational procurement by 2026
- April 2026 Title II ADA deadline for state/local government edtech

### Video Accessibility (MUST)

- Captions: 99% accuracy, ≤200ms sync (FCC standard)
- SRT/VTT sidecar file support for local videos
- Audio description or text alternative for visual-only content (WCAG 1.2.5 AA)
- Keyboard controls: Space/Enter=play/pause, arrows=seek/volume, M=mute, C=captions, F=fullscreen, Esc=exit

### PDF Accessibility

- Tagged PDF structure passthrough to screen readers
- Reading order preservation
- Keyboard navigation through pages
- Zoom without horizontal scrolling

### Cognitive Accessibility (COGA)

- Consistent navigation order across all pages
- Confirmation dialogs for destructive actions
- Plain language in UI copy
- Progress indicators with text equivalents (not just visual bars)
- Chunked content with clear visual hierarchy

### Chart/Data Visualization Accessibility

- Alt text for simple charts; data table alternative for complex charts
- Color not sole differentiator (use patterns/labels)
- SVG `<title>` + `<desc>` elements
- Minimum 3:1 contrast for graphical objects (WCAG 1.4.11)

---

## 5. Learning Science & UX Patterns

### Evidence-Based Principles (Tier 1 — Strongest Evidence)

| Principle | Effect Size | Source |
|-----------|------------|--------|
| **Spacing Effect** | d=0.42-0.97 | Cepeda et al. 2006 meta-analysis (254 studies) |
| **Retrieval Practice** | d=0.50 | Rowland 2014 meta-analysis (159 studies) |
| **Goal Setting** (specific) | d=0.42-0.80 | Locke & Latham 2002 (1000+ studies) |
| **Implementation Intentions** | d=0.65 | Gollwitzer 1999 |
| **Multimedia** (words+pictures) | d=1.39 | Mayer 2009 |

### Motivation Framework: Self-Determination Theory

Three needs: **Autonomy** (choice in learning path), **Competence** (mastery indicators, growth feedback), **Relatedness** (social signals, instructor presence).

Autonomy-supportive framing increases persistence by 30% (Vansteenkiste et al. 2004, d=0.48).

### Streak Psychology

- Streak length is best predictor of 12-month retention (Duolingo data, CHI 2018)
- 30% of users report streak anxiety; mitigated by streak freezes and repair
- Reframe around "total days studied" alongside "current streak"
- Allow 2-3 rest days per week that don't break streak

### Dashboard Design Patterns (Top Platforms)

| Platform | Key Pattern |
|----------|------------|
| **Duolingo** | Streaks, XP, leagues, hearts, streak freeze |
| **Khan Academy** | Mastery progression (4 levels), activity heatmap, skill trees |
| **Coursera** | Progress rings, weekly goals, estimated time remaining |
| **Obsidian SR** | Note-level spaced review, frontmatter scheduling, PageRank ease |
| **Readwise** | Highlight resurfacing, 3 mastery tiers, recall probability half-life |
| **Forest** | Loss-aversion focus timer (virtual tree dies if you leave) |

### PKM Intersection with Course Learning

- Zettelkasten: Atomic, connected notes across courses
- Progressive Summarization: 5-layer processing depth
- Evergreen Notes: Notes revised over time as understanding deepens
- Pattern: Learning Inbox → Course Notes → Personal Knowledge Base

---

## 6. Data Portability & Privacy

### Export Format Strategy

| Format | Use Case | Audience |
|--------|----------|----------|
| **Markdown + YAML frontmatter** | Notes | Obsidian, Notion, any editor |
| **CSV** | Sessions, progress, streaks | Excel, Google Sheets |
| **JSON** | Full data export/import | Developer tools, migration |
| **xAPI JSON-LD** | Learning records | LRS systems, institutional transfer |
| **Open Badges v3.0** | Achievements | Badge wallets, LinkedIn |
| **CLR v2.0** | Comprehensive record | Institutional credentialing |
| **SQLite/IndexedDB backup** | Complete database | Power users, backup/restore |

### Open Badges v3.0

Self-issued badges are valid. Uses W3C Verifiable Credentials. Badge categories: streaks, completion, volume, skill-based, meta-learning. Can be "baked" into PNG/SVG for sharing.

### Privacy Compliance

| Regulation | Applies? | Key Requirement |
|-----------|----------|-----------------|
| **GDPR Art. 20** | Yes (EU users) | Machine-readable export in structured format |
| **FERPA** | No (personal tool) | Follow spirit for trust |
| **COPPA** | No (if 13+ only) | Terms of use age statement |
| **CalOPPA** | If cloud features added | Privacy policy |

### AI Data Minimization

- Send aggregates/summaries to cloud AI, never raw personal notes
- Local-first AI options: WebLLM (browser via WebGPU), ONNX Runtime Web, Transformers.js
- Each AI feature needs its own consent toggle
- Prefer APIs with no-training guarantees (Anthropic)

### Data Sovereignty Checklist

- All data stored locally (IndexedDB/OPFS)
- Full data export in open, documented formats
- Full data deletion with one action
- No telemetry without explicit opt-in
- Schema versioned with automatic migrations
- Export includes schema documentation
- Import capability (round-trip fidelity)

---

## Domain Requirements Summary

### Functional Requirements to Add (FR80+)

1. **Spaced Note Review**: Schedule notes for review using evidence-based spacing algorithms (FSRS or modified SM-2) with 3-grade rating (Hard/Good/Easy)
2. **Review Queue Dashboard**: Surface notes due for review with predicted retention percentage
3. **Knowledge Retention Indicators**: Display forgetting curve position per topic/course
4. **Engagement Decay Detection**: Alert when study frequency, session duration, or completion velocity decline below thresholds
5. **Session Quality Scoring**: Rate study sessions on active time ratio, focus density, and optimal length adherence
6. **Data Export (Multi-Format)**: Export all learning data as JSON, CSV, and Markdown
7. **xAPI-Compatible Activity Log**: Log learning activities using Actor+Verb+Object structure for future interoperability
8. **Open Badges Achievement Export**: Export earned achievements as Open Badges v3.0 JSON
9. **WebVTT Caption Support**: Load SRT/VTT caption files alongside local video content
10. **Content Metadata Schema**: Store course metadata using Dublin Core + Schema.org Course fields
11. **Study Goal Setting**: Allow specific, measurable weekly/daily study goals with progress tracking
12. **Streak Freeze Mechanic**: Allow configurable rest days that don't break study streak
13. **Interleaved Review Mode**: Mixed review across multiple courses/topics for enhanced retention
14. **Learning Activity Heatmap**: GitHub-style contribution calendar showing study consistency

### Non-Functional Requirements to Add (NFR57+)

1. **WCAG 2.2 AA Compliance**: Meet all WCAG 2.2 Level AA success criteria including 2.4.11 Focus Not Obscured, 2.5.7 Dragging Movements, 2.5.8 Target Size
2. **Video Player Keyboard Accessibility**: Full keyboard operation with standard bindings (Space=play/pause, arrows=seek/volume, M=mute, C=captions)
3. **Caption Synchronization**: Captions synchronized within 200ms of corresponding audio (FCC standard)
4. **Progress Indicator ARIA**: All progress elements use role="progressbar" with aria-valuenow/min/max and visible text equivalents
5. **Chart Accessibility**: Charts include alt text, data table alternatives, and non-color-dependent differentiation
6. **Cognitive Accessibility**: Consistent navigation order, confirmation for destructive actions, plain language, chunked content
7. **Data Portability (GDPR Art. 20)**: Full data export in structured, machine-readable format within 30 seconds
8. **Data Sovereignty**: All learning data stored locally; no server-side data transmission without explicit user consent per feature
9. **Schema Versioning**: All data schemas versioned with non-destructive automatic migrations
10. **AI Data Minimization**: Cloud AI features send only aggregated/anonymized data; each AI feature has independent consent toggle
11. **Export Round-Trip Fidelity**: Exported data can be re-imported with ≥95% fidelity (no semantic data loss)
12. **Reduced Motion Support**: All animations respect prefers-reduced-motion media query (WCAG 2.3.3)

---

## Sources

### Spaced Repetition
- [SuperMemo SM-2 Specification](https://super-memory.com/english/ol/sm2.htm)
- [FSRS Algorithm Wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [ts-fsrs npm](https://www.npmjs.com/package/ts-fsrs)
- [Obsidian SR Algorithms](https://stephenmwangi.com/obsidian-spaced-repetition/algorithms/)
- [Readwise Algorithm](https://docs.readwise.io/readwise/docs/faqs/reviewing-highlights)

### Learning Analytics
- [xAPI Statements 101](https://xapi.com/statements-101/)
- [xAPI Spec - Data Model](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md)
- [IEEE LTSC](https://sagroups.ieee.org/ltsc/)
- [Learning Analytics as Metacognitive Tool (ResearchGate)](https://www.researchgate.net/publication/262932713)

### Content Standards
- [1EdTech LTI 1.3](https://www.1edtech.org/standards/lti/why-adopt-lti-1p3)
- [SCORM Technical Overview](https://scorm.com/scorm-explained/technical-scorm/)
- [scorm-again npm](https://www.npmjs.com/package/scorm-again)
- [cmi5 Overview](https://xapi.com/cmi5/)
- [H5P Specification](https://h5p.org/specification)
- [Schema.org Course](https://schema.org/Course)

### Accessibility
- [WCAG 2.2 (W3C WAI)](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Section 508](https://www.section508.gov/manage/laws-and-policies/)
- [EN 301 549 (ETSI)](https://www.etsi.org/human-factors-accessibility/en-301-549-v3-the-harmonized-european-standard-for-ict-accessibility)
- [European Accessibility Act](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
- [FCC Captioning Quality Standards](https://www.3playmedia.com/blog/fccs-new-quality-standards-closed-captioning-video-programming/)

### Learning Science
- Cepeda, N. J. et al. (2006). Distributed practice. *Review of General Psychology*, 10(4).
- Roediger, H. L. & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3).
- Locke, E. A. & Latham, G. P. (2002). Goal setting. *American Psychologist*, 57(9).
- Dunlosky, J. et al. (2013). Effective learning techniques. *Psychological Science in the Public Interest*, 14(1).
- Deci, E. L. & Ryan, R. M. (2000). SDT. *Psychological Inquiry*, 11(4).

### Data Portability
- [Open Badges v3.0 (1EdTech)](https://www.imsglobal.org/spec/ob/v3p0/)
- [CLR v2.0 (1EdTech)](https://www.imsglobal.org/spec/clr/v2p0/)
- [GDPR Article 20](https://gdpr-info.eu/art-20-gdpr/)
