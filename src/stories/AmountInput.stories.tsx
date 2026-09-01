import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AmountInput } from '../components/AmountInput'

const meta: Meta<typeof AmountInput> = {
  title: '컴포넌트/AmountInput',
  component: AmountInput,
  args: { label: '금액', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof AmountInput>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('1500000')
    return (
      <div className="w-56">
        <AmountInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithSuffix: Story = {
  args: { suffix: '원' },
  render: (args) => {
    const [value, setValue] = useState('1500000')
    return (
      <div className="w-56">
        <AmountInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const Empty: Story = {
  args: { placeholder: '금액 입력' },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <AmountInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithError: Story = {
  args: { error: '금액을 입력해주세요.' },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-56">
        <AmountInput {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
