import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimePicker } from '../components/TimePicker'

const meta: Meta<typeof TimePicker> = {
  title: '컴포넌트/TimePicker',
  component: TimePicker,
  args: { label: '알림 시각', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof TimePicker>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('09:30')
    return (
      <div className="w-56">
        <TimePicker {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <TimePicker {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
