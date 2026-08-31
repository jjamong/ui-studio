import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pencil, Trash2, Copy } from 'lucide-react'
import { DropdownMenu } from '../components/DropdownMenu'
import { Button } from '../components/Button'

const meta: Meta<typeof DropdownMenu> = {
  title: '컴포넌트/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Playground: Story = {
  render: () => (
    <div className="flex justify-center py-16">
      <DropdownMenu
        trigger={<Button variant="secondary">작업 ▾</Button>}
        items={[
          { key: 'edit', label: '수정', icon: <Pencil size={14} />, onSelect: () => {} },
          { key: 'duplicate', label: '복제', icon: <Copy size={14} />, onSelect: () => {} },
          { key: 'delete', label: '삭제', icon: <Trash2 size={14} />, danger: true, onSelect: () => {} },
        ]}
      />
    </div>
  ),
}
