import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

/** 페이지/패널 단위 로딩 상태를 통일해서 보여주는 공용 스피너. */
export function LoadingSpinner({ message = '불러오는 중...', fullScreen = false }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-2',
        fullScreen ? 'fixed inset-0 z-50 bg-[var(--ds-blanket)]' : 'min-h-[200px] w-full py-10',
      )}
    >
      <Loader2 size={20} className="animate-spin text-[var(--ds-icon-brand)]" />
      <span className="text-sm font-medium text-[var(--ds-text-subtle)]">{message}</span>
    </div>
  )
}
