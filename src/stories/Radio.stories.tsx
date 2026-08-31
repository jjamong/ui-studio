import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup } from '../components/Radio'
import type { RadioGroupProps } from '../components/Radio'

const options = [
  { value: 'card', label: '부동산' },
  { value: 'cash', label: '현금성 자산' },
  { value: 'stock', label: '주식' },
]

const meta: Meta<typeof RadioGroup> = {
  title: '컴포넌트/RadioGroup',
  component: RadioGroup,
  args: { options, layout: 'vertical' },
  argTypes: {
    layout: { control: 'radio', options: ['vertical', 'horizontal'] },
  },
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const Playground: Story = {
  render: (args: RadioGroupProps) => {
    const [value, setValue] = useState('card')
    return <RadioGroup {...args} value={value} onChange={setValue} />
  },
}

export const Horizontal: Story = {
  args: { layout: 'horizontal' },
  render: (args: RadioGroupProps) => {
    const [value, setValue] = useState('card')
    return <RadioGroup {...args} value={value} onChange={setValue} />
  },
}
