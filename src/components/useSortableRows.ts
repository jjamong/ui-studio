import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent, Modifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

/** 끄는 행이 옆으로 새지 않게 세로로만 움직이게 한다 */
const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 })

/**
 * SortableList·Table(onReorder)가 공유하는 평평한 목록 재정렬 상태(@dnd-kit/sortable 기반).
 * 끄는 동안 다른 행이 비켜나며 놓일 자리가 미리 보이고, 놓는 순간 onReorder가 호출된다.
 * 손잡이에 포커스한 뒤 ↑/↓ 키로도 한 칸씩 옮긴다.
 * dndProps는 DndContext에, ids는 SortableContext의 items에 그대로 넣는다.
 */
export function useSortableRows<T>({
  items,
  getId,
  onReorder,
}: {
  items: T[]
  getId: (item: T) => string
  onReorder: (next: T[]) => void
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const handleRefs = useRef(new Map<string, HTMLButtonElement>())
  /** 키보드로 옮긴 뒤 DOM 재배치로 포커스가 빠지는 걸 막기 위해 다시 포커스할 항목 */
  const refocusIdRef = useRef<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const ids = items.map(getId)
  const indexOf = (id: string) => ids.indexOf(id)

  useEffect(() => {
    if (!refocusIdRef.current) return
    handleRefs.current.get(refocusIdRef.current)?.focus()
    refocusIdRef.current = null
  }, [items])

  function onHandleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const to = e.key === 'ArrowUp' ? index - 1 : index + 1
    if (to < 0 || to >= items.length) return
    refocusIdRef.current = ids[index]!
    onReorder(arrayMove(items, index, to))
  }

  function handleRef(id: string) {
    return (el: HTMLButtonElement | null) => {
      if (el) handleRefs.current.set(id, el)
      else handleRefs.current.delete(id)
    }
  }

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    const from = indexOf(String(active.id))
    const to = indexOf(String(over.id))
    if (from !== -1 && to !== -1) onReorder(arrayMove(items, from, to))
  }

  function onDragCancel() {
    setActiveId(null)
  }

  return {
    dndProps: {
      sensors,
      collisionDetection: closestCenter,
      modifiers: [restrictToVerticalAxis],
      onDragStart,
      onDragEnd,
      onDragCancel,
    },
    ids,
    activeIndex: activeId ? indexOf(activeId) : -1,
    handleRef,
    onHandleKeyDown,
  }
}
