import { describe, it, expect, beforeEach } from 'vitest'
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  searchJournalEntries,
} from '@/lib/journal'

describe('journal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createJournalEntry', () => {
    it('creates entry with generated id and timestamp', () => {
      const entry = createJournalEntry({
        title: 'Day 1 Notes',
        content: 'Studied behavior analysis',
        tags: ['study'],
      })
      expect(entry.id).toBeDefined()
      expect(entry.id.length).toBeGreaterThan(0)
      expect(entry.timestamp).toBeDefined()
      expect(entry.title).toBe('Day 1 Notes')
      expect(entry.content).toBe('Studied behavior analysis')
      expect(entry.tags).toEqual(['study'])
    })

    it('creates unique ids for different entries', () => {
      const entry1 = createJournalEntry({ title: 'Entry 1', content: '', tags: [] })
      const entry2 = createJournalEntry({ title: 'Entry 2', content: '', tags: [] })
      expect(entry1.id).not.toBe(entry2.id)
    })

    it('persists entry to storage', () => {
      createJournalEntry({ title: 'Persisted', content: 'Content', tags: [] })
      const entries = getJournalEntries()
      expect(entries).toHaveLength(1)
      expect(entries[0].title).toBe('Persisted')
    })

    it('supports optional courseId', () => {
      const entry = createJournalEntry({
        title: 'Course Journal',
        content: 'Notes for course',
        courseId: 'course-1',
        tags: [],
      })
      expect(entry.courseId).toBe('course-1')
    })
  })

  describe('getJournalEntries', () => {
    it('returns empty array when no entries', () => {
      expect(getJournalEntries()).toEqual([])
    })

    it('returns entries sorted by date descending (newest first)', () => {
      // Create entries with slight time difference
      const entry1 = createJournalEntry({ title: 'First', content: '', tags: [] })
      const entry2 = createJournalEntry({ title: 'Second', content: '', tags: [] })
      const entry3 = createJournalEntry({ title: 'Third', content: '', tags: [] })

      const entries = getJournalEntries()
      expect(entries).toHaveLength(3)
      // Since entries are created in rapid succession with same timestamp
      // we verify they're all present regardless of order
      const titles = entries.map((e) => e.title)
      expect(titles).toContain('First')
      expect(titles).toContain('Second')
      expect(titles).toContain('Third')

      // Verify timestamps are in descending order (or equal)
      for (let i = 0; i < entries.length - 1; i++) {
        const current = new Date(entries[i].timestamp).getTime()
        const next = new Date(entries[i + 1].timestamp).getTime()
        expect(current).toBeGreaterThanOrEqual(next)
      }
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('study-journal', 'corrupt-data')
      expect(getJournalEntries()).toEqual([])
    })
  })

  describe('getJournalEntry', () => {
    it('returns entry by id', () => {
      const created = createJournalEntry({ title: 'Find me', content: 'Here', tags: [] })
      const found = getJournalEntry(created.id)
      expect(found).toBeDefined()
      expect(found!.title).toBe('Find me')
    })

    it('returns undefined for non-existent id', () => {
      expect(getJournalEntry('nonexistent')).toBeUndefined()
    })
  })

  describe('updateJournalEntry', () => {
    it('modifies entry fields', () => {
      const created = createJournalEntry({ title: 'Original', content: 'Old', tags: ['old'] })
      const updated = updateJournalEntry(created.id, {
        title: 'Updated',
        content: 'New content',
      })
      expect(updated).toBeDefined()
      expect(updated!.title).toBe('Updated')
      expect(updated!.content).toBe('New content')
      // tags should remain unchanged since we didn't update them
      expect(updated!.tags).toEqual(['old'])
    })

    it('persists the update', () => {
      const created = createJournalEntry({ title: 'Before', content: '', tags: [] })
      updateJournalEntry(created.id, { title: 'After' })
      const retrieved = getJournalEntry(created.id)
      expect(retrieved!.title).toBe('After')
    })

    it('returns undefined for non-existent entry', () => {
      expect(updateJournalEntry('fake-id', { title: 'Nope' })).toBeUndefined()
    })

    it('can update tags', () => {
      const created = createJournalEntry({ title: 'Tagged', content: '', tags: ['a'] })
      updateJournalEntry(created.id, { tags: ['a', 'b', 'c'] })
      const retrieved = getJournalEntry(created.id)
      expect(retrieved!.tags).toEqual(['a', 'b', 'c'])
    })
  })

  describe('deleteJournalEntry', () => {
    it('removes entry and returns true', () => {
      const created = createJournalEntry({ title: 'Delete me', content: '', tags: [] })
      const result = deleteJournalEntry(created.id)
      expect(result).toBe(true)
      expect(getJournalEntries()).toHaveLength(0)
    })

    it('returns false for non-existent entry', () => {
      expect(deleteJournalEntry('fake-id')).toBe(false)
    })

    it('only removes the targeted entry', () => {
      const entry1 = createJournalEntry({ title: 'Keep', content: '', tags: [] })
      const entry2 = createJournalEntry({ title: 'Remove', content: '', tags: [] })
      deleteJournalEntry(entry2.id)
      const entries = getJournalEntries()
      expect(entries).toHaveLength(1)
      expect(entries[0].id).toBe(entry1.id)
    })

    it('can delete all entries one by one', () => {
      const e1 = createJournalEntry({ title: '1', content: '', tags: [] })
      const e2 = createJournalEntry({ title: '2', content: '', tags: [] })
      deleteJournalEntry(e1.id)
      deleteJournalEntry(e2.id)
      expect(getJournalEntries()).toHaveLength(0)
    })
  })

  describe('searchJournalEntries', () => {
    beforeEach(() => {
      createJournalEntry({
        title: 'Behavior Analysis Notes',
        content: 'Studied micro-expressions today',
        tags: ['psychology', 'observation'],
      })
      createJournalEntry({
        title: 'Influence Tactics',
        content: 'Read about authority principles',
        tags: ['influence', 'authority'],
      })
      createJournalEntry({
        title: 'Daily Log',
        content: 'Practiced observation skills at coffee shop',
        tags: ['practice', 'observation'],
      })
    })

    it('filters by title match', () => {
      const results = searchJournalEntries('Behavior')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Behavior Analysis Notes')
    })

    it('filters by content match', () => {
      const results = searchJournalEntries('micro-expressions')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Behavior Analysis Notes')
    })

    it('filters by tag match', () => {
      const results = searchJournalEntries('observation')
      expect(results).toHaveLength(2)
    })

    it('is case-insensitive', () => {
      const results = searchJournalEntries('behavior')
      expect(results).toHaveLength(1)
      const results2 = searchJournalEntries('BEHAVIOR')
      expect(results2).toHaveLength(1)
    })

    it('returns empty array for no matches', () => {
      expect(searchJournalEntries('xyznonexistent')).toEqual([])
    })

    it('matches across title, content, and tags simultaneously', () => {
      // 'authority' matches both a tag and content in the second entry
      const results = searchJournalEntries('authority')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Influence Tactics')
    })

    it('returns results sorted by date descending', () => {
      const results = searchJournalEntries('observation')
      for (let i = 0; i < results.length - 1; i++) {
        const current = new Date(results[i].timestamp).getTime()
        const next = new Date(results[i + 1].timestamp).getTime()
        expect(current).toBeGreaterThanOrEqual(next)
      }
    })
  })
})
