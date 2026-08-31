import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export type BadgeVariant = 'neutral' | 'brand' | 'danger' | 'success' | 'information'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  icon?: ReactNode
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--ds-background-neutral)] text-[var(--ds-text-subtle)]',
  brand: 'bg-[var(--ds-background-accent-blue-subtle)] text-[var(--ds-text-information)]',
  danger: 'bg-[var(--ds-background-danger)] text-[var(--ds-text-danger)]',
  success: 'bg-[var(--ds-background-success)] text-[var(--ds-text-success)]',
  information: 'bg-[var(--ds-background-information)] text-[var(--ds-text-information)]',
}

/** 짧은 라벨/상태를 표시하는 공용 배지. */
export function Badge({ variant = 'neutral', icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  )
}
