import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export type AlertType = 'success' | 'error' | 'info'

export interface AlertProps {
  type?: AlertType
  title?: ReactNode
  children: ReactNode
  onClose?: () => void
}

const colorClass: Record<AlertType, string> = {
  success: 'border-[var(--ds-border-success)] bg-[var(--ds-background-success)] text-[var(--ds-text-success)]',
  error: 'border-[var(--ds-border-danger)] bg-[var(--ds-background-danger)] text-[var(--ds-text-danger)]',
  info: 'border-[var(--ds-border-information)] bg-[var(--ds-background-information)] text-[var(--ds-text-information)]',
}

const icon: Record<AlertType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

/**
 * 화면 고정 위치가 아니라 레이아웃 흐름 안에 자리 잡는 공용 인라인 알림.
 * 잠깐 떴다 사라지는 Toast와 달리, 닫기 전까지(또는 조건이 유지되는 동안) 계속 보인다.
 */
export function Alert({ type = 'info', title, children, onClose }: AlertProps) {
  const Icon = icon[type]

  return (
    <div className={clsx('flex items-start gap-2.5 rounded border p-3.5', colorClass[type])}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
          aria-label="닫기"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
