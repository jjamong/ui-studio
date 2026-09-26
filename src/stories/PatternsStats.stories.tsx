import type { Meta, StoryObj } from '@storybook/react-vite'
import { Eye, UserPlus, Users } from 'lucide-react'
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
          label="전체 사용자"
          value="12,842명"
          description="전월 대비"
          icon={<Users size={16} />}
          trend={{ direction: 'up', value: '+2.4%' }}
        />
        <StatTile
          label="이번 달 신규 가입"
          value="185명"
          description="목표 대비"
          icon={<UserPlus size={16} />}
          trend={{ direction: 'down', value: '-6.0%' }}
        />
        <StatTile
          label="공지사항 조회수"
          value="4,210회"
          description="전주 대비"
          icon={<Eye size={16} />}
          trend={{ direction: 'up', value: '+1.8%' }}
        />
      </div>
      <Card title="이번 달 신규 가입 목표">
        <Meter value={74} label="185명 / 250명" variant="brand" showValue />
      </Card>
    </div>
  ),
}
