import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../components/Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: '컴포넌트/Checkbox',
  component: Checkbox,
  args: { label: '전체 동의' },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '일부 선택됨' },
  render: (args) => <Checkbox {...args} checked={false} onChange={() => {}} />,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Checkbox {...args} checked={false} onChange={() => {}} />,
}
