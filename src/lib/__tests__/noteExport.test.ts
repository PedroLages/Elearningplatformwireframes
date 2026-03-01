import { describe, it, expect } from 'vitest'
import {
  htmlToMarkdown,
  generateFrontmatter,
  noteToMarkdown,
  sanitizeFilename,
} from '@/lib/noteExport'
import type { Note } from '@/data/types'

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note-1',
  courseId: 'course-a',
  videoId: 'video-1',
  content: '<p>Hello world</p>',
  tags: ['tag1', 'tag2'],
  createdAt: '2026-02-28T10:00:00.000Z',
  updatedAt: '2026-02-28T11:00:00.000Z',
  ...overrides,
})

// ─── 1.1 HTML → Markdown conversion ──────────────────────────

describe('htmlToMarkdown', () => {
  it('converts paragraph tags to plain text', () => {
    expect(htmlToMarkdown('<p>Hello world</p>')).toBe('Hello world')
  })

  it('converts heading tags', () => {
    expect(htmlToMarkdown('<h1>Title</h1>')).toBe('# Title')
    expect(htmlToMarkdown('<h2>Subtitle</h2>')).toBe('## Subtitle')
    expect(htmlToMarkdown('<h3>Section</h3>')).toBe('### Section')
  })

  it('converts bold and italic', () => {
    expect(htmlToMarkdown('<p><strong>bold</strong></p>')).toBe('**bold**')
    expect(htmlToMarkdown('<p><em>italic</em></p>')).toBe('*italic*')
  })

  it('converts unordered lists', () => {
    const html = '<ul><li>one</li><li>two</li></ul>'
    const md = htmlToMarkdown(html)
    expect(md).toContain('- one')
    expect(md).toContain('- two')
  })

  it('converts ordered lists', () => {
    const html = '<ol><li>first</li><li>second</li></ol>'
    const md = htmlToMarkdown(html)
    expect(md).toContain('1. first')
    expect(md).toContain('2. second')
  })

  it('converts links', () => {
    expect(htmlToMarkdown('<p><a href="https://example.com">link</a></p>')).toBe(
      '[link](https://example.com)'
    )
  })

  it('converts images', () => {
    const html = '<img src="data:image/png;base64,abc123" alt="screenshot">'
    expect(htmlToMarkdown(html)).toBe('![screenshot](data:image/png;base64,abc123)')
  })

  it('converts code blocks', () => {
    const html = '<pre><code>const x = 1</code></pre>'
    const md = htmlToMarkdown(html)
    expect(md).toContain('```')
    expect(md).toContain('const x = 1')
  })

  it('converts inline code', () => {
    expect(htmlToMarkdown('<p><code>foo</code></p>')).toBe('`foo`')
  })

  it('converts blockquotes', () => {
    expect(htmlToMarkdown('<blockquote><p>quote text</p></blockquote>')).toContain('> quote text')
  })

  it('converts horizontal rules', () => {
    expect(htmlToMarkdown('<hr>')).toContain('---')
  })

  it('preserves timestamp links as formatted text', () => {
    const html = '<a href="video://op6-lesson#t=120">[02:00]</a>'
    const md = htmlToMarkdown(html)
    expect(md).toMatch(/\[02:00\]/)
  })

  it('converts strikethrough', () => {
    expect(htmlToMarkdown('<p><s>deleted</s></p>')).toBe('~~deleted~~')
  })

  it('handles nested formatting', () => {
    expect(htmlToMarkdown('<p><strong><em>bold italic</em></strong></p>')).toBe(
      '***bold italic***'
    )
  })

  it('handles empty content gracefully', () => {
    expect(htmlToMarkdown('')).toBe('')
    expect(htmlToMarkdown('<p></p>')).toBe('')
  })
})

// ─── 1.2 YAML frontmatter generation ──────────────────────────

describe('generateFrontmatter', () => {
  it('includes all required fields', () => {
    const fm = generateFrontmatter(makeNote(), 'My Course', 'Intro Video')
    expect(fm).toContain('title: "Intro Video"')
    expect(fm).toContain('course: "My Course"')
    expect(fm).toContain('video: "Intro Video"')
    expect(fm).toContain('tags:')
    expect(fm).toContain('  - tag1')
    expect(fm).toContain('  - tag2')
    expect(fm).toContain('created: "2026-02-28T10:00:00.000Z"')
    expect(fm).toContain('updated: "2026-02-28T11:00:00.000Z"')
  })

  it('wraps frontmatter in --- delimiters', () => {
    const fm = generateFrontmatter(makeNote(), 'Course', 'Lesson')
    expect(fm.startsWith('---\n')).toBe(true)
    expect(fm.endsWith('---\n')).toBe(true)
  })

  it('handles empty tags', () => {
    const fm = generateFrontmatter(makeNote({ tags: [] }), 'Course', 'Lesson')
    expect(fm).toContain('tags: []')
  })

  it('handles timestamp metadata', () => {
    const fm = generateFrontmatter(makeNote({ timestamp: 120 }), 'Course', 'Lesson')
    expect(fm).toContain('timestamp: 120')
  })

  it('escapes double quotes and newlines in YAML values', () => {
    const fm = generateFrontmatter(makeNote(), 'Course "Alpha"', 'He said "hello"\nand left')
    expect(fm).toContain('title: "He said \\"hello\\"\\nand left"')
    expect(fm).toContain('course: "Course \\"Alpha\\""')
  })
})

// ─── 1.3 Full note-to-markdown conversion ──────────────────────

describe('noteToMarkdown', () => {
  it('combines frontmatter and body', () => {
    const result = noteToMarkdown(makeNote(), 'My Course', 'Intro Lesson')
    expect(result).toContain('---')
    expect(result).toContain('course: "My Course"')
    expect(result).toContain('Hello world')
  })

  it('handles notes with timestamps in content', () => {
    const note = makeNote({
      content: '<p><a href="video://lesson#t=120">[02:00]</a> Key concept</p>',
    })
    const result = noteToMarkdown(note, 'Course', 'Lesson')
    expect(result).toMatch(/\[02:00\]/)
    expect(result).toContain('Key concept')
  })
})

// ─── 2.4 Filename sanitization ──────────────────────────────────

describe('sanitizeFilename', () => {
  it('replaces special characters with hyphens', () => {
    expect(sanitizeFilename('Hello: World/Test')).toBe('Hello-World-Test')
  })

  it('collapses multiple hyphens', () => {
    expect(sanitizeFilename('a///b:::c')).toBe('a-b-c')
  })

  it('trims hyphens from edges', () => {
    expect(sanitizeFilename('---hello---')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(sanitizeFilename('')).toBe('untitled')
  })

  it('truncates long filenames', () => {
    const long = 'a'.repeat(300)
    expect(sanitizeFilename(long).length).toBeLessThanOrEqual(100)
  })

  it('strips control characters', () => {
    expect(sanitizeFilename('hello\x00world\x1ftest')).toBe('hello-world-test')
  })
})
