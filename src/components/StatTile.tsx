import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { TrendBadge } from './TrendBadge'
import type { TrendDirection } from './TrendBadge'

export interface StatTileTrend {
  direction: TrendDirection
  /** "+2.4%", "-1,200"처럼 이미 부호/단위가 포함된 표시값. */
  value: string
  invert?: boolean
}

export interface StatTileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  label: ReactNode
  value: ReactNode
  /** 값 아래에 붙는 보조 설명(예: "전월 대비", "최근 7일 합계"). */
  description?: ReactNode
  icon?: ReactNode
  trend?: StatTileTrend
}

/** 숫자 하나로 요약되는 지표(KPI)를 라벨+값+증감으로 보여주는 카드형 타일. 대시보드 상단 통계 로우에 여러 개를 나란히 쓴다. */
export function StatTile({ label, value, description, icon, trend, className, ...props }: StatTileProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-2 rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface)] p-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--ds-text-subtle)]">{label}</span>
        {icon && <span className="text-[var(--ds-text-subtlest)]">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-xl font-bold text-[var(--ds-text)]">{value}</span>
        {trend && <TrendBadge direction={trend.direction} value={trend.value} invert={trend.invert} />}
      </div>
      {description && <span className="text-2xs text-[var(--ds-text-subtlest)]">{description}</span>}
    </div>
  )
}
