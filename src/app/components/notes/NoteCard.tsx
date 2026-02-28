import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronDown, ChevronUp, Pencil, Trash2, X, Clock } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog'
import { NoteEditor } from './NoteEditor'
import { useNoteStore } from '@/stores/useNoteStore'
import { toast } from 'sonner'
import type { Note } from '@/data/types'

interface NoteCardProps {
  note: Note
  lessonTitle: string
  courseId: string
  onDelete: (noteId: string) => void
}

/** Strip HTML tags to extract plain text for preview snippets. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

type ViewState = 'collapsed' | 'expanded' | 'editing'

export function NoteCard({ note, lessonTitle, courseId, onDelete }: NoteCardProps) {
  const [viewState, setViewState] = useState<ViewState>('collapsed')
  const saveNote = useNoteStore(s => s.saveNote)

  const preview = stripHtml(note.content)
  const snippet = preview.length > 120 ? preview.slice(0, 120) + '...' : preview

  const readOnlyEditor = useEditor({
    editable: false,
    content: note.content,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none',
      },
    },
  })

  const handleSave = async (content: string, tags: string[]) => {
    await saveNote({
      ...note,
      content,
      tags,
      updatedAt: new Date().toISOString(),
    })
    setViewState('expanded')
    toast.success('Note saved')
  }

  const handleDelete = () => {
    onDelete(note.id)
    toast.success('Note deleted')
  }

  return (
    <div className="bg-card rounded-2xl border p-4 transition-shadow hover:shadow-sm">
      {/* Collapsed view */}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setViewState(v => v === 'collapsed' ? 'expanded' : 'collapsed')}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewState(v => v === 'collapsed' ? 'expanded' : 'collapsed') } }}
        aria-expanded={viewState !== 'collapsed'}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground line-clamp-2">{snippet}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {note.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.timestamp != null && (
              <Link
                to={`/courses/${courseId}/${note.videoId}?t=${note.timestamp}&panel=notes`}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                onClick={e => e.stopPropagation()}
              >
                <Clock className="h-3 w-3" />
                {formatTimestamp(note.timestamp)}
              </Link>
            )}
            <span className="text-xs text-muted-foreground">
              {formatRelativeDate(note.updatedAt)}
            </span>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" aria-label={viewState === 'collapsed' ? 'Expand note' : 'Collapse note'}>
          {viewState === 'collapsed' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expanded view */}
      {viewState === 'expanded' && (
        <div className="mt-4 border-t pt-4">
          <EditorContent editor={readOnlyEditor} />
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setViewState('editing')}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" data-testid="delete-note-button">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The note and its search index entry will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {/* Edit mode */}
      {viewState === 'editing' && (
        <div className="mt-4 border-t pt-4">
          <div data-testid="note-editor">
            <NoteEditor
              courseId={courseId}
              lessonId={note.videoId}
              initialContent={note.content}
              onSave={handleSave}
            />
          </div>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setViewState('expanded')}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
