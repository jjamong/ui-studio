import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/**
 * 공용 상세/편집 모달. 목록(그리드) 행 클릭으로 열어 상세 확인·수정·삭제를 처리할 때 쓴다.
 * 그리드 행 자체에는 삭제 버튼을 두지 않고, 삭제 액션은 이 모달의 footer에 두는 패턴을 권장한다.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[var(--ds-z-modal)] flex items-center justify-center bg-[var(--ds-blanket)] p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]">
        <div className="flex items-center justify-between border-b border-[var(--ds-border)] px-5 py-4">
          <h2 className="text-base font-bold text-[var(--ds-text)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="flex items-center justify-between gap-2 border-t border-[var(--ds-border)] px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
