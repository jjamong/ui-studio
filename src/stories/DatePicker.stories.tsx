import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '../components/DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: '컴포넌트/DatePicker',
  component: DatePicker,
  args: { label: '기준일', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof DatePicker>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('20260901')
    return (
      <div className="w-56">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithMinMax: Story = {
  args: { minDate: '20260101', maxDate: '20261231' },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithError: Story = {
  args: { error: '기준일을 선택해주세요.' },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => {
    const [value, setValue] = useState('20260901')
    return (
      <div className="w-56">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
