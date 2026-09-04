import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrendBadge } from '../components/TrendBadge'

const meta: Meta<typeof TrendBadge> = {
  title: '컴포넌트/TrendBadge',
  component: TrendBadge,
  args: { direction: 'up', value: '+2.4%' },
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'flat'] },
  },
}
export default meta

type Story = StoryObj<typeof TrendBadge>

export const Playground: Story = {}

/** 상승은 성공색, 하락은 위험색, 보합은 중립색이 기본이다. */
export const 방향: Story = {
  render: () => (
    <div className="flex gap-2">
      <TrendBadge direction="up" value="+2.4%" />
      <TrendBadge direction="down" value="-1.1%" />
      <TrendBadge direction="flat" value="0.0%" />
    </div>
  ),
}

/** 원자재/비용/리스크처럼 내려가야 좋은 지표는 invert로 색을 뒤집는다. */
export const 색반전: Story = {
  render: () => (
    <div className="flex gap-2">
      <TrendBadge direction="up" value="+3.2%" invert />
      <TrendBadge direction="down" value="-0.8%" invert />
    </div>
  ),
}
