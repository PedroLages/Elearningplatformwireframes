import { Video, FileText, Music, Image, FileCode } from "lucide-react"
import type { ResourceType } from "@/data/types"

const config: Record<ResourceType, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: "Video", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  pdf: { icon: FileText, label: "PDF", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  audio: { icon: Music, label: "Audio", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  image: { icon: Image, label: "Image", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  markdown: { icon: FileCode, label: "Notes", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
}

interface ResourceBadgeProps {
  type: ResourceType
  count?: number
}

export function ResourceBadge({ type, count }: ResourceBadgeProps) {
  const { icon: Icon, label, color } = config[type]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      <Icon className="h-3 w-3" />
      {count !== undefined ? `${count} ${label}${count !== 1 ? "s" : ""}` : label}
    </span>
  )
}
