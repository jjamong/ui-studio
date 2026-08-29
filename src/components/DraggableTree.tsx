import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { ChevronRight, File as FileIcon, Folder, FolderOpen, GripVertical } from 'lucide-react'
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

function DraggableRow({
  node,
  depth,
  size,
  isExpanded,
  hasChildren,
  isSelected,
  dropIndicator,
  onToggleExpand,
  onSelectNode,
}: {
  node: TreeNode
  depth: number
  size: TreeSize
  isExpanded: boolean
  hasChildren: boolean
  isSelected: boolean
  dropIndicator: DropIndicator | null
  onToggleExpand: (id: string) => void
  onSelectNode: (node: TreeNode) => void
}) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    data: { node },
    disabled: node.disabled,
  })
  const { setNodeRef: setDropRef } = useDroppable({ id: node.id, data: { node }, disabled: node.disabled })

  const isDropTarget = dropIndicator?.id === node.id

  return (
    <div className="relative">
      {isDropTarget && dropIndicator?.position === 'before' && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--ds-background-brand-bold)]" style={{ marginLeft: depth * 16 + 4 }} />
      )}
      <div
        ref={(el) => {
          setDragRef(el)
          setDropRef(el)
        }}
        className={clsx(
          'flex items-center gap-1 rounded pr-2 transition-colors',
          rowHeightClass[size],
          node.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[var(--ds-background-neutral-hovered)]',
          isSelected && 'bg-[var(--ds-background-selected)] font-semibold text-[var(--ds-text-selected)]',
          isDropTarget && dropIndicator?.position === 'inside' && 'bg-[var(--ds-background-selected)]',
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

        {!node.disabled && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            aria-label="드래그해서 이동"
            className="ml-auto flex h-5 w-5 shrink-0 cursor-grab items-center justify-center text-[var(--ds-text-subtlest)] hover:text-[var(--ds-text-subtle)] active:cursor-grabbing"
          >
            <GripVertical size={13} />
          </button>
        )}
      </div>
      {isDropTarget && dropIndicator?.position === 'after' && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--ds-background-brand-bold)]" style={{ marginLeft: depth * 16 + 4 }} />
      )}
    </div>
  )
}

/** 드래그로 순서 변경/이동이 가능한 트리. 정적 표시만 필요하면 Tree를 사용한다. */
export function DraggableTree({ data, size = 'default', defaultExpandedIds = [], selectedId, onSelect, onMove }: DraggableTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) {
      setDropIndicator(null)
      return
    }
    const activeRect = active.rect.current.translated
    if (!activeRect) return
    const overRect = over.rect
    const relative = (activeRect.top + activeRect.height / 2 - overRect.top) / overRect.height
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

    return (
      <div key={node.id}>
        <DraggableRow
          node={node}
          depth={depth}
          size={size}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          isSelected={selectedId === node.id}
          dropIndicator={dropIndicator}
          onToggleExpand={toggleExpand}
          onSelectNode={(n) => onSelect?.(n.id, n)}
        />
        {hasChildren && isExpanded && <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
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
