import { useEffect, useId, useState } from 'react'
import type { MouseEvent } from 'react'
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
import { addMonths, formatDate, isAfterDay, parseDigits } from '../utils/date'

type DateRangePickerSize = 'sm' | 'md' | 'lg'

export interface DateRangePickerProps {
  /** format 패턴으로 표현된 시작일 문자열 (기본 "YYYYMMDD") */
  startValue?: string
  /** format 패턴으로 표현된 종료일 문자열 (기본 "YYYYMMDD") */
  endValue?: string
  onChange: (startValue: string, endValue: string) => void
  /** YYYY/MM/DD 토큰으로 구성. 기본값 "YYYYMMDD" */
  format?: string
  label?: string
  error?: string
  size?: DateRangePickerSize
  placeholder?: string
  disabled?: boolean
  minDate?: string
  maxDate?: string
  /** 값 지우기 버튼 노출 여부. 기본 true */
  clearable?: boolean
  className?: string
}

const sizeClass: Record<DateRangePickerSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-9 px-3 text-base',
}

/** 시작~종료 날짜를 하나의 인풋에서 고르는 기간 선택기. 팝업에서 두 달을 동시에 보여주고 시작일→종료일 순서로 클릭한다. */
export function DateRangePicker({
  startValue = '',
  endValue = '',
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
}: DateRangePickerProps) {
  const inputId = useId()
  const start = startValue ? parseDigits(startValue, format) : null
  const end = endValue ? parseDigits(endValue, format) : null
  const min = minDate ? parseDigits(minDate, format) : null
  const max = maxDate ? parseDigits(maxDate, format) : null

  const [open, setOpen] = useState(false)
  const [leftView, setLeftView] = useState(() => start ?? new Date())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  /** 새로 고르는 중인 시작일. null이면 committed된 start/end를 그대로 보여준다. */
  const [selectingStart, setSelectingStart] = useState<Date | null>(null)

  useEffect(() => {
    if (start) setLeftView(start)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startValue])

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (next) => {
      setOpen(next)
      if (!next) setSelectingStart(null)
    },
    placement: 'bottom-start',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  })

  const click = useClick(context, { enabled: !disabled, toggle: false })
  const dismiss = useDismiss(context)
  const role = useRole(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  function handleDayClick(date: Date) {
    if (!selectingStart) {
      setSelectingStart(date)
      return
    }
    if (isAfterDay(selectingStart, date)) {
      onChange(formatDate(date, format), formatDate(selectingStart, format))
    } else {
      onChange(formatDate(selectingStart, format), formatDate(date, format))
    }
    setSelectingStart(null)
    setOpen(false)
  }

  function handleClear(event: MouseEvent) {
    event.stopPropagation()
    setSelectingStart(null)
    onChange('', '')
  }

  const rightView = addMonths(leftView, 1)
  const rangeStart = selectingStart ?? start
  const rangeEnd = selectingStart ? null : end
  const previewEnd = selectingStart ? hoverDate : null
  const displayText = rangeStart && rangeEnd ? `${formatDate(rangeStart, format)} ~ ${formatDate(rangeEnd, format)}` : rangeStart ? `${formatDate(rangeStart, format)} ~` : ''

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
          readOnly
          disabled={disabled}
          value={displayText}
          placeholder={placeholder ?? `${format} ~ ${format}`}
          className={clsx(
            'w-full rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] pr-8 text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
            !disabled && 'cursor-pointer',
            sizeClass[size],
            clearable && displayText && 'pr-14',
            error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
            className,
          )}
        />
        {clearable && displayText && !disabled && (
          <button
            type="button"
            onClick={handleClear}
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
              className="z-[var(--ds-z-dropdown)] flex divide-x divide-[var(--ds-border)] rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]"
            >
              <Calendar
                viewDate={leftView}
                onViewDateChange={setLeftView}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                previewEnd={previewEnd}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                minDate={min ?? undefined}
                maxDate={max ?? undefined}
              />
              <Calendar
                viewDate={rightView}
                onViewDateChange={(next) => setLeftView(addMonths(next, -1))}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                previewEnd={previewEnd}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
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
