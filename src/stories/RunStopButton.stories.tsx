import type { Meta, StoryObj } from '@storybook/react-vite'
import { RunButton, StopButton } from '../components/RunStopButton'
import { StatusBadge } from '../components/StatusBadge'

const meta: Meta<typeof RunButton> = {
  title: '컴포넌트/RunButton·StopButton',
  component: RunButton,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof RunButton>

export const Playground: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <RunButton {...args} />
      <StopButton {...args} />
    </div>
  ),
}

/** 실행중 상태 배지 옆에 액션 버튼을 두는 실제 사용 형태 — 실행중일 땐 중지만, 정지 상태일 땐 실행만 활성화. */
export const 상태배지와함께: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="running" />
      <RunButton size="sm" disabled />
      <StopButton size="sm" />
    </div>
  ),
}

export const 사이즈: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <RunButton size="sm" />
      <RunButton size="md" />
      <RunButton size="lg" />
    </div>
  ),
}
