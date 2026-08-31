import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface CardProps {
  title?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

/** 공용 카드 컨테이너. 헤더(title+actions)/본문/footer 슬롯을 갖는다. */
export function Card({ title, actions, footer, children, className }: CardProps) {
  return (
    <div className={clsx('flex flex-col rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface)]', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--ds-border)] px-4 py-3">
          {title && <h3 className="text-sm font-bold text-[var(--ds-text)]">{title}</h3>}
          {actions}
        </div>
      )}
      <div className="flex-1 p-4">{children}</div>
      {footer && <div className="border-t border-[var(--ds-border)] px-4 py-3">{footer}</div>}
    </div>
  )
}
