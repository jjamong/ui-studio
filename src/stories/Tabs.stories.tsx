import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '../components/Tabs'
import type { TabsProps } from '../components/Tabs'

const items = [
  { key: 'run', label: '실행' },
  { key: 'task', label: '태스크' },
  { key: 'disabled', label: '비활성', disabled: true },
]

const meta: Meta<typeof Tabs> = {
  title: '컴포넌트/Tabs',
  component: Tabs,
  args: { items },
}
export default meta

type Story = StoryObj<typeof Tabs>

export const Playground: Story = {
  render: (args: TabsProps) => {
    const [activeKey, setActiveKey] = useState('run')
    return (
      <div>
        <Tabs {...args} activeKey={activeKey} onChange={setActiveKey} />
        <div className="p-4 text-sm text-[var(--ds-text-subtle)]">
          {activeKey === 'run' && '실행 이력 목록이 여기에 표시됩니다.'}
          {activeKey === 'task' && '태스크(파이프라인) 구성이 여기에 표시됩니다.'}
        </div>
      </div>
    )
  },
}
