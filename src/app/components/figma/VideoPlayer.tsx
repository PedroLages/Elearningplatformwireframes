import { useRef, useEffect, useCallback } from "react"
import { AspectRatio } from "../ui/aspect-ratio"

interface VideoPlayerProps {
  src: string
  title?: string
  initialPosition?: number
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
}

export function VideoPlayer({
  src,
  title,
  initialPosition,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasRestoredPosition = useRef(false)

  useEffect(() => {
    hasRestoredPosition.current = false
  }, [src])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current && initialPosition && !hasRestoredPosition.current) {
      videoRef.current.currentTime = initialPosition
      hasRestoredPosition.current = true
    }
  }, [initialPosition])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime)
    }
  }, [onTimeUpdate])

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-black">
      <AspectRatio ratio={16 / 9}>
        <video
          ref={videoRef}
          src={src}
          title={title}
          controls
          className="h-full w-full object-contain"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
        >
          Your browser does not support the video element.
        </video>
      </AspectRatio>
    </div>
  )
}
