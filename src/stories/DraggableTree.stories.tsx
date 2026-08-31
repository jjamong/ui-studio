import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DraggableTree } from '../components/DraggableTree'
import type { DropPosition } from '../components/DraggableTree'
import type { TreeNode } from '../components/Tree'
import { Trash2 } from 'lucide-react'

const initialData: TreeNode[] = [
  {
    id: 'real-estate',
    label: '부동산',
    children: [
      { id: 're-1', label: '강남 오피스텔' },
      { id: 're-2', label: '판교 아파트' },
    ],
  },
  {
    id: 'cash',
    label: '현금성 자산',
    children: [{ id: 'cash-1', label: '입출금 통장' }],
  },
  { id: 'stock', label: '주식' },
]

function removeNode(nodes: TreeNode[], id: string): { removed: TreeNode | null; rest: TreeNode[] } {
  let removed: TreeNode | null = null
  const rest = nodes
    .filter((node) => {
      if (node.id === id) {
        removed = node
        return false
      }
      return true
    })
    .map((node) => {
      if (!node.children || removed) return node
      const result = removeNode(node.children, id)
      if (result.removed) removed = result.removed
      return { ...node, children: result.rest }
    })
  return { removed, rest }
}

function insertNode(nodes: TreeNode[], targetId: string, position: DropPosition, node: TreeNode): TreeNode[] {
  const idx = nodes.findIndex((n) => n.id === targetId)
  if (idx !== -1) {
    if (position === 'inside') {
      const target = nodes[idx]!
      return nodes.map((n, i) => (i === idx ? { ...target, children: [...(target.children ?? []), node] } : n))
    }
    const next = [...nodes]
    next.splice(position === 'before' ? idx : idx + 1, 0, node)
    return next
  }
  return nodes.map((n) => (n.children ? { ...n, children: insertNode(n.children, targetId, position, node) } : n))
}

const meta: Meta<typeof DraggableTree> = {
  title: '컴포넌트/DraggableTree',
  component: DraggableTree,
}
export default meta

type Story = StoryObj<typeof DraggableTree>

export const Playground: Story = {
  render: () => {
    const [data, setData] = useState(initialData)
    const [selectedId, setSelectedId] = useState<string>()

    return (
      <DraggableTree
        data={data}
        defaultExpandedIds={['real-estate', 'cash']}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        onMove={(draggedId, targetId, position) => {
          setData((prev) => {
            const { removed, rest } = removeNode(prev, draggedId)
            if (!removed) return prev
            return insertNode(rest, targetId, position, removed)
          })
        }}
        renderRowEnd={(node) => (
          <button
            type="button"
            className="rounded p-1 text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-danger-hovered)] hover:text-[var(--ds-text-danger)]"
            onClick={() => setData((prev) => removeNode(prev, node.id).rest)}
            aria-label="삭제"
          >
            <Trash2 size={13} />
          </button>
        )}
      />
    )
  },
}
