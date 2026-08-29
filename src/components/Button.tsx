import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  loading?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--ds-background-brand-bold)] text-[var(--ds-text-inverse)] hover:bg-[var(--ds-background-brand-bold-hovered)]',
  secondary:
    'bg-[var(--ds-background-neutral)] text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
  danger:
    'bg-[var(--ds-background-danger)] text-[var(--ds-text-danger)] hover:bg-[var(--ds-background-danger-hovered)]',
  ghost: 'bg-transparent text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-6 px-2 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-9 px-3.5 text-base gap-2',
}

const spinnerSizeClass: Record<ButtonSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

/** 공용 버튼. variant로 액션 성격(주/보조/위험/보조아이콘)을 표현한다. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading = false, disabled, type = 'button', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          variantClass[variant],
          sizeClass[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={clsx(spinnerSizeClass[size], 'animate-spin')} />
        ) : (
          icon
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
