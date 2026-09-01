import { forwardRef, useEffect, useId, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { clsx } from 'clsx'

type AmountInputSize = 'sm' | 'md' | 'lg'

export interface AmountInputProps {
  /** 콤마 없는 순수 숫자 문자열(예: "1000000"). 빈 문자열이면 미입력 상태. */
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  size?: AmountInputSize
  placeholder?: string
  disabled?: boolean
  /** 우측에 붙는 단위 표시(예: "원"). */
  suffix?: ReactNode
  className?: string
}

const sizeClass: Record<AmountInputSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-9 px-3 text-base',
}

function formatWithCommas(digits: string): string {
  if (!digits) return ''
  return Number(digits).toLocaleString('en-US')
}

/**
 * 천 단위 콤마가 자동으로 붙는 금액 입력. type="number"는 콤마를 입력받지 못해서 쓸 수 없어
 * text 인풋에 직접 포맷팅한다. 값은 화면 표시(콤마 포함)와 분리해서 콤마 없는 숫자 문자열로
 * 주고받는다 — 그대로 서버로 보내거나 Number()로 바꿔 쓰면 된다.
 */
export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ value, onChange, label, error, size = 'md', placeholder, disabled, suffix, className }, ref) => {
    const inputId = useId()
    const [display, setDisplay] = useState(() => formatWithCommas(value))

    useEffect(() => {
      setDisplay(formatWithCommas(value))
    }, [value])

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const digits = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
      setDisplay(formatWithCommas(digits))
      onChange(digits)
    }

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--ds-text-subtle)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            inputMode="numeric"
            disabled={disabled}
            value={display}
            placeholder={placeholder}
            onChange={handleChange}
            className={clsx(
              'w-full rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] text-right text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
              sizeClass[size],
              suffix && 'pr-8',
              error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
              className,
            )}
          />
          {suffix && (
            <span className="pointer-events-none absolute right-2.5 text-xs text-[var(--ds-text-subtle)]">{suffix}</span>
          )}
        </div>
        {error && <p className="text-2xs text-[var(--ds-text-danger)]">{error}</p>}
      </div>
    )
  },
)

AmountInput.displayName = 'AmountInput'
