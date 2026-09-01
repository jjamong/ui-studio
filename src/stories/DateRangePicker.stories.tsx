import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangePicker } from '../components/DateRangePicker'

const meta: Meta<typeof DateRangePicker> = {
  title: '컴포넌트/DateRangePicker',
  component: DateRangePicker,
  args: { label: '조회 기간', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof DateRangePicker>

export const Playground: Story = {
  render: (args) => {
    const [start, setStart] = useState('20260901')
    const [end, setEnd] = useState('20260915')
    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          startValue={start}
          endValue={end}
          onChange={(s, e) => {
            setStart(s)
            setEnd(e)
          }}
        />
      </div>
    )
  },
}

export const Empty: Story = {
  render: (args) => {
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          startValue={start}
          endValue={end}
          onChange={(s, e) => {
            setStart(s)
            setEnd(e)
          }}
        />
      </div>
    )
  },
}
