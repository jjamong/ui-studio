import { forwardRef, useEffect, useId, useRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Check, Minus } from 'lucide-react'
import { clsx } from 'clsx'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'checked'> {
  checked: boolean
  onChange: (checked: boolean) => void
  /** 일부만 선택된 상태(부모 체크박스 등). checked와 별개로 표시만 담당한다. */
  indeterminate?: boolean
  label?: ReactNode
  disabled?: boolean
}

/** 공용 체크박스. indeterminate(부분 선택) 상태를 지원한다. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, indeterminate = false, label, disabled = false, id, className, ...props }, forwardedRef) => {
    const reactId = useId()
    const checkboxId = id ?? reactId
    const innerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
      <label
        htmlFor={checkboxId}
        className={clsx(
          'inline-flex items-center gap-2 text-sm text-[var(--ds-text)]',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className,
        )}
      >
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={(node) => {
              innerRef.current = node
              if (typeof forwardedRef === 'function') forwardedRef(node)
              else if (forwardedRef) forwardedRef.current = node
            }}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] transition-colors checked:border-[var(--ds-background-brand-bold)] checked:bg-[var(--ds-background-brand-bold)] disabled:cursor-not-allowed"
            {...props}
          />
          {(checked || indeterminate) && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[var(--ds-text-inverse)]">
              {indeterminate ? <Minus size={11} strokeWidth={3} /> : <Check size={11} strokeWidth={3} />}
            </span>
          )}
        </span>
        {label}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
