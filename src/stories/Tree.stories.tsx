import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreHorizontal } from 'lucide-react'
import { Tree } from '../components/Tree'
import type { TreeNode } from '../components/Tree'

const data: TreeNode[] = [
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
    children: [
      { id: 'cash-1', label: '입출금 통장' },
      { id: 'cash-2', label: '예금' },
    ],
  },
  { id: 'stock', label: '주식', disabled: true },
]

const meta: Meta<typeof Tree> = {
  title: '컴포넌트/Tree',
  component: Tree,
  args: { data, defaultExpandedIds: ['real-estate'] },
  argTypes: {
    mode: { control: 'select', options: ['default', 'selectable', 'checkable'] },
    size: { control: 'select', options: ['default', 'small'] },
  },
}
export default meta

type Story = StoryObj<typeof Tree>

export const Default: Story = {}

export const Selectable: Story = {
  args: { mode: 'selectable' },
  render: (args) => {
    const [selectedId, setSelectedId] = useState('re-1')
    return <Tree {...args} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} />
  },
}

export const Checkable: Story = {
  args: { mode: 'checkable' },
  render: (args) => {
    const [checkedIds, setCheckedIds] = useState<string[]>(['re-1'])
    return <Tree {...args} checkedIds={checkedIds} onCheckedChange={setCheckedIds} />
  },
}

export const Small: Story = {
  args: { size: 'small' },
}

export const WithHoverActions: Story = {
  args: { size: 'small' },
  render: (args) => (
    <Tree
      {...args}
      renderRowEnd={() => (
        <button
          type="button"
          className="rounded p-1 text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]"
          aria-label="더보기"
        >
          <MoreHorizontal size={14} />
        </button>
      )}
    />
  ),
}
