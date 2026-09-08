import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { TrendDirection } from './TrendBadge'

export interface TrendTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  direction: TrendDirection
  /** "+2.4%", "-1,200"처럼 이미 부호/단위가 포함된 표시값. */
  value: string
  /** true면 상승이 위험색, 하락이 성공색으로 뒤집힌다. 원자재/비용/리스크처럼 내려가야 좋은 지표에 쓴다. */
  invert?: boolean
  /** 방향 아이콘을 값 앞에 붙인다. 테이블 셀처럼 좁은 공간에서는 기본값(false)으로 생략한다. */
  showIcon?: boolean
}

const textClassByDirection: Record<TrendDirection, string> = {
  up: 'text-[var(--ds-text-success)]',
  down: 'text-[var(--ds-text-danger)]',
  flat: 'text-[var(--ds-text-subtle)]',
}

const invertedTextClassByDirection: Record<TrendDirection, string> = {
  up: 'text-[var(--ds-text-danger)]',
  down: 'text-[var(--ds-text-success)]',
  flat: 'text-[var(--ds-text-subtle)]',
}

const iconByDirection: Record<TrendDirection, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

/** 증감률/증감폭을 배경 없이 색상 텍스트로만 표시. 테이블 셀처럼 TrendBadge의 pill이 과한 자리에 쓴다. */
export function TrendText({ direction, value, invert = false, showIcon = false, className, ...props }: TrendTextProps) {
  const textClass = (invert ? invertedTextClassByDirection : textClassByDirection)[direction]
  const Icon = iconByDirection[direction]

  return (
    <span className={clsx('inline-flex items-center gap-1 text-sm font-medium', textClass, className)} {...props}>
      {showIcon && <Icon size={12} />}
      {value}
    </span>
  )
}
