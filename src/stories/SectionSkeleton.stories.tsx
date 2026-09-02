import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionSkeleton } from '../components/SectionSkeleton'

const meta: Meta<typeof SectionSkeleton> = {
  title: '컴포넌트/SectionSkeleton',
  component: SectionSkeleton,
}
export default meta

type Story = StoryObj<typeof SectionSkeleton>

export const 기본: Story = {
  render: () => (
    <div className="w-72">
      <SectionSkeleton rows={3} />
    </div>
  ),
}

export const 헤더포함: Story = {
  render: () => (
    <div className="w-72">
      <SectionSkeleton showHeader rows={4} rowHeight="16px" />
    </div>
  ),
}
