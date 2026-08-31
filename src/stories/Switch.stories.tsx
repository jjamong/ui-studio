import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '../components/Switch'

const meta: Meta<typeof Switch> = {
  title: '컴포넌트/Switch',
  component: Switch,
  args: {
    label: '알림 받기',
    description: '새 소식이 있을 때 알려드려요.',
  },
}
export default meta

type Story = StoryObj<typeof Switch>

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Switch {...args} checked={false} onChange={() => {}} />,
}
