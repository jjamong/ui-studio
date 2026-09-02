import { clsx } from 'clsx'
import { Skeleton } from './Skeleton'

export interface SectionSkeletonProps {
  rows?: number
  rowHeight?: string | number
  showHeader?: boolean
  className?: string
}

/**
 * 리스트/폼 한 섹션 분량의 로딩 상태를 표현하는 공용 스켈레톤. 로우를 낱개 Skeleton으로
 * 직접 쌓는 대신 이 컴포넌트로 통일한다.
 */
export function SectionSkeleton({ rows = 3, rowHeight = '28px', showHeader = false, className }: SectionSkeletonProps) {
  return (
    <div className={clsx('flex flex-col gap-3', className)} role="status" aria-label="섹션 로딩 중">
      {showHeader && <Skeleton variant="text" width="30%" height="14px" />}
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rect" width="100%" height={rowHeight} />
        ))}
      </div>
    </div>
  )
}
