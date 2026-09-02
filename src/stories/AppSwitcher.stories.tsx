import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboard, Megaphone } from 'lucide-react'
import { AppSwitcher } from '../components/AppSwitcher'
import type { AppSwitcherItem } from '../components/AppSwitcher'

const items: AppSwitcherItem[] = [
  {
    key: 'dashboard',
    label: '대시보드',
    description: '전체 현황을 한눈에 보는 홈',
    icon: <LayoutDashboard size={18} strokeWidth={2.25} />,
    badgeClassName: 'bg-[var(--ds-background-accent-gray-bolder)]',
    onSelect: () => {},
  },
  {
    key: 'notice',
    label: '공지사항',
    description: '전체 공지/이벤트 관리',
    icon: <Megaphone size={18} strokeWidth={2.25} />,
    badgeClassName: 'bg-[var(--ds-background-accent-blue-bolder)]',
    onSelect: () => {},
  },
]

const meta: Meta<typeof AppSwitcher> = {
  title: '컴포넌트/AppSwitcher',
  component: AppSwitcher,
  args: { items },
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof AppSwitcher>

/** 3x3 동그란 점 9개 (가로 3개 x 세로 3개 쩜쩜쩜) 기본 모드 */
export const Dots3x3: Story = {
  args: {
    iconType: 'dots-3x3',
  },
}

/** 가로 점점점 (...) 아이콘 모드 */
export const DotsHorizontal: Story = {
  args: {
    iconType: 'dots',
  },
}


/** 세로 점점점 (⋮) 아이콘 모드 */
export const DotsVertical: Story = {
  args: {
    iconType: 'dots-vertical',
  },
}

/** Grip 점 핸들 아이콘 모드 */
export const GripDots: Story = {
  args: {
    iconType: 'grip',
  },
}

/** 3x3 격자 아이콘 + 와플 타일 레이아웃 조합 */
export const GridWaffle: Story = {
  args: {
    iconType: 'grid',
    variant: 'grid',
  },
}


