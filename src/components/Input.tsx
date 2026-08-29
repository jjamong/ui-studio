import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  size?: InputSize
  icon?: ReactNode
  rightIcon?: ReactNode
}

const sizeClass: Record<InputSize, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-3.5 text-base',
}

/** 공용 텍스트 인풋. label/error를 함께 표준화해서 다룬다. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, size = 'md', icon, rightIcon, className, id, disabled, ...props }, ref) => {
    const reactId = useId()
    const inputId = id ?? reactId

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--ds-text-subtle)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-2.5 flex items-center text-[var(--ds-text-subtle)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={clsx(
              'w-full rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
              sizeClass[size],
              icon && 'pl-8',
              rightIcon && 'pr-8',
              error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-2.5 flex items-center text-[var(--ds-text-subtle)]">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-2xs text-[var(--ds-text-danger)]">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
