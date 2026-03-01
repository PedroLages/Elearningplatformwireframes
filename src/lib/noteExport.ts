import type { Note } from '@/data/types'
import { allCourses } from '@/data/courses'

// ─── HTML → Markdown conversion ──────────────────────────────
// TipTap stores notes as structured HTML. This converts to clean Markdown
// without needing a DOM parser (regex-based for the well-known TipTap tags).

/** Convert TipTap HTML content to clean Markdown. */
export function htmlToMarkdown(html: string): string {
  if (!html) return ''

  let md = html

  // Pre/code blocks (must come before inline code)
  md = md.replace(/<pre><code(?:\s+class="[^"]*")?>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    return '\n```\n' + decodeEntities(code).trim() + '\n```\n'
  })

  // Headings (h1-h6)
  for (let level = 6; level >= 1; level--) {
    const prefix = '#'.repeat(level)
    md = md.replace(
      new RegExp(`<h${level}[^>]*>(.*?)<\\/h${level}>`, 'gi'),
      (_, text) => `\n${prefix} ${cleanInline(text).trim()}\n`
    )
  }

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const inner = cleanInline(content.replace(/<\/?p[^>]*>/gi, '').trim())
    return '\n> ' + inner + '\n'
  })

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n')

  // Ordered lists
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, items) => {
    let idx = 0
    return (
      '\n' +
      items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, text: string) => {
        idx++
        return `${idx}. ${cleanInline(text).trim()}\n`
      })
    )
  })

  // Unordered lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, items) => {
    return (
      '\n' +
      items.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        (_: string, text: string) => `- ${cleanInline(text).trim()}\n`
      )
    )
  })

  // Images (before links to avoid collision)
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
  md = md.replace(/<img[^>]+alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)')
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*\/?>/gi, '![]($1)')

  // Timestamp links (video:// protocol) — preserve the display text as-is
  md = md.replace(/<a[^>]+href="video:\/\/[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, '$1')

  // Regular links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')

  // Inline formatting (order matters: bold+italic before individual)
  md = md.replace(/<strong><em>([\s\S]*?)<\/em><\/strong>/gi, '***$1***')
  md = md.replace(/<em><strong>([\s\S]*?)<\/strong><\/em>/gi, '***$1***')
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
  md = md.replace(/<s>([\s\S]*?)<\/s>/gi, '~~$1~~')
  md = md.replace(/<del>([\s\S]*?)<\/del>/gi, '~~$1~~')
  md = md.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')

  // Paragraphs → double newline
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => {
    const cleaned = text.trim()
    return cleaned ? cleaned + '\n\n' : ''
  })

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n')

  // Strip any remaining HTML tags
  md = md.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  md = decodeEntities(md)

  // Normalize whitespace: collapse multiple blank lines, trim
  md = md.replace(/\n{3,}/g, '\n\n').trim()

  return md
}

function cleanInline(html: string): string {
  let s = html
  s = s.replace(/<strong><em>([\s\S]*?)<\/em><\/strong>/gi, '***$1***')
  s = s.replace(/<em><strong>([\s\S]*?)<\/strong><\/em>/gi, '***$1***')
  s = s.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
  s = s.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
  s = s.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
  s = s.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
  s = s.replace(/<s>([\s\S]*?)<\/s>/gi, '~~$1~~')
  s = s.replace(/<del>([\s\S]*?)<\/del>/gi, '~~$1~~')
  s = s.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
  s = s.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
  s = s.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/?p[^>]*>/gi, '')
  s = s.replace(/<[^>]*>/g, '')
  return decodeEntities(s)
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// ─── YAML frontmatter generation ──────────────────────────────

function escapeYaml(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
}

/** Generate YAML frontmatter block for a note. */
export function generateFrontmatter(note: Note, courseName: string, lessonTitle: string): string {
  const lines: string[] = ['---']

  lines.push(`title: "${escapeYaml(lessonTitle)}"`)
  lines.push(`course: "${escapeYaml(courseName)}"`)
  lines.push(`video: "${escapeYaml(lessonTitle)}"`)

  if (note.tags.length > 0) {
    lines.push('tags:')
    for (const tag of note.tags) {
      lines.push(`  - ${tag}`)
    }
  } else {
    lines.push('tags: []')
  }

  if (note.timestamp != null) {
    lines.push(`timestamp: ${note.timestamp}`)
  }

  lines.push(`created: "${note.createdAt}"`)
  lines.push(`updated: "${note.updatedAt}"`)
  lines.push('---')

  return lines.join('\n') + '\n'
}

