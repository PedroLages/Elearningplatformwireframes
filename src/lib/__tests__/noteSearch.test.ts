import { describe, it, expect, beforeEach } from 'vitest'
import type { Note } from '@/data/types'
import { initializeSearchIndex, addToIndex, updateInIndex, removeFromIndex, searchNotes } from '@/lib/noteSearch'

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: crypto.randomUUID(),
    courseId: 'course-1',
    videoId: 'lesson-1',
    content: 'Default content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    ...overrides,
  }
}

beforeEach(() => {
  // Re-initialize with empty set to reset state
  initializeSearchIndex([])
})

describe('initializeSearchIndex', () => {
  it('should initialize with notes and enable search', () => {
    const notes = [
      makeNote({ id: '1', content: 'React hooks tutorial', tags: ['react', 'hooks'] }),
      makeNote({ id: '2', content: 'TypeScript generics guide', tags: ['typescript'] }),
    ]

    initializeSearchIndex(notes)

    const results = searchNotes('react')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].id).toBe('1')
  })

  it('should handle empty notes array', () => {
    initializeSearchIndex([])
    const results = searchNotes('anything')
    expect(results).toEqual([])
  })

  it('should replace previous index on re-initialization', () => {
    initializeSearchIndex([makeNote({ id: '1', content: 'Old content' })])
    initializeSearchIndex([makeNote({ id: '2', content: 'New content' })])

    const oldResults = searchNotes('Old')
    const newResults = searchNotes('New')
    expect(oldResults).toHaveLength(0)
    expect(newResults.length).toBeGreaterThan(0)
  })
})

describe('addToIndex', () => {
  it('should make new note searchable', () => {
    initializeSearchIndex([])

    addToIndex(makeNote({ id: '1', content: 'Behavioral analysis techniques' }))

    const results = searchNotes('behavioral')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].id).toBe('1')
  })
})

describe('updateInIndex', () => {
  it('should update note content in the index', () => {
    const note = makeNote({ id: '1', content: 'Original content' })
    initializeSearchIndex([note])

    updateInIndex({ ...note, content: 'Updated content about influence' })

    const oldResults = searchNotes('Original')
    const newResults = searchNotes('influence')
    expect(oldResults).toHaveLength(0)
    expect(newResults.length).toBeGreaterThan(0)
  })
})

describe('removeFromIndex', () => {
  it('should remove note from search results', () => {
    const note = makeNote({ id: '1', content: 'Removable content' })
    initializeSearchIndex([note])

    removeFromIndex('1')

    const results = searchNotes('Removable')
    expect(results).toHaveLength(0)
  })
})

describe('searchNotes', () => {
  it('should return empty array for empty query', () => {
    initializeSearchIndex([makeNote({ content: 'Something' })])
    expect(searchNotes('')).toEqual([])
    expect(searchNotes('   ')).toEqual([])
  })

  it('should support prefix search', () => {
    initializeSearchIndex([
      makeNote({ id: '1', content: 'Confidence building workshop' }),
    ])

    const results = searchNotes('confid')
    expect(results.length).toBeGreaterThan(0)
  })

  it('should boost tag matches higher than content', () => {
    initializeSearchIndex([
      makeNote({ id: 'content-match', content: 'This mentions react in the body', tags: [] }),
      makeNote({ id: 'tag-match', content: 'A general note', tags: ['react'] }),
    ])

    const results = searchNotes('react')
    expect(results.length).toBe(2)
    // Tag match should score higher due to 2x boost
    expect(results[0].id).toBe('tag-match')
  })

  it('should return results with scores', () => {
    initializeSearchIndex([makeNote({ id: '1', content: 'Operative training notes' })])

    const results = searchNotes('operative')
    expect(results[0].score).toBeGreaterThan(0)
  })
})
