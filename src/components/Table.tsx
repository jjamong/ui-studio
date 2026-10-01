import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode, UIEvent } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragStartEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { clsx } from 'clsx'
import { SortHandle } from './SortHandle'
import { useSortableRows } from './useSortableRows'

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
  /**
   * 지정하면 맨 앞에 손잡이 칸이 생기고, 손잡이를 끌거나(또는 포커스 후 ↑/↓ 키) 행 순서를 바꿀 수 있다.
   * 새 순서의 rows 배열로 호출된다 — 넘긴 rows(페이징 중이면 현재 페이지 분량) 안에서의 순서다.
   * 실제 저장과 실패 시 되돌리기는 SortableList와 마찬가지로 호출부가 담당한다.
   */
  onReorder?: (next: T[]) => void
  /** 저장 중이거나 검색으로 일부만 보이는 중처럼 순서 변경을 막을 때. 손잡이 칸은 남기고 비활성화한다. */
  reorderDisabled?: boolean
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

function cellClass(align: TableColumn<unknown>['align'], bordered: boolean) {
  return clsx('px-3 py-2.5 text-[var(--ds-text)]', bordered && 'border-b border-[var(--ds-border)]', alignClass[align ?? 'left'])
}

function SortableTableRow<T>({
  id,
  row,
  index,
  columns,
  isLast,
  disabled,
  onRowClick,
  rowRef,
  handleRef,
  onHandleKeyDown,
}: {
  id: string
  row: T
  index: number
  columns: TableColumn<T>[]
  isLast: boolean
  disabled: boolean
  onRowClick?: (row: T) => void
  rowRef: (el: HTMLTableRowElement | null) => void
  handleRef: (el: HTMLButtonElement | null) => void
  onHandleKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })

  return (
    <tr
      ref={(el) => {
        setNodeRef(el)
        rowRef(el)
      }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onClick={() => onRowClick?.(row)}
      className={clsx(
        'relative',
        onRowClick && 'cursor-pointer hover:bg-[var(--ds-background-neutral-hovered)]',
        // 끄는 동안 원래 행은 "놓일 자리"로 남아 다른 행 사이를 따라 움직인다
        isDragging && 'z-10 bg-[var(--ds-background-selected)] [&>td>*]:opacity-40',
      )}
    >
      <td className={clsx('w-8 py-2.5 pl-2 pr-0 align-middle', !isLast && 'border-b border-[var(--ds-border)]')}>
        <SortHandle
          ref={(el) => {
            setActivatorNodeRef(el)
            handleRef(el)
          }}
          {...attributes}
          {...listeners}
          disabled={disabled}
          // 손잡이 클릭이 행 클릭(상세 이동 등)으로 번지지 않게 막는다
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => onHandleKeyDown(e, index)}
        />
      </td>
      {columns.map((col) => (
        <td key={col.key} className={cellClass(col.align, !isLast)}>
          {col.render(row)}
        </td>
      ))}
    </tr>
  )
}

/**
 * 공용 테이블. 정렬/페이지네이션은 갖지 않는다 — 필요하면 호출부가 Pagination과 조합해서 쓴다.
 * onReorder를 주면 행을 끌어 순서를 바꾸는 표가 된다(맨 앞에 손잡이 칸 추가). 끄는 동안 다른 행이 비켜나며 놓일 자리가 미리 보인다. 표가 아닌 단순 목록이면 SortableList를 쓴다.
 */
export function Table<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
  stickyHeader = false,
  maxHeightClass,
  onScroll,
  onReorder,
  reorderDisabled = false,
}: TableProps<T>) {
  const sortable = useSortableRows({ items: rows, getId: getRowId, onReorder: onReorder ?? (() => {}) })
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>())
  /** 드래그 시작 시점의 각 칸 너비 — 떠다니는 행(DragOverlay)의 칸 너비를 원래 표와 맞추는 데 쓴다. */
  const [overlayWidths, setOverlayWidths] = useState<number[]>([])
  const reorderable = !!onReorder

  const headerClass = (align: TableColumn<T>['align'], widthClass?: string) =>
    clsx(
      'border-b border-[var(--ds-border)] px-3 py-2 text-xs font-semibold text-[var(--ds-text-subtle)]',
      alignClass[align ?? 'left'],
      widthClass,
      stickyHeader && 'sticky top-0 z-10 bg-[var(--ds-surface)]',
    )

  const table = (
    <div className={clsx('overflow-x-auto', maxHeightClass && clsx(maxHeightClass, 'overflow-y-auto'))} onScroll={onScroll}>
      {/* sticky는 border-collapse 테이블에서 깨진다 — border-separate로 대체하고 sticky를 tr이 아닌 th 각각에 건다. */}
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {reorderable && (
              <th className={headerClass('left', 'w-8 pl-2 pr-0')}>
                <span className="sr-only">순서</span>
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} className={headerClass(col.align, col.widthClass)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (reorderable ? 1 : 0)}
                className="px-3 py-10 text-center text-xs text-[var(--ds-text-subtle)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : reorderable ? (
            rows.map((row, index) => {
              const id = sortable.ids[index]!
              return (
                <SortableTableRow
                  key={id}
                  id={id}
                  row={row}
                  index={index}
                  columns={columns}
                  isLast={index === rows.length - 1}
                  disabled={reorderDisabled}
                  onRowClick={onRowClick}
                  rowRef={(el) => {
                    if (el) rowRefs.current.set(id, el)
                    else rowRefs.current.delete(id)
                  }}
                  handleRef={sortable.handleRef(id)}
                  onHandleKeyDown={sortable.onHandleKeyDown}
                />
              )
            })
          ) : (
            rows.map((row, index) => (
              <tr
                key={getRowId(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(onRowClick && 'cursor-pointer hover:bg-[var(--ds-background-neutral-hovered)]')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cellClass(col.align, index < rows.length - 1)}>
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

  if (!reorderable) return table

  function handleDragStart(event: DragStartEvent) {
    const tr = rowRefs.current.get(String(event.active.id))
    setOverlayWidths(tr ? Array.from(tr.cells, (cell) => cell.getBoundingClientRect().width) : [])
    sortable.dndProps.onDragStart(event)
  }

  const activeRow = sortable.activeIndex !== -1 ? rows[sortable.activeIndex] : undefined

  return (
    <DndContext {...sortable.dndProps} onDragStart={handleDragStart}>
      <SortableContext items={sortable.ids} strategy={verticalListSortingStrategy} disabled={reorderDisabled}>
        {table}
      </SortableContext>
      <DragOverlay>
        {activeRow !== undefined && (
          <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] text-sm shadow-[var(--ds-shadow-overlay)]">
            <tbody>
              <tr>
                <td className="py-2.5 pl-2 pr-0 align-middle" style={{ width: overlayWidths[0] }}>
                  <span className="flex h-5 w-5 items-center justify-center text-[var(--ds-text-subtle)]">
                    <GripVertical size={14} />
                  </span>
                </td>
                {columns.map((col, i) => (
                  <td key={col.key} className={cellClass(col.align, false)} style={{ width: overlayWidths[i + 1] }}>
                    {col.render(activeRow)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  )
}
