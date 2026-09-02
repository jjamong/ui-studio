import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '../components/Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: '컴포넌트/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: '공지사항', onClick: () => {} },
      { label: '이벤트', onClick: () => {} },
      { label: '커뮤니티 정기 모임 안내' },
    ],
  },
}
export default meta

type Story = StoryObj<typeof Breadcrumb>

export const Playground: Story = {}

export const SingleItem: Story = {
  args: { items: [{ label: '홈' }] },
}
