import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home, Megaphone, Users, Settings } from 'lucide-react'
import { NavRail } from '../components/NavRail'

const items = [
  { key: 'home', label: '홈', icon: <Home size={16} /> },
  { key: 'notice', label: '공지사항', icon: <Megaphone size={16} />, active: true },
  { key: 'user', label: '사용자', icon: <Users size={16} /> },
  { key: 'settings', label: '설정', icon: <Settings size={16} /> },
]

const meta: Meta<typeof NavRail> = {
  title: '컴포넌트/NavRail',
  component: NavRail,
  args: { items },
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof NavRail>

export const Playground: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div className="flex h-64 bg-[var(--ds-surface-sunken)]">
        <NavRail {...args} collapsed={collapsed} />
        <button
          type="button"
          className="m-3 h-7 rounded border border-[var(--ds-border)] px-2.5 text-xs"
          onClick={() => setCollapsed((c) => !c)}
        >
          접기/펼치기 토글
        </button>
      </div>
    )
  },
}

export const Collapsed: Story = {
  args: { collapsed: true },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="flex h-64 bg-[var(--ds-surface-sunken)]">
      <NavRail {...args} />
    </div>
  ),
}
