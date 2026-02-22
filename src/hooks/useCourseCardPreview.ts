import { useState, useEffect, useRef, useCallback } from 'react'
import { useHoverPreview } from './useHoverPreview'

export function useCourseCardPreview() {
  const { active: previewActive, handlers: previewHandlers } = useHoverPreview(1000)
  const [videoReady, setVideoReady] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showPreview = previewActive && !prefersReducedMotion

  useEffect(() => {
    if (!showPreview) setVideoReady(false)
  }, [showPreview])

  // Radix Popover calls onOpenChange(false) on pointerdown (before click).
  // We register a one-shot capture-phase click listener on document so the
  // subsequent click is swallowed globally — regardless of which element
  // the user clicked (same card, different card, sidebar link, etc.).
  const infoOpenRef = useRef(false)
  infoOpenRef.current = infoOpen

  const handleInfoOpenChange = useCallback((open: boolean) => {
    if (!open && infoOpenRef.current) {
      const swallow = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
      }
      document.addEventListener('click', swallow, { capture: true, once: true })
      // Safety: remove listener if no click arrives (e.g. Escape key dismiss)
      setTimeout(() => {
        document.removeEventListener('click', swallow, { capture: true })
      }, 300)
    }
    setInfoOpen(open)
  }, [])

  return {
    showPreview,
    videoReady,
    setVideoReady,
    previewHandlers,
    previewOpen,
    setPreviewOpen,
    infoOpen,
    setInfoOpen: handleInfoOpenChange,
  } as const
}
