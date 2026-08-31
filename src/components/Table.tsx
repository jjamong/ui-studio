import type { ReactNode } from 'react'
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
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

/** 공용 테이블. 정렬/페이지네이션은 갖지 않는다 — 필요하면 호출부가 Pagination과 조합해서 쓴다. */
export function Table<T>({ columns, rows, getRowId, onRowClick, emptyMessage = '데이터가 없습니다.' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded border border-[var(--ds-border)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--ds-border)] bg-[var(--ds-surface-sunken)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-3 py-2 text-xs font-semibold text-[var(--ds-text-subtle)]',
                  alignClass[col.align ?? 'left'],
                  col.widthClass,
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
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'border-b border-[var(--ds-border)] last:border-b-0',
                  onRowClick && 'cursor-pointer hover:bg-[var(--ds-background-neutral-hovered)]',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-3 py-2.5 text-[var(--ds-text)]', alignClass[col.align ?? 'left'])}>
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
