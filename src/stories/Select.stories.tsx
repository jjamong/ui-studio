import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from '../components/Select'

const options = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'daegu', label: '대구' },
]

const meta: Meta<typeof Select> = {
  title: '컴포넌트/Select',
  component: Select,
  args: {
    label: '지역',
    options,
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof Select>

export const Playground: Story = {}

export const WithError: Story = {
  args: { error: '지역을 선택해주세요.' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
