import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../components/Badge'

const meta: Meta<typeof Badge> = {
  title: '컴포넌트/Badge',
  component: Badge,
  args: { children: '진행중', variant: 'neutral' },
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'brand', 'danger', 'success', 'information'] },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral">중립</Badge>
      <Badge variant="brand">브랜드</Badge>
      <Badge variant="danger">위험</Badge>
      <Badge variant="success">성공</Badge>
      <Badge variant="information">정보</Badge>
    </div>
  ),
}
