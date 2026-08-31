import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextArea } from '../components/TextArea'

const meta: Meta<typeof TextArea> = {
  title: '컴포넌트/TextArea',
  component: TextArea,
  args: {
    label: '메모',
    placeholder: '내용을 입력하세요',
  },
}
export default meta

type Story = StoryObj<typeof TextArea>

export const Playground: Story = {}

export const WithError: Story = {
  args: { error: '필수 입력 항목입니다.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '수정 불가' },
}
