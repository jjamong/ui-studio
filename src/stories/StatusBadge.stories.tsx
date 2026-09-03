import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBadge } from '../components/StatusBadge'
import type { StatusBadgeStatus } from '../components/StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: '컴포넌트/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: { control: 'select', options: ['pending', 'running', 'success', 'failed', 'stopped'] },
  },
}
export default meta

type Story = StoryObj<typeof StatusBadge>

export const Playground: Story = {
  args: { status: 'running' },
}

const allStatuses: StatusBadgeStatus[] = ['pending', 'running', 'success', 'failed', 'stopped']

/** 배치 작업 상태: 대기 → 실행중 → 완료/실패, 필요하면 중지. */
export const 배치작업상태: Story = {
  render: () => (
    <div className="flex gap-2">
      {allStatuses.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
}

/** 실행 결과처럼 라벨을 바꿔 쓰고 싶을 때는 label로 덮어쓴다. */
export const 실행결과라벨: Story = {
  render: () => (
    <div className="flex gap-2">
      <StatusBadge status="success" label="성공" />
      <StatusBadge status="failed" label="실패" />
    </div>
  ),
}

/** 텍스트 없이 아이콘만 — 테이블 실행 결과 컬럼처럼 자리를 적게 차지해야 할 때. 접근성 라벨(aria-label)은 유지된다. */
export const 아이콘만: Story = {
  render: () => (
    <div className="flex gap-3">
      {allStatuses.map((status) => (
        <StatusBadge key={status} status={status} showLabel={false} />
      ))}
    </div>
  ),
}
