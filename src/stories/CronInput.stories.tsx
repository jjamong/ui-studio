import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CronInput } from '../components/CronInput'

const meta: Meta<typeof CronInput> = {
  title: '컴포넌트/CronInput',
  component: CronInput,
  args: { label: 'cron 표현식', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof CronInput>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('0 9 * * *')
    return (
      <div className="w-56">
        <CronInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <CronInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const InvalidFormat: Story = {
  render: (args) => {
    const [value, setValue] = useState('0 9 * *')
    return (
      <div className="w-56">
        <CronInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithError: Story = {
  args: { error: 'cron 표현식을 입력해주세요.' },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <CronInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
