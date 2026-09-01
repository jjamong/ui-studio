import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { addMonths, getCalendarMatrix, isAfterDay, isBeforeDay, isSameDay, isWithinRange } from '../utils/date'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export interface CalendarProps {
  viewDate: Date
  onViewDateChange: (date: Date) => void
  /** 단일 선택 모드에서 선택된 날짜 */
  selected?: Date | null
  /** 기간 선택 모드: 시작일 */
  rangeStart?: Date | null
  /** 기간 선택 모드: 확정된 종료일 */
  rangeEnd?: Date | null
  /** 기간 선택 모드: 종료일 확정 전 마우스 오버로 보여줄 미리보기 종료일 */
  previewEnd?: Date | null
  onDayClick: (date: Date) => void
  onDayHover?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

/** DatePicker/DateRangePicker가 공유하는 월 단위 캘린더 그리드. */
export function Calendar({
  viewDate,
  onViewDateChange,
  selected,
  rangeStart,
  rangeEnd,
  previewEnd,
  onDayClick,
  onDayHover,
  minDate,
  maxDate,
}: CalendarProps) {
  const days = getCalendarMatrix(viewDate)
  const today = new Date()
  const rangeVisibleEnd = rangeEnd ?? previewEnd ?? null
  const hasRange = Boolean(rangeStart && rangeVisibleEnd && !isAfterDay(rangeStart, rangeVisibleEnd))

  return (
    <div className="w-64 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onViewDateChange(addMonths(viewDate, -1))}
          className="rounded p-1 text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-background-neutral-hovered)]"
          aria-label="이전 달"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-[var(--ds-text)]">
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </span>
        <button
          type="button"
          onClick={() => onViewDateChange(addMonths(viewDate, 1))}
          className="rounded p-1 text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-background-neutral-hovered)]"
          aria-label="다음 달"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="text-2xs justify-self-center font-semibold text-[var(--ds-text-subtlest)]">
            {weekday}
          </span>
        ))}
        {days.map(({ date, inCurrentMonth }) => {
          const disabled = Boolean((minDate && isBeforeDay(date, minDate)) || (maxDate && isAfterDay(date, maxDate)))
          const isSelected = Boolean(selected && isSameDay(date, selected))
          const isRangeStart = Boolean(rangeStart && isSameDay(date, rangeStart))
          const isRangeEnd = Boolean(rangeVisibleEnd && isSameDay(date, rangeVisibleEnd))
          const hasRangeBg = hasRange && rangeStart && rangeVisibleEnd && isWithinRange(date, rangeStart, rangeVisibleEnd)
          const isEdge = isSelected || isRangeStart || isRangeEnd
          const isToday = isSameDay(date, today)

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => onDayHover?.(date)}
              className={clsx(
                'flex h-7 w-7 items-center justify-center justify-self-center text-xs transition-colors',
                hasRangeBg && 'bg-[var(--ds-background-selected)]',
                hasRangeBg && isRangeStart && 'rounded-l-full',
                hasRangeBg && isRangeEnd && 'rounded-r-full',
                !hasRangeBg && 'rounded-full',
                disabled && 'cursor-not-allowed opacity-40',
                !disabled && !inCurrentMonth && 'text-[var(--ds-text-subtlest)]',
                !disabled && inCurrentMonth && !isEdge && 'text-[var(--ds-text)]',
                !disabled && !isEdge && 'hover:bg-[var(--ds-background-neutral-hovered)]',
              )}
            >
              <span
                className={clsx(
                  'flex h-7 w-7 items-center justify-center rounded-full',
                  isEdge && 'bg-[var(--ds-background-brand-bold)] font-semibold text-[var(--ds-text-inverse)]',
                  isToday && !isEdge && 'font-semibold text-[var(--ds-text-information)]',
                )}
              >
                {date.getDate()}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
