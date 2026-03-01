import { useState, useMemo } from 'react'
import { Download, FileText, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { Label } from '@/app/components/ui/label'
import { exportNotes, exportNotesByCourse, type ExportResult } from '@/lib/noteExport'
import { allCourses } from '@/data/courses'
import type { Note } from '@/data/types'

type ExportScope = 'all' | string // 'all' or a courseId

interface ExportNotesDialogProps {
  notes: Note[]
}

export function ExportNotesDialog({ notes }: ExportNotesDialogProps) {
  const [open, setOpen] = useState(false)
  const [scope, setScope] = useState<ExportScope>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [result, setResult] = useState<ExportResult | null>(null)

  // Determine which courses have notes
  const coursesWithNotes = useMemo(() => {
    const courseIds = [...new Set(notes.map(n => n.courseId))]
    return courseIds
      .map(id => {
        const course = allCourses.find(c => c.id === id)
        return {
          id,
          name: course?.shortTitle ?? course?.title ?? id,
          noteCount: notes.filter(n => n.courseId === id).length,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [notes])

  const handleExport = async () => {
    setIsExporting(true)
    setResult(null)
    try {
      const exportResult =
        scope === 'all'
          ? await exportNotes(notes)
          : await exportNotesByCourse(notes, scope)
      setResult(exportResult)
    } catch {
      setResult({ exported: 0, failed: [{ noteId: 'unknown', reason: 'Export failed' }], totalBytes: 0 })
    } finally {
      setIsExporting(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      // Reset state when closing
      setScope('all')
      setResult(null)
      setIsExporting(false)
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const hasNotes = notes.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-testid="export-notes-button"
        >
          <Download className="size-3.5 mr-1.5" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="export-notes-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" aria-hidden="true" />
            Export Notes
          </DialogTitle>
          <DialogDescription>
            Export your notes as Markdown files with metadata.
          </DialogDescription>
        </DialogHeader>

        {!hasNotes ? (
          <p className="text-sm text-muted-foreground py-4">No notes to export. Start taking notes while watching lessons.</p>
        ) : result ? (
          // ─── Export summary ──────────────────────────────────
          <div data-testid="export-summary" className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-success">
              <Check className="size-5" />
              <span className="font-medium">Export complete</span>
            </div>
            <div className="text-sm space-y-1">
              <p>{result.exported} {result.exported === 1 ? 'note' : 'notes'} exported</p>
              <p className="text-muted-foreground">Total size: {formatSize(result.totalBytes)}</p>
            </div>
            {result.failed.length > 0 && (
              <div className="text-sm text-destructive space-y-1">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="size-4" />
                  <span>{result.failed.length} {result.failed.length === 1 ? 'note' : 'notes'} failed to export</span>
                </div>
                {result.failed.map((f) => (
                  <p key={f.noteId} className="text-xs pl-6">{f.reason}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          // ─── Export options ──────────────────────────────────
          <div className="space-y-4 py-2">
            <RadioGroup value={scope} onValueChange={setScope} aria-label="Export scope">
              <div className="flex items-center space-x-2 min-h-[44px]">
                <RadioGroupItem value="all" id="scope-all" />
                <Label htmlFor="scope-all" className="cursor-pointer">
                  All notes ({notes.length})
                </Label>
              </div>
              {coursesWithNotes.map(course => (
                <div key={course.id} className="flex items-center space-x-2 min-h-[44px]">
                  <RadioGroupItem value={course.id} id={`scope-${course.id}`} />
                  <Label htmlFor={`scope-${course.id}`} className="cursor-pointer">
                    {course.name} ({course.noteCount})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          ) : (
            <Button
              data-testid="confirm-export"
              onClick={handleExport}
              disabled={isExporting || !hasNotes}
            >
              {isExporting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin motion-reduce:animate-none" />
                  Exporting…
                </>
              ) : (
                <>
                  <Download className="size-3.5 mr-1.5" />
                  Export {scope === 'all' ? `${notes.length} notes` : 'selected notes'}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
