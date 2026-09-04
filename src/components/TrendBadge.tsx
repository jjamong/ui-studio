import type { HTMLAttributes } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from './Badge'
import type { BadgeVariant } from './Badge'

export type TrendDirection = 'up' | 'down' | 'flat'

export interface TrendBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  direction: TrendDirection
  /** "+2.4%", "-1,200"처럼 이미 부호/단위가 포함된 표시값. */
  value: string
  /** true면 상승이 위험색, 하락이 성공색으로 뒤집힌다. 원자재/비용/리스크처럼 내려가야 좋은 지표에 쓴다. */
  invert?: boolean
}

const variantByDirection: Record<TrendDirection, BadgeVariant> = {
  up: 'success',
  down: 'danger',
  flat: 'neutral',
}

const invertedVariantByDirection: Record<TrendDirection, BadgeVariant> = {
  up: 'danger',
  down: 'success',
  flat: 'neutral',
}

const iconByDirection: Record<TrendDirection, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

/** 증감률/증감폭을 방향 아이콘+색으로 표시하는 배지. Badge에 방향별 아이콘·색 매핑을 얹은 것. */
export function TrendBadge({ direction, value, invert = false, className, ...props }: TrendBadgeProps) {
  const variant = (invert ? invertedVariantByDirection : variantByDirection)[direction]
  const Icon = iconByDirection[direction]

  return (
    <Badge variant={variant} icon={<Icon size={12} />} className={className} {...props}>
      {value}
    </Badge>
  )
}
