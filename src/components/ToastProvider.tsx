import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export interface ToastOptions {
  text: string
  type?: 'success' | 'error' | 'info'
  /** ms. 0이면 자동으로 사라지지 않는다(사용자가 직접 닫아야 함). 기본 3000. */
  duration?: number
}

interface ToastEntry {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const colorClass = {
  success: 'border-[var(--ds-border-success)] bg-[var(--ds-background-success)] text-[var(--ds-text-success)]',
  error: 'border-[var(--ds-border-danger)] bg-[var(--ds-background-danger)] text-[var(--ds-text-danger)]',
  info: 'border-[var(--ds-border-information)] bg-[var(--ds-background-information)] text-[var(--ds-text-information)]',
} as const

const icon = { success: CheckCircle2, error: AlertCircle, info: Info } as const

let nextId = 0

/**
 * 화면 어디서든 useToast().showToast(...)로 토스트를 띄울 수 있게 해주는 프로바이더.
 * 단일 statusMessage 하나만 다루는 Toast 컴포넌트와 달리, 여러 개를 동시에 스택으로 쌓아
 * 보여주고 duration이 지나면 자동으로 사라진다. 앱 최상단에서 한 번만 감싸서 쓴다.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ text, type = 'info', duration = 3000 }: ToastOptions) => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, text, type }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed left-1/2 top-6 z-[var(--ds-z-toast)] flex w-full max-w-lg -translate-x-1/2 flex-col gap-2 px-4">
        {toasts.map((toast) => {
          const Icon = icon[toast.type]
          return (
            <div
              key={toast.id}
              className={clsx(
                'pointer-events-auto flex items-start gap-2.5 rounded border p-3.5 shadow-[var(--ds-shadow-overlay)]',
                colorClass[toast.type],
              )}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 whitespace-pre-wrap text-sm font-medium leading-relaxed">{toast.text}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                aria-label="닫기"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

/** ToastProvider 내부에서 showToast(...)로 토스트를 띄운다. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast는 ToastProvider 안에서만 쓸 수 있습니다.')
  return ctx
}
