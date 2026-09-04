import type { Meta, StoryObj } from '@storybook/react-vite'
import { Meter } from '../components/Meter'

const meta: Meta<typeof Meter> = {
  title: '컴포넌트/Meter',
  component: Meter,
  parameters: { layout: 'padded' },
  args: { value: 72, label: '이번 달 예산 사용률', showValue: true },
  argTypes: {
    variant: { control: 'select', options: ['brand', 'neutral', 'danger', 'success', 'information'] },
  },
}
export default meta

type Story = StoryObj<typeof Meter>

export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <Meter {...args} />
    </div>
  ),
}

/** 값 구간에 따라 안전/경고/위험처럼 색을 다르게 쓰고 싶을 때. */
export const 변형: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Meter value={30} label="여유" variant="success" showValue />
      <Meter value={65} label="주의" variant="information" showValue />
      <Meter value={92} label="위험" variant="danger" showValue />
    </div>
  ),
}
