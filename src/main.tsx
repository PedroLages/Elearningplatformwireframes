import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'
import { db } from '@/db'
import { migrateBookmarksFromLocalStorage } from '@/lib/bookmarks'
import { initializeSearchIndex } from '@/lib/noteSearch'
import { toast } from 'sonner'

// Fire-and-forget: migrate any legacy localStorage bookmarks to IndexedDB
migrateBookmarksFromLocalStorage()

// Initialize Dexie (triggers v4 upgrade/migration if needed), then build search index
db.open()
  .then(async () => {
    const notes = await db.notes.toArray()
    initializeSearchIndex(notes)
  })
  .catch(error => {
    console.error('[Migration] Failed:', error)
    toast.warning('Data migration incomplete. Some features may be limited.')
  })

createRoot(document.getElementById('root')!).render(<App />)
