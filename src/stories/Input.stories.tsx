import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { Input } from '../components/Input'

const meta: Meta<typeof Input> = {
  title: '컴포넌트/Input',
  component: Input,
  args: {
    label: '이름',
    placeholder: '입력하세요',
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof Input>

export const Playground: Story = {}

export const WithIcon: Story = {
  args: { label: '검색', icon: <Search size={14} />, placeholder: '검색어 입력...' },
}

export const WithError: Story = {
  args: { label: '이메일', error: '올바른 이메일 형식이 아닙니다.', defaultValue: 'invalid-email' },
}

export const Disabled: Story = {
  args: { label: '이름', disabled: true, defaultValue: '수정 불가' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
}
