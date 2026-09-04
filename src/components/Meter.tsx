import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export type MeterVariant = 'brand' | 'neutral' | 'danger' | 'success' | 'information'

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  max?: number
  variant?: MeterVariant
  /** 바 위에 라벨과 나란히 "72%" 값을 보여줄지. */
  showValue?: boolean
  label?: ReactNode
}

const fillClassByVariant: Record<MeterVariant, string> = {
  brand: 'bg-[var(--ds-background-brand-bold)]',
  neutral: 'bg-[var(--ds-background-accent-gray-bolder)]',
  danger: 'bg-[var(--ds-background-danger)]',
  success: 'bg-[var(--ds-background-success)]',
  information: 'bg-[var(--ds-background-information)]',
}

/** 진행률/달성률/사용률처럼 최댓값 대비 현재값을 막대로 보여주는 미터. */
export function Meter({ value, max = 100, variant = 'brand', showValue = false, label, className, ...props }: MeterProps) {
  const ratio = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={clsx('flex flex-col gap-1', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2 text-2xs text-[var(--ds-text-subtle)]">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium text-[var(--ds-text)]">{Math.round(ratio)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-surface-sunken)]"
      >
        <div
          className={clsx(
            'h-full rounded-full transition-[width] duration-[var(--ds-motion-duration-base)] ease-[var(--ds-motion-ease-standard)]',
            fillClassByVariant[variant],
          )}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  )
}
