import { useState, useEffect, useCallback, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { Trash2, Plus, Minus } from 'lucide-react'
import { cn } from '@/app/components/ui/utils'

interface TableContextMenuProps {
  editor: Editor
  children: React.ReactNode
}

export function TableContextMenu({ editor, children }: TableContextMenuProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('td, th') && editor.isActive('table')) {
        event.preventDefault()

        const menuWidth = 208 // w-52 = 13rem = 208px
        const menuHeight = 320 // approximate height
        const x = Math.min(event.clientX, window.innerWidth - menuWidth - 8)
        const y = Math.min(event.clientY, window.innerHeight - menuHeight - 8)

        setPosition({ x, y })
        setVisible(true)
      }
    },
    [editor]
  )

  useEffect(() => {
    if (!visible) return

    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [visible])

  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible])

  const runAction = useCallback(
    (action: () => void) => {
      action()
      setVisible(false)
    },
    []
  )

  const menuItems = [
    {
      label: 'Add Row Above',
      icon: Plus,
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: 'Add Row Below',
      icon: Plus,
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    { separator: true },
    {
      label: 'Add Column Left',
      icon: Plus,
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: 'Add Column Right',
      icon: Plus,
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    { separator: true },
    {
      label: 'Delete Row',
      icon: Minus,
      action: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: 'Delete Column',
      icon: Minus,
      action: () => editor.chain().focus().deleteColumn().run(),
    },
    { separator: true },
    {
      label: 'Delete Table',
      icon: Trash2,
      action: () => editor.chain().focus().deleteTable().run(),
      destructive: true,
    },
  ]

  return (
    <div onContextMenu={handleContextMenu}>
      {children}

      {visible && (
        <div
          ref={menuRef}
          data-testid="table-context-menu"
          className="bg-popover shadow-lg border border-border rounded-xl py-1 px-1 w-52 z-50"
          style={{ position: 'fixed', left: position.x, top: position.y }}
        >
          {menuItems.map((item, index) => {
            if ('separator' in item && item.separator) {
              return <div key={`sep-${index}`} className="h-px bg-border my-1" />
            }

            const { label, icon: Icon, action, destructive } = item as {
              label: string
              icon: typeof Plus
              action: () => void
              destructive?: boolean
            }

            return (
              <button
                key={label}
                type="button"
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left cursor-pointer transition-colors hover:bg-accent rounded-md',
                  destructive && 'text-destructive'
                )}
                style={{ minHeight: '44px' }}
                onClick={() => runAction(action)}
              >
                <Icon className="size-4" />
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
