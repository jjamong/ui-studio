import type { Meta, StoryObj } from '@storybook/react-vite'
import { PiggyBank, TrendingUp, Wallet } from 'lucide-react'
import { StatTile } from '../components/StatTile'
import { Meter } from '../components/Meter'
import { Card } from '../components/Card'

const meta: Meta = {
  title: '패턴/통계',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

/** 대시보드 상단 KPI 로우 + 아래 목표 달성률 카드까지 묶은 조합. StatTile/TrendBadge/Meter를 함께 쓴다. */
export const 대시보드요약: Story = {
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatTile
          label="총 자산"
          value="₩128,420,000"
          description="전월 대비"
          icon={<Wallet size={16} />}
          trend={{ direction: 'up', value: '+2.4%' }}
        />
        <StatTile
          label="이번 달 저축액"
          value="₩1,850,000"
          description="목표 대비"
          icon={<PiggyBank size={16} />}
          trend={{ direction: 'down', value: '-6.0%' }}
        />
        <StatTile
          label="수익률"
          value="+14.2%"
          description="연초 대비"
          icon={<TrendingUp size={16} />}
          trend={{ direction: 'up', value: '+1.8%p' }}
        />
      </div>
      <Card title="이번 달 저축 목표">
        <Meter value={74} label="₩1,850,000 / ₩2,500,000" variant="brand" showValue />
      </Card>
    </div>
  ),
}
