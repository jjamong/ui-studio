import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '../components/Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: '컴포넌트/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: '자산', onClick: () => {} },
      { label: '부동산', onClick: () => {} },
      { label: '강남 오피스텔' },
    ],
  },
}
export default meta

type Story = StoryObj<typeof Breadcrumb>

export const Playground: Story = {}

export const SingleItem: Story = {
  args: { items: [{ label: '홈' }] },
}
