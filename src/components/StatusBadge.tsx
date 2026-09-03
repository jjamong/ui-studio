import type { HTMLAttributes, ReactNode } from 'react'
import { CheckCircle2, CircleDashed, Loader2, StopCircle, XCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { Badge } from './Badge'
import type { BadgeVariant } from './Badge'

export type StatusBadgeStatus = 'pending' | 'running' | 'success' | 'failed' | 'stopped'

export interface StatusBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  status: StatusBadgeStatus
  /** 기본 한글 라벨(예: "실행중") 대신 쓸 텍스트. 배치 작업엔 "완료", 실행 결과엔 "성공"처럼 문맥에 맞게 바꿔 쓴다. */
  label?: ReactNode
  /** false면 텍스트 없이 아이콘만 표시한다(예: 테이블 셀 안 실행 결과 컬럼). 접근성용 라벨은 유지된다. */
  showLabel?: boolean
}

const variantByStatus: Record<StatusBadgeStatus, BadgeVariant> = {
  pending: 'neutral',
  running: 'information',
  success: 'success',
  failed: 'danger',
  stopped: 'neutral',
}

const labelByStatus: Record<StatusBadgeStatus, string> = {
  pending: '대기',
  running: '실행중',
  success: '완료',
  failed: '실패',
  stopped: '중지',
}

const iconByStatus: Record<StatusBadgeStatus, typeof CheckCircle2> = {
  pending: CircleDashed,
  running: Loader2,
  success: CheckCircle2,
  failed: XCircle,
  stopped: StopCircle,
}

const iconTextClassByStatus: Record<StatusBadgeStatus, string> = {
  pending: 'text-[var(--ds-text-subtle)]',
  running: 'text-[var(--ds-text-information)]',
  success: 'text-[var(--ds-text-success)]',
  failed: 'text-[var(--ds-text-danger)]',
  stopped: 'text-[var(--ds-text-subtle)]',
}

/** 배치 작업 상태(실행중/중지/완료/실패)나 실행 결과(성공/실패)를 아이콘+색으로 표시하는 배지. Badge에 상태별 아이콘 매핑을 얹은 것. */
export function StatusBadge({ status, label, showLabel = true, className, ...props }: StatusBadgeProps) {
  const Icon = iconByStatus[status]
  const iconClassName = clsx(status === 'running' && 'animate-spin')
  const accessibleLabel = typeof label === 'string' ? label : labelByStatus[status]

  if (!showLabel) {
    return (
      <span
        role="img"
        aria-label={accessibleLabel}
        className={clsx('inline-flex w-fit items-center', iconTextClassByStatus[status], className)}
        {...props}
      >
        <Icon size={16} className={iconClassName} />
      </span>
    )
  }

  return (
    <Badge variant={variantByStatus[status]} icon={<Icon size={12} className={iconClassName} />} className={className} {...props}>
      {label ?? labelByStatus[status]}
    </Badge>
  )
}
