import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  onItemsPerPageChange?: (size: number) => void
  itemsPerPageOptions?: number[]
}

const navButtonClass =
  'flex h-7 w-7 items-center justify-center rounded-md text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

/** 그리드/목록 하단 공용 페이지네이션. 좌측 이전/다음 화살표 + 현재 페이지, 우측 페이지당 표시 개수 선택. */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50],
}: PaginationProps) {
  if (totalPages <= 1 && !onItemsPerPageChange) return null

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
          className={navButtonClass}
        >
          <ChevronLeft size={14} />
        </button>
        <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-[var(--ds-background-neutral)] px-2 text-xs font-semibold text-[var(--ds-text)]">
          {currentPage}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
          className={navButtonClass}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {onItemsPerPageChange && itemsPerPage !== undefined && (
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-7 appearance-none rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface)] py-1 pl-2.5 pr-7 text-2xs font-semibold text-[var(--ds-text)] outline-none focus:border-[var(--ds-border-focused)]"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--ds-text-subtle)]"
          />
        </div>
      )}
    </div>
  )
}