// ─── Full note-to-markdown ────────────────────────────────────

/** Convert a full Note to a complete Markdown document with frontmatter. */
export function noteToMarkdown(note: Note, courseName: string, lessonTitle: string): string {
  const frontmatter = generateFrontmatter(note, courseName, lessonTitle)
  const body = htmlToMarkdown(note.content)
  return frontmatter + '\n' + body + '\n'
}

// ─── Filename sanitization ────────────────────────────────────

/** Sanitize a string for use as a filename. */
export function sanitizeFilename(name: string): string {
  if (!name.trim()) return 'untitled'

  let sanitized = name
    .replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g, '-') // Replace illegal chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-{2,}/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens

  // Truncate to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.slice(0, 100).replace(/-+$/, '')
  }

  return sanitized || 'untitled'
}

// ─── Course/lesson name lookups ─────────────────────────────

function buildLookups() {
  const courseNames = new Map<string, string>()
  const lessonTitles = new Map<string, string>()
  for (const course of allCourses) {
    courseNames.set(course.id, course.shortTitle || course.title)
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        lessonTitles.set(lesson.id, lesson.title)
      }
    }
  }
  return { courseNames, lessonTitles }
}

const lookups = buildLookups()

export function getCourseName(courseId: string): string {
  return lookups.courseNames.get(courseId) ?? courseId
}

export function getLessonTitle(videoId: string): string {
  return lookups.lessonTitles.get(videoId) ?? videoId
}

// ─── Export result type ──────────────────────────────────────

export interface ExportResult {
  exported: number
  failed: Array<{ noteId: string; reason: string }>
  totalBytes: number
}

// ─── Export orchestration ────────────────────────────────────

/** Build a filename for an exported note. */
function buildFilename(note: Note): string {
  const courseName = getCourseName(note.courseId)
  const lessonTitle = getLessonTitle(note.videoId)
  return sanitizeFilename(`${courseName}-${lessonTitle}`) + '.md'
}

/** Convert a note to its export file { name, content }. */
function noteToFile(note: Note): { name: string; content: string } {
  const courseName = getCourseName(note.courseId)
  const lessonTitle = getLessonTitle(note.videoId)
  return {
    name: buildFilename(note),
    content: noteToMarkdown(note, courseName, lessonTitle),
  }
}

/** Trigger a browser download from a Blob. */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  // Clean up after a tick
  setTimeout(() => {
    URL.revokeObjectURL(url)
    a.remove()
  }, 100)
}

/** Export a single note as a .md file download. */
export function exportSingleNote(note: Note): ExportResult {
  const file = noteToFile(note)
  const blob = new Blob([file.content], { type: 'text/markdown;charset=utf-8' })
  triggerDownload(blob, file.name)
  return { exported: 1, failed: [], totalBytes: blob.size }
}

/** Export multiple notes. Single note → .md, multiple → .zip. */
export async function exportNotes(notes: Note[], zipFilename = 'notes-export.zip'): Promise<ExportResult> {
  if (notes.length === 0) {
    return { exported: 0, failed: [], totalBytes: 0 }
  }

  if (notes.length === 1) {
    return exportSingleNote(notes[0])
  }

  // Multiple notes → ZIP bundle (dynamic import to avoid blocking page load)
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const result: ExportResult = { exported: 0, failed: [], totalBytes: 0 }
  const usedNames = new Map<string, number>()

  for (const note of notes) {
    try {
      const file = noteToFile(note)
      // Handle duplicate filenames
      let finalName = file.name
      const count = usedNames.get(finalName) ?? 0
      if (count > 0) {
        finalName = file.name.replace('.md', `-${count}.md`)
      }
      usedNames.set(file.name, count + 1)

      zip.file(finalName, file.content)
      result.exported++
      result.totalBytes += new TextEncoder().encode(file.content).byteLength
    } catch {
      result.failed.push({ noteId: note.id, reason: 'Conversion failed' })
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  triggerDownload(blob, zipFilename)

  // Use actual ZIP size for totalBytes
  result.totalBytes = blob.size
  return result
}

/** Export notes filtered by course. */
export async function exportNotesByCourse(
  notes: Note[],
  courseId: string
): Promise<ExportResult> {
  const filtered = notes.filter(n => n.courseId === courseId)
  const courseName = getCourseName(courseId)
  return exportNotes(filtered, `${sanitizeFilename(courseName)}-notes.zip`)
}
