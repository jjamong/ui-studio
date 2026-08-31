import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CustomSelect } from '../components/CustomSelect'

const options = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'daegu', label: '대구' },
]

const meta: Meta<typeof CustomSelect> = {
  title: '컴포넌트/CustomSelect',
  component: CustomSelect,
  args: { options, placeholder: '지역 선택' },
}
export default meta

type Story = StoryObj<typeof CustomSelect>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return <div className="w-56"><CustomSelect {...args} value={value} onChange={setValue} /></div>
  },
}

export const Empty: Story = {
  args: { options: [] },
  render: (args) => {
    const [value, setValue] = useState('')
    return <div className="w-56"><CustomSelect {...args} value={value} onChange={setValue} /></div>
  },
}
