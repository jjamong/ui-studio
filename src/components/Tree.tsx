import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronRight, Folder, FolderOpen, File as FileIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { Checkbox } from './Checkbox'

export interface TreeNode {
  id: string
  label: ReactNode
  icon?: ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export type TreeMode = 'default' | 'selectable' | 'checkable'
export type TreeSize = 'default' | 'small'

export interface TreeProps {
  data: TreeNode[]
  mode?: TreeMode
  size?: TreeSize
  /** 처음 렌더링 시 펼쳐진 상태로 시작할 노드 id 목록. 펼침 상태는 이후 내부에서 관리한다. */
  defaultExpandedIds?: string[]
  /** mode="selectable"일 때 선택된 노드 id. */
  selectedId?: string
  onSelect?: (id: string, node: TreeNode) => void
  /** mode="checkable"일 때 체크된 노드 id 목록. */
  checkedIds?: string[]
  onCheckedChange?: (ids: string[]) => void
  /**
   * 지정하면 각 행 끝에 이 함수가 반환하는 내용을 추가로 렌더링한다(더보기 메뉴 등).
   * 평소엔 숨겨져 있다가 행에 마우스를 올렸을 때만 나타난다. 클릭이 행 선택으로 전파되지
   * 않게 자체적으로 stopPropagation된다.
   */
  renderRowEnd?: (node: TreeNode, hasChildren: boolean) => ReactNode
}

const rowHeightClass: Record<TreeSize, string> = {
  default: 'h-8 text-sm',
  small: 'h-7 text-xs',
}

function collectIds(node: TreeNode): string[] {
  return [node.id, ...(node.children ?? []).flatMap(collectIds)]
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

/** 폴더/파일 탐색기 스타일의 공용 트리. 정적 표시 + 선택(selectable) + 체크(checkable) 모드를 지원한다. */
export function Tree({
  data,
  mode = 'default',
  size = 'default',
  defaultExpandedIds = [],
  selectedId,
  onSelect,
  checkedIds = [],
  onCheckedChange,
  renderRowEnd,
}: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleCheck(node: TreeNode) {
    if (!onCheckedChange) return
    const idsUnderNode = collectIds(node)
    const checkedSet = new Set(checkedIds)
    const isChecked = checkedSet.has(node.id)
    if (isChecked) {
      idsUnderNode.forEach((id) => checkedSet.delete(id))
    } else {
      idsUnderNode.forEach((id) => checkedSet.add(id))
    }
    onCheckedChange(Array.from(checkedSet))
  }

  function checkStateOf(node: TreeNode): { checked: boolean; indeterminate: boolean } {
    const checkedSet = new Set(checkedIds)
    if (!node.children || node.children.length === 0) {
      return { checked: checkedSet.has(node.id), indeterminate: false }
    }
    const descendantIds = collectIds(node).filter((id) => id !== node.id)
    const checkedCount = descendantIds.filter((id) => checkedSet.has(id)).length
    return {
      checked: checkedCount === descendantIds.length,
      indeterminate: checkedCount > 0 && checkedCount < descendantIds.length,
    }
  }

  function renderNode(node: TreeNode, depth: number) {
    const hasChildren = !!node.children && node.children.length > 0
    const isExpanded = expandedIds.has(node.id)
    const isSelected = mode === 'selectable' && selectedId === node.id
    const { checked, indeterminate } = mode === 'checkable' ? checkStateOf(node) : { checked: false, indeterminate: false }
    // 자식 목록의 세로 가이드라인을 이 노드의 펼침 화살표 중앙(paddingLeft + 화살표 폭의 절반)에 맞춘다.
    const guideLeft = depth * 16 + 4 + 8

    return (
      <div key={node.id}>
        <div
          className={clsx(
            'group flex items-center gap-1 rounded pr-2 transition-colors',
            rowHeightClass[size],
            node.disabled
              ? 'cursor-not-allowed opacity-50'
              : mode === 'selectable' && 'cursor-pointer hover:bg-[var(--ds-background-neutral-hovered)]',
            isSelected && 'bg-[var(--ds-background-selected)] font-semibold text-[var(--ds-text-selected)]',
          )}
          style={{ paddingLeft: depth * 16 + 4 }}
          onClick={() => {
            if (node.disabled) return
            if (mode === 'selectable') onSelect?.(node.id, node)
          }}
        >
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) toggleExpand(node.id)
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

          {mode === 'checkable' && (
            <span onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                disabled={node.disabled}
                onChange={() => toggleCheck(node)}
              />
            </span>
          )}

          <span className="flex shrink-0 items-center text-[var(--ds-text-subtle)]">
            {node.icon ?? (hasChildren ? (isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />) : <FileIcon size={14} />)}
          </span>

          <span className={clsx('truncate', isSelected ? 'text-[var(--ds-text-selected)]' : 'text-[var(--ds-text)]')}>
            {node.label}
          </span>

          {!node.disabled && renderRowEnd && (
            <span
              className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              {renderRowEnd(node, hasChildren)}
            </span>
          )}
        </div>

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

  return <div className="flex flex-col">{data.map((node) => renderNode(node, 0))}</div>
}

export { findNode as findTreeNode, collectIds as collectTreeNodeIds }
