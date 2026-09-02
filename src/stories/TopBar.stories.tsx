import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TopBar } from '../components/TopBar'

const meta: Meta<typeof TopBar> = {
  title: '컴포넌트/TopBar',
  component: TopBar,
  args: {
    logo: <div className="h-5 w-5 rounded bg-[var(--ds-background-brand-bold)]" />,
    title: 'Design System',
  },
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof TopBar>

export const Playground: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false)
    return <TopBar {...args} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
  },
}

export const WithRightSlot: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <TopBar
        {...args}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        right={<span className="text-xs text-[var(--ds-text-subtle)]">user@example.com</span>}
      />
    )
  },
}
