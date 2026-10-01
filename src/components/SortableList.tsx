import type { KeyboardEvent, ReactNode } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { clsx } from 'clsx'
import { SortHandle } from './SortHandle'
import { useSortableRows } from './useSortableRows'

export interface SortableListProps<T> {
  items: T[]
  getId: (item: T) => string
  /** 행 본문. 드래그는 왼쪽 손잡이로만 시작되므로 본문 안의 링크/버튼은 그대로 클릭된다. */
  renderItem: (item: T, index: number) => ReactNode
  /**
   * 드래그(또는 손잡이 포커스 후 ↑/↓ 키)로 순서가 바뀌면 새 순서의 배열로 호출된다.
   * 끄는 동안의 미리보기는 화면에서만 움직이고, 놓는 순간 한 번만 호출된다.
   * 실제 items 변경/저장은 호출부가 담당한다(저장 실패 시 이전 배열로 되돌리는 것도 호출부 몫).
   */
  onReorder: (next: T[]) => void
  /** 저장 중처럼 순서 변경을 잠시 막을 때. 손잡이가 비활성화된다. */
  disabled?: boolean
  /** 행 사이 구분선. 기본 true. */
  divided?: boolean
  className?: string
}

function SortableRow({
  id,
  index,
  disabled,
  divided,
  handleRef,
  onHandleKeyDown,
  children,
}: {
  id: string
  index: number
  disabled: boolean
  divided: boolean
  handleRef: (el: HTMLButtonElement | null) => void
  onHandleKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void
  children: ReactNode
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={clsx(
        'relative flex items-start gap-1 py-2 first:pt-0 last:pb-0',
        divided && 'border-t border-[var(--ds-border)] first:border-t-0',
        // 끄는 동안 원래 행은 "놓일 자리"로 남아 다른 행 사이를 따라 움직인다
        isDragging && 'z-10 rounded bg-[var(--ds-background-selected)] [&>*]:opacity-40',
      )}
    >
      <SortHandle
        ref={(el) => {
          setActivatorNodeRef(el)
          handleRef(el)
        }}
        {...attributes}
        {...listeners}
        disabled={disabled}
        onKeyDown={(e) => onHandleKeyDown(e, index)}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  )
}

/**
 * 드래그로 순서를 바꾸는 평평한 목록. 계층 이동(다른 항목 안으로 넣기)이 필요하면 DraggableTree를 쓴다.
 * 행 왼쪽 손잡이를 끌면 다른 행이 비켜나며 놓일 자리가 미리 보이고, 손잡이에 포커스한 뒤 ↑/↓ 키로 한 칸씩 옮길 수도 있다.
 */
export function SortableList<T>({
  items,
  getId,
  renderItem,
  onReorder,
  disabled = false,
  divided = true,
  className,
}: SortableListProps<T>) {
  const { dndProps, ids, activeIndex, handleRef, onHandleKeyDown } = useSortableRows({ items, getId, onReorder })

  return (
    <DndContext {...dndProps}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={disabled}>
        <ul className={clsx('flex flex-col', className)}>
          {items.map((item, i) => {
            const id = ids[i]!
            return (
              <SortableRow
                key={id}
                id={id}
                index={i}
                disabled={disabled}
                divided={divided}
                handleRef={handleRef(id)}
                onHandleKeyDown={onHandleKeyDown}
              >
                {renderItem(item, i)}
              </SortableRow>
            )
          })}
        </ul>
      </SortableContext>
      <DragOverlay>
        {activeIndex !== -1 && (
          <div className="flex items-start gap-1 rounded border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] p-2 shadow-[var(--ds-shadow-overlay)]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--ds-text-subtle)]">
              <GripVertical size={14} />
            </span>
            <div className="min-w-0 flex-1">{renderItem(items[activeIndex]!, activeIndex)}</div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
