import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { clsx } from 'clsx'

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

type PageToken = number | 'ellipsis'

/** 현재 페이지 주변(±1)과 첫/마지막 페이지만 남기고 나머지는 '...'으로 접는다. */
function buildPageTokens(currentPage: number, totalPages: number): PageToken[] {
  const pages = Array.from(
    new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter((p) => p >= 1 && p <= totalPages)),
  ).sort((a, b) => a - b)

  const tokens: PageToken[] = []
  pages.forEach((page, idx) => {
    const prev = pages[idx - 1]
    if (idx > 0 && prev !== undefined && page - prev > 1) tokens.push('ellipsis')
    tokens.push(page)
  })
  return tokens
}

/** 그리드/목록 하단 공용 페이지네이션. 처음/이전/페이지번호(생략 포함)/다음/마지막 + 우측 페이지당 표시 개수 선택. */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50],
}: PaginationProps) {
  if (totalPages <= 1 && !onItemsPerPageChange) return null

  const tokens = buildPageTokens(currentPage, totalPages)

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="처음 페이지로"
          className={navButtonClass}
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
          className={navButtonClass}
        >
          <ChevronLeft size={14} />
        </button>

        {tokens.map((token, idx) =>
          token === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="flex h-7 w-7 items-center justify-center text-xs text-[var(--ds-text-subtle)]">
              ...
            </span>
          ) : (
            <button
              key={token}
              type="button"
              onClick={() => onPageChange(token)}
              className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors',
                token === currentPage
                  ? 'bg-[var(--ds-background-brand-bold)] text-[var(--ds-text-inverse)]'
                  : 'text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
              )}
            >
              {token}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
          className={navButtonClass}
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="마지막 페이지로"
          className={navButtonClass}
        >
          <ChevronsRight size={14} />
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
