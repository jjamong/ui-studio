import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { clsx } from 'clsx'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
  onItemsPerPageChange?: (size: number) => void
  itemsPerPageOptions?: number[]
}

/** 그리드/목록 하단 공용 페이지네이션. */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50],
}: PaginationProps) {
  if (totalPages <= 1 && !onItemsPerPageChange) return null

  const maxVisible = 5
  let start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + maxVisible - 1)
  start = Math.max(1, end - maxVisible + 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const navButtonClass =
    'flex h-7 w-7 items-center justify-center rounded-md text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--ds-border)] px-1 py-3 sm:flex-row">
      <div className="text-xs text-[var(--ds-text-subtle)]">
        {totalItems !== undefined && (
          <>
            총 <span className="font-semibold text-[var(--ds-text)]">{totalItems.toLocaleString()}</span>개
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onItemsPerPageChange && itemsPerPage !== undefined && (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-7 rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface)] px-2 text-2xs font-semibold text-[var(--ds-text)] outline-none focus:border-[var(--ds-border-focused)]"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}개씩
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-0.5">
          <button className={navButtonClass} onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="처음 페이지로">
            <ChevronsLeft size={14} />
          </button>
          <button
            className={navButtonClass}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <ChevronLeft size={14} />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors',
                page === currentPage
                  ? 'bg-[var(--ds-background-brand-bold)] text-[var(--ds-text-inverse)]'
                  : 'text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
              )}
            >
              {page}
            </button>
          ))}

          <button
            className={navButtonClass}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <ChevronRight size={14} />
          </button>
          <button
            className={navButtonClass}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="마지막 페이지로"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
