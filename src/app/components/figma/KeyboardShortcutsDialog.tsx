import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog'

interface Shortcut {
  keys: string[]
  description: string
}

const shortcuts: Shortcut[] = [
  { keys: ['Cmd', 'K'], description: 'Open search' },
  { keys: ['Cmd', ','], description: 'Go to Settings' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Escape'], description: 'Close dialog / search' },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded bg-muted border border-border text-xs font-mono font-medium text-muted-foreground">
      {children}
    </kbd>
  )
}

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate the platform quickly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {shortcuts.map(shortcut => (
            <div key={shortcut.description} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={key} className="flex items-center gap-1">
                    {i > 0 && <span className="text-xs text-muted-foreground">+</span>}
                    <Kbd>{key}</Kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
