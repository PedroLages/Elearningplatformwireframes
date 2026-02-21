import { useEffect, useState, useRef } from 'react'
import { Button } from '@/app/components/ui/button'

interface AutoAdvanceCountdownProps {
  seconds: number
  nextLessonTitle: string
  onAdvance: () => void
  onCancel: () => void
}

export function AutoAdvanceCountdown({
  seconds,
  nextLessonTitle,
  onAdvance,
  onCancel,
}: AutoAdvanceCountdownProps) {
  const [remaining, setRemaining] = useState(seconds)
  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance

  // Single stable interval — no deps on remaining or callbacks
  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [seconds])

  // Fire advance when countdown reaches 0
  useEffect(() => {
    if (remaining <= 0) {
      onAdvanceRef.current()
    }
  }, [remaining])

  return (
    <div
      data-testid="auto-advance-countdown"
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 px-4 py-3"
    >
      <p className="text-sm text-blue-700 dark:text-blue-300">
        Next: <span className="font-medium">{nextLessonTitle}</span> in{' '}
        <span className="font-bold tabular-nums">{remaining}s</span>
      </p>
      <Button variant="outline" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
