import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreHorizontal } from 'lucide-react'
import { Tree } from '../components/Tree'
import type { TreeNode } from '../components/Tree'

const data: TreeNode[] = [
  {
    id: 'notice',
    label: '공지사항',
    children: [
      { id: 'notice-1', label: '시스템 점검 안내' },
      { id: 'notice-2', label: '이용약관 개정 안내' },
    ],
  },
  {
    id: 'user',
    label: '사용자',
    children: [
      { id: 'user-1', label: '관리자' },
      { id: 'user-2', label: '일반회원' },
    ],
  },
  { id: 'setting', label: '설정', disabled: true },
]

const meta: Meta<typeof Tree> = {
  title: '컴포넌트/Tree',
  component: Tree,
  args: { data, defaultExpandedIds: ['notice'] },
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
    const [selectedId, setSelectedId] = useState('notice-1')
    return <Tree {...args} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} />
  },
}

export const Checkable: Story = {
  args: { mode: 'checkable' },
  render: (args) => {
    const [checkedIds, setCheckedIds] = useState<string[]>(['notice-1'])
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
