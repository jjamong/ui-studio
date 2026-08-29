import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export interface ToastMessage {
  text: string
  type: 'success' | 'error' | 'info'
}

export interface ToastProps {
  statusMessage: ToastMessage | null
  setStatusMessage: (msg: null) => void
}

const colorClass: Record<ToastMessage['type'], string> = {
  success: 'border-[var(--ds-border-success)] bg-[var(--ds-background-success)] text-[var(--ds-text-success)]',
  error: 'border-[var(--ds-border-danger)] bg-[var(--ds-background-danger)] text-[var(--ds-text-danger)]',
  info: 'border-[var(--ds-border-information)] bg-[var(--ds-background-information)] text-[var(--ds-text-information)]',
}

const icon: Record<ToastMessage['type'], typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

/** 화면 상단 고정형 공용 토스트 알림. */
export function Toast({ statusMessage, setStatusMessage }: ToastProps) {
  if (!statusMessage) return null
  const Icon = icon[statusMessage.type]

  return (
    <div
      className={clsx(
        'fixed left-1/2 top-6 z-[100] flex w-full max-w-lg -translate-x-1/2 items-start gap-2.5 rounded border p-3.5 shadow-[var(--ds-shadow-overlay)]',
        colorClass[statusMessage.type],
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 whitespace-pre-wrap text-sm font-medium leading-relaxed">{statusMessage.text}</p>
      <button
        type="button"
        onClick={() => setStatusMessage(null)}
        className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
        aria-label="닫기"
      >
        <X size={14} />
      </button>
    </div>
  )
}
