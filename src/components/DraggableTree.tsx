import { memo, useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
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
import { ChevronRight, File as FileIcon, Folder, FolderOpen } from 'lucide-react'
import { clsx } from 'clsx'
import type { TreeNode, TreeSize } from './Tree'

export type DropPosition = 'before' | 'after' | 'inside'

export interface DraggableTreeProps {
  data: TreeNode[]
  size?: TreeSize
  defaultExpandedIds?: string[]
  selectedId?: string
  onSelect?: (id: string, node: TreeNode) => void
  /**
   * 드래그로 노드를 놓았을 때 호출된다. 실제 트리 데이터(data) 변경은 호출부가 담당한다
   * (예: draggedId를 targetId의 형제/자식으로 옮긴 새 배열을 만들어 다시 렌더링).
   */
  onMove: (draggedId: string, targetId: string, position: DropPosition) => void
  /**
   * 지정하면 각 행 끝에 이 함수가 반환하는 내용을 추가로 렌더링한다(액션 버튼/메뉴 등 —
   * DraggableTree는 내용을 모르는 순수 확장 지점). 행 전체가 드래그 핸들이므로 이 슬롯은
   * 드래그와 무관하며, 클릭이 행 선택으로 전파되지 않게 자체적으로 stopPropagation된다.
   */
  renderRowEnd?: (node: TreeNode, hasChildren: boolean) => ReactNode
}

interface DropIndicator {
  id: string
  position: DropPosition
}

const rowHeightClass: Record<TreeSize, string> = {
  default: 'h-8 text-sm',
  small: 'h-7 text-xs',
}

function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 트리 한 행. dropPosition은 이 행이 현재 드롭 대상일 때만 위치('before'|'after'|'inside')를
 * 담아 전달되고, 그 외에는 null이다(드래그 중 바뀌는 dropIndicator 객체 전체가 아니라 이
 * 행에 해당하는 값만 받아야 memo가 실제로 무관한 행의 리렌더를 걸러낸다).
 */
const DraggableRow = memo(function DraggableRow({
  node,
  depth,
  size,
  isExpanded,
  hasChildren,
  isSelected,
  dropPosition,
  onToggleExpand,
  onSelectNode,
  renderRowEnd,
}: {
  node: TreeNode
  depth: number
  size: TreeSize
  isExpanded: boolean
  hasChildren: boolean
  isSelected: boolean
  dropPosition: DropPosition | null
  onToggleExpand: (id: string) => void
  onSelectNode: (node: TreeNode) => void
  renderRowEnd?: (node: TreeNode, hasChildren: boolean) => ReactNode
}) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    data: { node },
    disabled: node.disabled,
  })
  const { setNodeRef: setDropRef } = useDroppable({ id: node.id, data: { node }, disabled: node.disabled })

  const isDropTarget = dropPosition !== null

  return (
    <div className="relative">
      {isDropTarget && dropPosition === 'before' && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--ds-background-brand-bold)]" style={{ marginLeft: depth * 16 + 4 }} />
      )}
      <div
        ref={(el) => {
          setDragRef(el)
          setDropRef(el)
        }}
        {...(node.disabled ? {} : attributes)}
        {...(node.disabled ? {} : listeners)}
        className={clsx(
          'group flex items-center gap-1 rounded pr-2 transition-colors',
          rowHeightClass[size],
          node.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab hover:bg-[var(--ds-background-neutral-hovered)] active:cursor-grabbing',
          isSelected && 'bg-[var(--ds-background-selected)] font-semibold text-[var(--ds-text-selected)]',
          isDropTarget && dropPosition === 'inside' && 'bg-[var(--ds-background-selected)]',
          isDragging && 'opacity-40',
        )}
        style={{ paddingLeft: depth * 16 + 4 }}
        onClick={() => !node.disabled && onSelectNode(node)}
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) onToggleExpand(node.id)
          }}
          className={clsx(
            'flex h-4 w-4 shrink-0 items-center justify-center text-[var(--ds-text-subtle)] transition-transform',
            hasChildren ? 'cursor-pointer' : 'invisible',
            isExpanded && 'rotate-90',
          )}
          aria-label={isExpanded ? '접기' : '펼치기'}
        >
          <ChevronRight size={13} />
        </button>

        <span className="flex shrink-0 items-center text-[var(--ds-text-subtle)]">
          {node.icon ?? (hasChildren ? (isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />) : <FileIcon size={14} />)}
        </span>

        <span className={clsx('truncate', isSelected ? 'text-[var(--ds-text-selected)]' : 'text-[var(--ds-text)]')}>
          {node.label}
        </span>

        {!node.disabled && renderRowEnd && (
          <span
            className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {renderRowEnd(node, hasChildren)}
          </span>
        )}
      </div>
      {isDropTarget && dropPosition === 'after' && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--ds-background-brand-bold)]" style={{ marginLeft: depth * 16 + 4 }} />
      )}
    </div>
  )
})

