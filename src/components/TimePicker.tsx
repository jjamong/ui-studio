import { useEffect, useId, useState } from 'react'
import { Clock } from 'lucide-react'
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
import { pad2 } from '../utils/date'

type TimePickerSize = 'sm' | 'md' | 'lg'

export interface TimePickerProps {
  /** format 패턴으로 표현된 시각 문자열 (기본 "HH:mm", 예: "14:30") */
  value?: string
  onChange: (value: string) => void
  /** HH/mm 토큰으로 구성. 기본값 "HH:mm" */
  format?: string
  label?: string
  error?: string
  size?: TimePickerSize
  placeholder?: string
  disabled?: boolean
  /** 분 목록 간격(분). 기본 5 */
  minuteStep?: number
  className?: string
}

const sizeClass: Record<TimePickerSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-9 px-3 text-base',
}

function parseTime(raw: string): { hour: number; minute: number } | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 3) return null
  const hour = Number(digits.slice(0, 2))
  const minute = Number(digits.slice(2, 4).padEnd(2, '0'))
  if (Number.isNaN(hour) || Number.isNaN(minute) || hour > 23 || minute > 59) return null
  return { hour, minute }
}

function formatTime(hour: number, minute: number, format: string): string {
  return format.replace('HH', pad2(hour)).replace('mm', pad2(minute))
}

/** 날짜 없이 시각만 다루는 인풋. 팝업의 시/분 목록을 클릭하거나 숫자를 직접 입력할 수 있다. */
export function TimePicker({
  value = '',
  onChange,
  format = 'HH:mm',
  label,
  error,
  size = 'md',
  placeholder,
  disabled,
  minuteStep = 5,
  className,
}: TimePickerProps) {
  const inputId = useId()
  const [draft, setDraft] = useState(value)
  const [open, setOpen] = useState(false)

  useEffect(() => setDraft(value), [value])

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (next) => {
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

  const parsed = parseTime(value) ?? { hour: 0, minute: 0 }

  function commit(raw: string) {
    const time = parseTime(raw)
    if (time) {
      const formatted = formatTime(time.hour, time.minute, format)
      setDraft(formatted)
      onChange(formatted)
    } else {
      setDraft(value)
    }
  }

  function selectHour(hour: number) {
    const formatted = formatTime(hour, parsed.minute, format)
    setDraft(formatted)
    onChange(formatted)
  }

  function selectMinute(minute: number) {
    const formatted = formatTime(parsed.hour, minute, format)
    setDraft(formatted)
    onChange(formatted)
    setOpen(false)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep)

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
            error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
            className,
          )}
        />
        <Clock size={14} className="pointer-events-none absolute right-2.5 text-[var(--ds-text-subtle)]" />
      </div>
      {error && <p className="text-2xs text-[var(--ds-text-danger)]">{error}</p>}

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[var(--ds-z-dropdown)] flex h-48 divide-x divide-[var(--ds-border)] overflow-hidden rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]"
            >
              <div className="w-16 overflow-y-auto py-1">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => selectHour(hour)}
                    className={clsx(
                      'block w-full px-3 py-1.5 text-center text-sm transition-colors',
                      hour === parsed.hour
                        ? 'bg-[var(--ds-background-selected)] font-semibold text-[var(--ds-text-selected)]'
                        : 'text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
                    )}
                  >
                    {pad2(hour)}
                  </button>
                ))}
              </div>
              <div className="w-16 overflow-y-auto py-1">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => selectMinute(minute)}
                    className={clsx(
                      'block w-full px-3 py-1.5 text-center text-sm transition-colors',
                      minute === parsed.minute
                        ? 'bg-[var(--ds-background-selected)] font-semibold text-[var(--ds-text-selected)]'
                        : 'text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
                    )}
                  >
                    {pad2(minute)}
                  </button>
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}
