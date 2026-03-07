import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'

interface CreateChallengeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChallengeDialog({ open, onOpenChange }: CreateChallengeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Challenge</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">Form placeholder — implemented in Task 4.</p>
      </DialogContent>
    </Dialog>
  )
}
