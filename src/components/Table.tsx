import type { ReactNode, UIEvent } from 'react'
import { clsx } from 'clsx'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
  widthClass?: string
  align?: 'left' | 'right' | 'center'
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: ReactNode
  /** 스크롤되는 컨테이너 안에 넣을 때 헤더를 상단에 고정한다. maxHeightClass와 함께 쓴다. */
  stickyHeader?: boolean
  /**
   * 지정하면 Table 자신이 세로 스크롤 컨테이너가 된다(예: 'max-h-80'). 무한 스크롤 목록에서 stickyHeader와 함께 쓴다.
   * 별도 div로 감싸면 그 div가 sticky의 기준 스크롤 조상이 되어버려(overflow-x-auto와 겹치며 생기는 문제) 헤더가 고정되지 않는다.
   */
  maxHeightClass?: string
  onScroll?: (e: UIEvent<HTMLDivElement>) => void
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

/** 공용 테이블. 정렬/페이지네이션은 갖지 않는다 — 필요하면 호출부가 Pagination과 조합해서 쓴다. */
export function Table<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
  stickyHeader = false,
  maxHeightClass,
  onScroll,
}: TableProps<T>) {
  return (
    <div className={clsx('overflow-x-auto', maxHeightClass && clsx(maxHeightClass, 'overflow-y-auto'))} onScroll={onScroll}>
      {/* sticky는 border-collapse 테이블에서 깨진다 — border-separate로 대체하고 sticky를 tr이 아닌 th 각각에 건다. */}
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'border-b border-[var(--ds-border)] px-3 py-2 text-xs font-semibold text-[var(--ds-text-subtle)]',
                  alignClass[col.align ?? 'left'],
                  col.widthClass,
                  stickyHeader && 'sticky top-0 z-10 bg-[var(--ds-surface)]',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-10 text-center text-xs text-[var(--ds-text-subtle)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={getRowId(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(onRowClick && 'cursor-pointer hover:bg-[var(--ds-background-neutral-hovered)]')}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      'px-3 py-2.5 text-[var(--ds-text)]',
                      index < rows.length - 1 && 'border-b border-[var(--ds-border)]',
                      alignClass[col.align ?? 'left'],
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
