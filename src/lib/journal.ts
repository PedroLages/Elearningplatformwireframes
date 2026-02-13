const STORAGE_KEY = "study-journal"

export interface JournalEntry {
  id: string
  timestamp: string
  title: string
  content: string
  courseId?: string
  tags: string[]
}

function getAll(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function getJournalEntries(): JournalEntry[] {
  return getAll().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getJournalEntry(id: string): JournalEntry | undefined {
  return getAll().find((e) => e.id === id)
}

export function createJournalEntry(entry: Omit<JournalEntry, "id" | "timestamp">): JournalEntry {
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
  const all = getAll()
  all.push(newEntry)
  saveAll(all)
  return newEntry
}

export function updateJournalEntry(id: string, updates: Partial<Omit<JournalEntry, "id">>): JournalEntry | undefined {
  const all = getAll()
  const idx = all.findIndex((e) => e.id === id)
  if (idx === -1) return undefined
  all[idx] = { ...all[idx], ...updates }
  saveAll(all)
  return all[idx]
}

export function deleteJournalEntry(id: string): boolean {
  const all = getAll()
  const filtered = all.filter((e) => e.id !== id)
  if (filtered.length === all.length) return false
  saveAll(filtered)
  return true
}

export function searchJournalEntries(query: string): JournalEntry[] {
  const lower = query.toLowerCase()
  return getJournalEntries().filter(
    (e) =>
      e.title.toLowerCase().includes(lower) ||
      e.content.toLowerCase().includes(lower) ||
      e.tags.some((t) => t.toLowerCase().includes(lower))
  )
}