/** 드래그로 순서 변경/이동이 가능한 트리. 정적 표시만 필요하면 Tree를 사용한다. */
export function DraggableTree({
  data,
  size = 'default',
  defaultExpandedIds = [],
  selectedId,
  onSelect,
  onMove,
  renderRowEnd,
}: DraggableTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null)
  /** 드래그 시작 시점의 포인터 y좌표. dragOver 중 delta.y를 더해 실제 포인터 위치를 복원한다
   * (드래그 중인 요소 사각형의 겹침 면적이 아니라 커서가 실제로 어느 행 위에 있는지로
   * before/after/inside를 판정해야 그룹 경계 근처에서 헤더가 잘못 선택되지 않는다). */
  const pointerStartYRef = useRef<number | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSelectNode = useCallback((node: TreeNode) => onSelect?.(node.id, node), [onSelect])

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
    let relative: number
    if (pointerStartYRef.current !== null) {
      relative = (pointerStartYRef.current + delta.y - overRect.top) / overRect.height
    } else {
      const activeRect = active.rect.current.translated
      if (!activeRect) return
      relative = (activeRect.top + activeRect.height / 2 - overRect.top) / overRect.height
    }
    const position: DropPosition = relative < 0.25 ? 'before' : relative > 0.75 ? 'after' : 'inside'
    setDropIndicator({ id: String(over.id), position })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (dropIndicator && over && active.id !== over.id) {
      onMove(String(active.id), dropIndicator.id, dropIndicator.position)
    }
    setActiveId(null)
    setDropIndicator(null)
  }

  const activeNode = activeId ? findNode(data, activeId) : undefined

  function renderNode(node: TreeNode, depth: number) {
    const hasChildren = !!node.children && node.children.length > 0
    const isExpanded = expandedIds.has(node.id)
    const dropPosition = dropIndicator?.id === node.id ? dropIndicator.position : null
    // 자식 목록의 세로 가이드라인을 이 노드의 펼침 화살표 중앙(paddingLeft + 화살표 폭의 절반)에 맞춘다.
    const guideLeft = depth * 16 + 4 + 8

    return (
      <div key={node.id}>
        <DraggableRow
          node={node}
          depth={depth}
          size={size}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          isSelected={selectedId === node.id}
          dropPosition={dropPosition}
          onToggleExpand={toggleExpand}
          onSelectNode={handleSelectNode}
          renderRowEnd={renderRowEnd}
        />
        {hasChildren && isExpanded && (
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-[var(--ds-border)]"
              style={{ left: guideLeft }}
            />
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col">{data.map((node) => renderNode(node, 0))}</div>
      <DragOverlay>
        {activeNode && (
          <div className={clsx('flex items-center gap-1.5 rounded border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] px-2 shadow-[var(--ds-shadow-overlay)]', rowHeightClass[size])}>
            <span className="flex shrink-0 items-center text-[var(--ds-text-subtle)]">
              {activeNode.icon ?? (activeNode.children?.length ? <Folder size={14} /> : <FileIcon size={14} />)}
            </span>
            <span className="truncate text-[var(--ds-text)]">{activeNode.label}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
