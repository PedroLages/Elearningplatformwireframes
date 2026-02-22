import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'
import { migrateBookmarksFromLocalStorage } from '@/lib/bookmarks'

// Fire-and-forget: migrate any legacy localStorage bookmarks to IndexedDB
migrateBookmarksFromLocalStorage()

createRoot(document.getElementById('root')!).render(<App />)
