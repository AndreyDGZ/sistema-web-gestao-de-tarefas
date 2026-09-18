import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface DrawerProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Drawer({ title, isOpen, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="task-drawer-title" onMouseDown={event => event.stopPropagation()}>
        <div className="drawer-header">
          <h2 id="task-drawer-title">{title}</h2>
          <Button variant="ghost" type="button" aria-label="Fechar painel" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </Button>
        </div>
        {children}
      </aside>
    </div>
  )
}
