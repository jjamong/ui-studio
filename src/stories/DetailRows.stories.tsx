import type { Meta, StoryObj } from '@storybook/react-vite'
import { DetailRows } from '../components/DetailRows'

const meta: Meta<typeof DetailRows> = {
  title: '컴포넌트/DetailRows',
  component: DetailRows,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof DetailRows>

export const Playground: Story = {
  args: {
    rows: [
      { label: '제목', value: '시스템 점검 안내' },
      { label: '작성자', value: '관리자' },
      { label: '등록일', value: '2024-01-15' },
      { label: '상태', value: '게시중' },
    ],
  },
}

export const 강조점포함: Story = {
  args: {
    labelWidthClass: 'w-24',
    rows: [
      { label: '카테고리', value: '공지', dotColor: '#3B82F6' },
      { label: '작성자', value: '관리자' },
    ],
  },
}
