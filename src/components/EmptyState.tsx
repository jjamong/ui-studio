import type { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

/** 목록/검색 결과가 없을 때 공통으로 쓰는 빈 상태 화면. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {icon && <div className="mb-1 text-[var(--ds-text-subtlest)]">{icon}</div>}
      <p className="text-sm font-semibold text-[var(--ds-text)]">{title}</p>
      {description && <p className="max-w-sm text-xs text-[var(--ds-text-subtle)]">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
