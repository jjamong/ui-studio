import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  size?: SelectSize
  options: SelectOption[]
}

const sizeClass: Record<SelectSize, string> = {
  sm: 'h-7 pl-2 pr-6 text-xs',
  md: 'h-8 pl-2.5 pr-7 text-sm',
  lg: 'h-9 pl-3 pr-8 text-base',
}

/** 공용 네이티브 셀렉트. Input과 동일한 높이/보더 규격을 공유한다. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, size = 'md', options, className, id, disabled, ...props }, ref) => {
    const reactId = useId()
    const selectId = id ?? reactId

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[var(--ds-text-subtle)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={clsx(
              'w-full appearance-none rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] outline-none transition-colors focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
              sizeClass[size],
              error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
              className,
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-[var(--ds-text-subtle)]" />
        </div>
        {error && <p className="text-2xs text-[var(--ds-text-danger)]">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
