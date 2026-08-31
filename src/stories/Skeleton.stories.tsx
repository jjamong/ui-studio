import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '../components/Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: '컴포넌트/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: { control: 'select', options: ['text', 'rect', 'circle'] },
  },
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton variant="text" width={120} />
      <Skeleton variant="rect" width={80} height={48} />
      <Skeleton variant="circle" width={40} height={40} />
    </div>
  ),
}

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2 rounded border border-[var(--ds-border)] p-3">
      <Skeleton variant="circle" width={32} height={32} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
    </div>
  ),
}
