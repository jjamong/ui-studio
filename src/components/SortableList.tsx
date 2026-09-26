import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { clsx } from 'clsx'

export interface SortableListProps<T> {
  items: T[]
  getId: (item: T) => string
  /** 행 본문. 드래그는 왼쪽 손잡이로만 시작되므로 본문 안의 링크/버튼은 그대로 클릭된다. */
  renderItem: (item: T, index: number) => ReactNode
  /**
   * 드래그(또는 손잡이 포커스 후 ↑/↓ 키)로 순서가 바뀌면 새 순서의 배열로 호출된다.
   * 실제 items 변경/저장은 호출부가 담당한다(저장 실패 시 이전 배열로 되돌리는 것도 호출부 몫).
   */
  onReorder: (next: T[]) => void
  /** 저장 중처럼 순서 변경을 잠시 막을 때. 손잡이가 비활성화된다. */
  disabled?: boolean
  /** 행 사이 구분선. 기본 true. */
  divided?: boolean
  className?: string
}

type DropSide = 'before' | 'after'

interface DropIndicator {
  id: string
  side: DropSide
}

/** from 위치의 항목을 insertAt(원래 배열 기준 삽입 위치) 자리로 옮긴 새 배열. 변화가 없으면 null. */
function moveItem<T>(items: T[], from: number, insertAt: number): T[] | null {
  const to = insertAt > from ? insertAt - 1 : insertAt
  if (to === from || to < 0 || to >= items.length) return null
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved!)
  return next
}

function SortableRow({
  id,
  index,
  disabled,
  divided,
  dropSide,
  handleRef,
  onHandleKeyDown,
  children,
}: {
  id: string
  index: number
  disabled: boolean
  divided: boolean
  dropSide: DropSide | null
  handleRef: (el: HTMLButtonElement | null) => void
  onHandleKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void
  children: ReactNode
}) {
  const { attributes, listeners, setNodeRef: setDragRef, setActivatorNodeRef, isDragging } = useDraggable({ id, disabled })
  const { setNodeRef: setDropRef } = useDroppable({ id, disabled })

  return (
    <li
      ref={(el) => {
        setDragRef(el)
        setDropRef(el)
      }}
      className={clsx(
        'relative flex items-start gap-1 py-2 first:pt-0 last:pb-0',
        divided && 'border-t border-[var(--ds-border)] first:border-t-0',
        isDragging && 'opacity-40',
      )}
    >
      {dropSide === 'before' && <div className="absolute inset-x-0 -top-px h-0.5 bg-[var(--ds-background-brand-bold)]" />}
      <button
        type="button"
        ref={(el) => {
          setActivatorNodeRef(el)
          handleRef(el)
        }}
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label="순서 변경 (끌어서 이동, 또는 ↑/↓ 키)"
        onKeyDown={(e) => onHandleKeyDown(e, index)}
        className={clsx(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--ds-text-subtlest)] transition-colors',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-grab hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text-subtle)] active:cursor-grabbing',
        )}
      >
        <GripVertical size={14} />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
      {dropSide === 'after' && <div className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--ds-background-brand-bold)]" />}
    </li>
  )
}

/**
 * 드래그로 순서를 바꾸는 평평한 목록. 계층 이동(다른 항목 안으로 넣기)이 필요하면 DraggableTree를 쓴다.
 * 행 왼쪽 손잡이를 끌거나, 손잡이에 포커스한 뒤 ↑/↓ 키로 한 칸씩 옮긴다.
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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null)
  /** 드래그 시작 시점의 포인터 y좌표 — DraggableTree와 같은 방식으로 커서 위치 기준 before/after를 판정한다. */
  const pointerStartYRef = useRef<number | null>(null)
  const handleRefs = useRef(new Map<string, HTMLButtonElement>())
  /** 키보드로 옮긴 뒤 DOM 재배치로 포커스가 빠지는 걸 막기 위해 다시 포커스할 항목 */
  const refocusIdRef = useRef<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const indexOf = (id: string) => items.findIndex((item) => getId(item) === id)

  useEffect(() => {
    if (!refocusIdRef.current) return
    handleRefs.current.get(refocusIdRef.current)?.focus()
    refocusIdRef.current = null
  }, [items])

  function handleHandleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const next = moveItem(items, index, e.key === 'ArrowUp' ? index - 1 : index + 2)
    if (!next) return
    refocusIdRef.current = getId(items[index]!)
    onReorder(next)
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
    const activatorEvent = event.activatorEvent
    pointerStartYRef.current = 'clientY' in activatorEvent ? (activatorEvent as PointerEvent).clientY : null
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over, delta } = event
    if (!over || active.id === over.id) {
      setDropIndicator(null)
      return
    }
    const overRect = over.rect
    let pointerY: number
    if (pointerStartYRef.current !== null) {
      pointerY = pointerStartYRef.current + delta.y
    } else {
      const activeRect = active.rect.current.translated
      if (!activeRect) return
      pointerY = activeRect.top + activeRect.height / 2
    }
    const side: DropSide = pointerY < overRect.top + overRect.height / 2 ? 'before' : 'after'
    const from = indexOf(String(active.id))
    const overIndex = indexOf(String(over.id))
    // 바로 옆 자리에 놓아 순서가 그대로인 경우엔 표시선을 띄우지 않는다
    if (!moveItem(items, from, side === 'before' ? overIndex : overIndex + 1)) {
      setDropIndicator(null)
      return
    }
    setDropIndicator({ id: String(over.id), side })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event
    if (dropIndicator) {
      const overIndex = indexOf(dropIndicator.id)
      const next = moveItem(items, indexOf(String(active.id)), dropIndicator.side === 'before' ? overIndex : overIndex + 1)
      if (next) onReorder(next)
    }
    setActiveId(null)
    setDropIndicator(null)
  }

  function handleDragCancel() {
    setActiveId(null)
    setDropIndicator(null)
  }

  const activeIndex = activeId ? indexOf(activeId) : -1

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <ul className={clsx('flex flex-col', className)}>
        {items.map((item, i) => {
          const id = getId(item)
          return (
            <SortableRow
              key={id}
              id={id}
              index={i}
              disabled={disabled}
              divided={divided}
              dropSide={dropIndicator?.id === id ? dropIndicator.side : null}
              handleRef={(el) => {
                if (el) handleRefs.current.set(id, el)
                else handleRefs.current.delete(id)
              }}
              onHandleKeyDown={handleHandleKeyDown}
            >
              {renderItem(item, i)}
            </SortableRow>
          )
        })}
      </ul>
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
