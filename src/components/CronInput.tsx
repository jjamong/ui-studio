import { forwardRef, useId } from 'react'
import type { ChangeEvent } from 'react'
import { clsx } from 'clsx'

type CronInputSize = 'sm' | 'md' | 'lg'

export interface CronInputProps {
  /** cron 표현식 문자열(예: "0 9 * * *"). 빈 문자열이면 미입력 상태. */
  value: string
  onChange: (value: string) => void
  label?: string
  /** 지정하면 형식 자동 검증 대신 이 메시지를 우선 노출한다. */
  error?: string
  size?: CronInputSize
  placeholder?: string
  disabled?: boolean
  className?: string
}

const sizeClass: Record<CronInputSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-9 px-3 text-base',
}

// 분 시 일 월 요일, 5필드. 각 필드는 *, 숫자, 범위(-), 목록(,), 간격(/)의 조합만 허용.
const CRON_FIELD = /^(\*|\d+)(-\d+)?(\/\d+)?(,(\*|\d+)(-\d+)?(\/\d+)?)*$/

function isValidCron(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  const fields = trimmed.split(/\s+/)
  return fields.length === 5 && fields.every((field) => CRON_FIELD.test(field))
}

/**
 * cron 표현식 입력. AmountInput이 숫자 외 문자를 걸러내듯, 여기서는 cron 필드에
 * 쓰이지 않는 문자(숫자/공백/* , - / 이외)를 입력 즉시 걸러낸다. 5필드(분 시 일 월 요일)
 * 형식에 맞지 않으면 자동으로 에러 메시지를 보여준다(error prop으로 덮어쓸 수 있음).
 */
export const CronInput = forwardRef<HTMLInputElement, CronInputProps>(
  ({ value, onChange, label, error, size = 'md', placeholder = '* * * * *', disabled, className }, ref) => {
    const inputId = useId()
    const autoError = !error && value && !isValidCron(value) ? '올바른 cron 형식이 아닙니다 (분 시 일 월 요일)' : undefined
    const shownError = error ?? autoError

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const filtered = e.target.value.replace(/[^\d*,\-/\s]/g, '')
      onChange(filtered)
    }

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--ds-text-subtle)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          inputMode="text"
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={clsx(
            'w-full rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] font-mono text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
            sizeClass[size],
            shownError && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
            className,
          )}
        />
        {shownError && <p className="text-2xs text-[var(--ds-text-danger)]">{shownError}</p>}
      </div>
    )
  },
)

CronInput.displayName = 'CronInput'
