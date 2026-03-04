import { useEffect, useRef } from 'react'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

interface UseIdleDetectionOptions {
  onIdle: () => void
  onActive: () => void
  onActivity: () => void  // Every user interaction
}

export function useIdleDetection({ onIdle, onActive, onActivity }: UseIdleDetectionOptions) {
  const isIdleRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // If was idle, mark as active
      if (isIdleRef.current) {
        isIdleRef.current = false
        onActive()
      }

      onActivity()

      // Start new 5min timeout
      timeoutRef.current = setTimeout(() => {
        if (!isIdleRef.current) {
          isIdleRef.current = true
          onIdle()
        }
      }, IDLE_TIMEOUT_MS)
    }

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'wheel']

    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    resetTimer()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [onIdle, onActive, onActivity])
}
