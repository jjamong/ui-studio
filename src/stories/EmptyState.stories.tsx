import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

const meta: Meta<typeof EmptyState> = {
  title: '컴포넌트/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Playground: Story = {
  args: {
    icon: <Inbox size={32} />,
    title: '등록된 자산이 없습니다',
    description: '자산을 추가하면 여기에 목록으로 표시됩니다.',
    action: <Button size="sm">자산 추가</Button>,
  },
}

export const NoDescription: Story = {
  args: { icon: <Inbox size={32} />, title: '검색 결과가 없습니다' },
}
