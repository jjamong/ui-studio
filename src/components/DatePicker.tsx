import { useEffect, useId, useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import {
  FloatingFocusManager,
  FloatingPortal,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { clsx } from 'clsx'
import { Calendar } from './Calendar'
import { formatDate, parseDigits } from '../utils/date'

type DatePickerSize = 'sm' | 'md' | 'lg'

export interface DatePickerProps {
  /** format 패턴으로 표현된 날짜 문자열 (기본 "YYYYMMDD", 예: "20260901") */
  value?: string
  onChange: (value: string) => void
  /** YYYY/MM/DD 토큰으로 구성. 기본값 "YYYYMMDD" */
  format?: string
  label?: string
  error?: string
  size?: DatePickerSize
  placeholder?: string
  disabled?: boolean
  minDate?: string
  maxDate?: string
  /** 값 지우기 버튼 노출 여부. 기본 true */
  clearable?: boolean
  className?: string
}

const sizeClass: Record<DatePickerSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-9 px-3 text-base',
}

/** 캘린더 팝업이 연동된 날짜 인풋. 숫자를 직접 입력하거나(구분자 무관) 팝업에서 날짜를 클릭해 고를 수 있다. */
export function DatePicker({
  value = '',
  onChange,
  format = 'YYYYMMDD',
  label,
  error,
  size = 'md',
  placeholder,
  disabled,
  minDate,
  maxDate,
  clearable = true,
  className,
}: DatePickerProps) {
  const inputId = useId()
  const selectedDate = value ? parseDigits(value, format) : null
  const min = minDate ? parseDigits(minDate, format) : null
  const max = maxDate ? parseDigits(maxDate, format) : null

  const [draft, setDraft] = useState(value)
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDraft(value)
    if (selectedDate) setViewDate(selectedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (next: boolean) => {
      setOpen(next)
      if (!next) setDraft(value)
    },
    placement: 'bottom-start',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  })

  const click = useClick(context, { enabled: !disabled, toggle: false })
  const dismiss = useDismiss(context)
  const role = useRole(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  function commit(raw: string) {
    const parsed = parseDigits(raw, format)
    if (parsed) {
      const formatted = formatDate(parsed, format)
      setDraft(formatted)
      onChange(formatted)
      setViewDate(parsed)
    } else {
      setDraft(value)
    }
  }

  function handleDayClick(date: Date) {
    const formatted = formatDate(date, format)
    setDraft(formatted)
    onChange(formatted)
    setViewDate(date)
    setOpen(false)
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[var(--ds-text-subtle)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center" ref={refs.setReference} {...getReferenceProps()}>
        <input
          id={inputId}
          disabled={disabled}
          value={draft}
          placeholder={placeholder ?? format}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commit((e.target as HTMLInputElement).value)
              setOpen(false)
            }
          }}
          className={clsx(
            'w-full rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] pr-8 text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
            sizeClass[size],
            clearable && draft && 'pr-14',
            error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
            className,
          )}
        />
        {clearable && draft && !disabled && (
          <button
            type="button"
            onClick={() => {
              setDraft('')
              onChange('')
            }}
            className="absolute right-7 flex items-center text-[var(--ds-text-subtlest)] transition-colors hover:text-[var(--ds-text-subtle)]"
            aria-label="지우기"
          >
            <X size={12} />
          </button>
        )}
        <CalendarIcon size={14} className="pointer-events-none absolute right-2.5 text-[var(--ds-text-subtle)]" />
      </div>
      {error && <p className="text-2xs text-[var(--ds-text-danger)]">{error}</p>}

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[var(--ds-z-dropdown)] rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]"
            >
              <Calendar
                viewDate={viewDate}
                onViewDateChange={setViewDate}
                selected={selectedDate}
                onDayClick={handleDayClick}
                minDate={min ?? undefined}
                maxDate={max ?? undefined}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}
