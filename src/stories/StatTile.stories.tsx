import type { Meta, StoryObj } from '@storybook/react-vite'
import { Wallet } from 'lucide-react'
import { StatTile } from '../components/StatTile'

const meta: Meta<typeof StatTile> = {
  title: '컴포넌트/StatTile',
  component: StatTile,
  parameters: { layout: 'padded' },
  args: {
    label: '총 자산',
    value: '₩128,420,000',
  },
}
export default meta

type Story = StoryObj<typeof StatTile>

export const Playground: Story = {
  render: (args) => (
    <div className="w-64">
      <StatTile {...args} />
    </div>
  ),
}

/** 대시보드 상단에 여러 지표를 나란히 두는 가장 흔한 배치. */
export const KPI로우: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3">
      <StatTile
        label="총 자산"
        value="₩128,420,000"
        description="전월 대비"
        icon={<Wallet size={16} />}
        trend={{ direction: 'up', value: '+2.4%' }}
      />
      <StatTile
        label="이번 달 지출"
        value="₩3,120,000"
        description="전월 대비"
        trend={{ direction: 'up', value: '+8.1%', invert: true }}
      />
      <StatTile label="보유 종목 수" value="17" description="증권 계좌 합산" />
    </div>
  ),
}
