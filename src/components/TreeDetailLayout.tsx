import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export type TreeDetailLayoutTreeWidth = 'sm' | 'md' | 'lg'

const TREE_WIDTH: Record<TreeDetailLayoutTreeWidth, string> = {
  sm: 'w-56',
  md: 'w-72',
  lg: 'w-80',
}

export interface TreeDetailLayoutProps {
  /** 왼쪽 영역의 트리. 보통 Tree 또는 DraggableTree를 넘긴다. */
  tree: ReactNode
  /** 트리 위 제목(왼쪽). 비우면 제목 줄 없이 treeActions만 오른쪽에 둔다. */
  treeTitle?: ReactNode
  /** 트리 위 오른쪽 버튼 자리(등록 등). */
  treeActions?: ReactNode
  /** 왼쪽 영역 폭. 항목 이름이 길면 넓힌다(기본 md). */
  treeWidth?: TreeDetailLayoutTreeWidth
  /** 오른쪽 상세 영역. 선택한 트리 노드의 내용을 넣는다. */
  children: ReactNode
  className?: string
}

/**
 * 왼쪽 트리로 탐색하고 오른쪽에 선택한 항목의 상세를 보여주는 페이지 단위 레이아웃.
 * ContentArea 안에 바로 배치하는 용도라 자체 테두리/배경 박스를 두지 않고(이중 테두리 금지),
 * 두 영역 사이만 세로 구분선으로 나눈다. 트리와 상세는 각자 따로 스크롤된다.
 */
export function TreeDetailLayout({
  tree,
  treeTitle,
  treeActions,
  treeWidth = 'md',
  children,
  className,
}: TreeDetailLayoutProps) {
  const hasHeader = treeTitle !== undefined || treeActions !== undefined
  return (
    <div className={clsx('flex min-h-0 flex-1 gap-6', className)}>
      <aside
        className={clsx(
          'flex shrink-0 flex-col overflow-y-auto border-r border-[var(--ds-border)] pr-4',
          TREE_WIDTH[treeWidth],
        )}
      >
        {hasHeader && (
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-[var(--ds-text)]">{treeTitle}</span>
            {treeActions && <div className="flex shrink-0 items-center gap-1">{treeActions}</div>}
          </div>
        )}
        {tree}
      </aside>
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
