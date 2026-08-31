import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface ContentAreaProps {
  children: ReactNode
  className?: string
}

/**
 * 메인 콘텐츠 영역의 공용 컨테이너(둥근 좌상단 모서리 + 패딩). 페이지 안에서 이 안을 또
 * `rounded`/`border`/`shadow`로 감싸는 이중 라운딩은 피한다 — 그리드/차트/패널은 이 안에
 * 바로 배치한다.
 */
export function ContentArea({ children, className }: ContentAreaProps) {
  return <div className={clsx('min-h-full rounded-tl-2xl bg-[var(--ds-surface)] p-4', className)}>{children}</div>
}
