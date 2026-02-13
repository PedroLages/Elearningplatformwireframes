import { useState } from "react"
import { FileText, ExternalLink } from "lucide-react"
import { Button } from "../ui/button"

interface PdfViewerProps {
  src: string
  title?: string
}

export function PdfViewer({ src, title }: PdfViewerProps) {
  const [loadError, setLoadError] = useState(false)

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted p-12">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {title || "PDF Document"}
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          Unable to preview this document inline
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(src, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in New Tab
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {title || "Document"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(src, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      <iframe
        src={src}
        title={title || "PDF Viewer"}
        className="h-[600px] w-full border-0"
        onError={() => setLoadError(true)}
      />
    </div>
  )
}
