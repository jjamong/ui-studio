import type { ReactNode } from 'react'
import { Inbox, SearchX } from 'lucide-react'

export type EmptyStateVariant = 'search' | 'data'

export interface EmptyStateProps {
  /** 'search'(검색/필터 결과 없음) | 'data'(데이터 자체 없음) — 지정하면 icon/title 기본값을 채운다. */
  variant?: EmptyStateVariant
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
}

const variantDefaults: Record<EmptyStateVariant, { icon: ReactNode; title: ReactNode }> = {
  search: { icon: <SearchX size={32} />, title: '검색 결과가 없습니다' },
  data: { icon: <Inbox size={32} />, title: '등록된 항목이 없습니다' },
}

/**
 * 목록/검색 결과가 없을 때 공통으로 쓰는 빈 상태 화면. variant로 흔한 두 상황(검색 결과 없음/
 * 데이터 없음)의 기본 아이콘·제목을 채우고, icon/title을 직접 넘기면 그 값이 우선한다
 * (Alert의 type처럼 variant 하나로 자주 쓰는 조합을 미리 채워주는 방식).
 */
export function EmptyState({ variant, icon, title, description, action }: EmptyStateProps) {
  const defaults = variant ? variantDefaults[variant] : undefined
  const resolvedIcon = icon ?? defaults?.icon
  const resolvedTitle = title ?? defaults?.title

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {resolvedIcon && <div className="mb-1 text-[var(--ds-text-subtlest)]">{resolvedIcon}</div>}
      <p className="text-sm text-[var(--ds-text)]">{resolvedTitle}</p>
      {description && <p className="max-w-sm text-xs text-[var(--ds-text-subtle)]">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
