import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

const meta: Meta<typeof EmptyState> = {
  title: '컴포넌트/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'radio', options: [undefined, 'search', 'data'] },
  },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const 데이터없음: Story = {
  args: {
    variant: 'data',
    description: '항목을 추가하면 여기에 목록으로 표시됩니다.',
    action: <Button size="sm">항목 추가</Button>,
  },
}

export const 검색결과없음: Story = {
  args: { variant: 'search' },
}
