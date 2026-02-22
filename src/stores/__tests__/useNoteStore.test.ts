import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from 'react'
import Dexie from 'dexie'
import type { Note } from '@/data/types'

let useNoteStore: (typeof import('@/stores/useNoteStore'))['useNoteStore']

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: crypto.randomUUID(),
    courseId: 'course-1',
    videoId: 'lesson-1',
    content: 'Test note content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    ...overrides,
  }
}

beforeEach(async () => {
  await Dexie.delete('ElearningDB')
  vi.resetModules()
  const mod = await import('@/stores/useNoteStore')
  useNoteStore = mod.useNoteStore
})

describe('useNoteStore initial state', () => {
  it('should have empty initial state', () => {
    const state = useNoteStore.getState()
    expect(state.notes).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })
})

describe('addNote', () => {
  it('should add a note optimistically', async () => {
    const note = makeNote({ content: 'My first note' })
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })

    const state = useNoteStore.getState()
    expect(state.notes).toHaveLength(1)
    expect(state.notes[0].content).toBe('My first note')
    expect(state.error).toBeNull()
  })

  it('should persist note to IndexedDB', async () => {
    const note = makeNote()
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })

    const { db } = await import('@/db')
    const stored = await db.notes.get(note.id)
    expect(stored).toBeDefined()
    expect(stored!.content).toBe(note.content)
  })
})

describe('saveNote', () => {
  it('should upsert an existing note', async () => {
    const note = makeNote({ content: 'Original' })
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })

    const updated = { ...note, content: 'Updated', updatedAt: new Date().toISOString() }
    await act(async () => {
      await useNoteStore.getState().saveNote(updated)
    })

    const state = useNoteStore.getState()
    expect(state.notes).toHaveLength(1)
    expect(state.notes[0].content).toBe('Updated')
  })

  it('should add a new note if ID does not exist', async () => {
    const note = makeNote({ content: 'Brand new' })
    await act(async () => {
      await useNoteStore.getState().saveNote(note)
    })

    expect(useNoteStore.getState().notes).toHaveLength(1)
    expect(useNoteStore.getState().notes[0].content).toBe('Brand new')
  })

  it('should persist upsert to IndexedDB', async () => {
    const note = makeNote({ content: 'Before update' })
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })

    const updated = { ...note, content: 'After update' }
    await act(async () => {
      await useNoteStore.getState().saveNote(updated)
    })

    const { db } = await import('@/db')
    const stored = await db.notes.get(note.id)
    expect(stored!.content).toBe('After update')
  })
})

describe('deleteNote', () => {
  it('should remove note from state optimistically', async () => {
    const note = makeNote()
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })
    expect(useNoteStore.getState().notes).toHaveLength(1)

    await act(async () => {
      await useNoteStore.getState().deleteNote(note.id)
    })
    expect(useNoteStore.getState().notes).toHaveLength(0)
  })

  it('should remove note from IndexedDB', async () => {
    const note = makeNote()
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })

    await act(async () => {
      await useNoteStore.getState().deleteNote(note.id)
    })

    const { db } = await import('@/db')
    const stored = await db.notes.get(note.id)
    expect(stored).toBeUndefined()
  })
})

describe('loadNotes', () => {
  it('should load all notes from IndexedDB', async () => {
    const { db } = await import('@/db')
    const note1 = makeNote({ content: 'Note 1', videoId: 'v1' })
    const note2 = makeNote({ content: 'Note 2', videoId: 'v2' })
    await db.notes.bulkAdd([note1, note2])

    await act(async () => {
      await useNoteStore.getState().loadNotes()
    })

    expect(useNoteStore.getState().notes).toHaveLength(2)
    expect(useNoteStore.getState().isLoading).toBe(false)
  })
})

describe('loadNotesByCourse', () => {
  it('should load only notes for specified course', async () => {
    const { db } = await import('@/db')
    const note1 = makeNote({ courseId: 'c1', videoId: 'v1' })
    const note2 = makeNote({ courseId: 'c2', videoId: 'v2' })
    await db.notes.bulkAdd([note1, note2])

    await act(async () => {
      await useNoteStore.getState().loadNotesByCourse('c1')
    })

    expect(useNoteStore.getState().notes).toHaveLength(1)
    expect(useNoteStore.getState().notes[0].courseId).toBe('c1')
  })
})

describe('getNoteForLesson', () => {
  it('should return matching note from state', async () => {
    const note = makeNote({ courseId: 'c1', videoId: 'v1', content: 'Target' })
    await act(async () => {
      await useNoteStore.getState().addNote(note)
    })

    const result = useNoteStore.getState().getNoteForLesson('c1', 'v1')
    expect(result).toBeDefined()
    expect(result!.content).toBe('Target')
  })

  it('should return undefined for no match', () => {
    const result = useNoteStore.getState().getNoteForLesson('c1', 'nonexistent')
    expect(result).toBeUndefined()
  })
})
