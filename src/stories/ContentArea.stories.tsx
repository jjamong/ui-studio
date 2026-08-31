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
        <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">부동산</h1>
        <p className="text-sm text-[var(--ds-text-subtle)]">
          좌상단이 둥근 본문 컨테이너입니다. 그리드/차트/패널은 이 안에 바로 배치하고, 이중 라운딩은 피합니다.
        </p>
      </ContentArea>
    </div>
  ),
}
