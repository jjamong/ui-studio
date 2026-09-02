import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContentArea } from '../components/ContentArea'

const meta: Meta<typeof ContentArea> = {
  title: '컴포넌트/ContentArea',
  component: ContentArea,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof ContentArea>

export const Playground: Story = {
  render: () => (
    <div className="bg-[var(--ds-surface-sunken)] p-4">
      <ContentArea>
        <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">상세</h1>
      </ContentArea>
    </div>
  ),
}
